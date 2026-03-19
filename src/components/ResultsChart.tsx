'use client';

import { useEffect, useRef } from 'react';
import type { WpmDataPoint } from '@/hooks/useTypingEngine';

interface Props {
  data: WpmDataPoint[];
}

export default function ResultsChart({ data }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // We can observe the container size if needed, but for now we'll read its parent clientWidth
    const parent = canvas.parentElement;
    if (!parent) return;

    const rect = parent.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = 140 * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = '140px';
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = 140;
    const padding = { top: 10, right: 20, bottom: 30, left: 45 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    ctx.clearRect(0, 0, w, h);

    if (data.length < 2) {
      ctx.fillStyle = '#a1a1a6';
      ctx.font = '12px var(--font-inter), sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Not enough data for chart', w / 2, h / 2);
      return;
    }

    const maxWpm = Math.max(...data.map(d => d.wpm), 10);
    const maxTime = data[data.length - 1].time;

    // Grid lines
    const gridLines = 4;
    ctx.strokeStyle = 'rgba(0,0,0,0.04)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= gridLines; i++) {
      const y = padding.top + (chartH / gridLines) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(w - padding.right, y);
      ctx.stroke();

      const val = Math.round(maxWpm - (maxWpm / gridLines) * i);
      ctx.fillStyle = '#a1a1a6';
      ctx.font = '10px var(--font-fira-code), monospace';
      ctx.textAlign = 'right';
      ctx.fillText(val.toString(), padding.left - 8, y + 3);
    }

    // X axis labels
    ctx.textAlign = 'center';
    const xLabels = Math.min(data.length, 8);
    const step = Math.max(1, Math.floor(data.length / xLabels));
    for (let i = 0; i < data.length; i += step) {
      const x = padding.left + (data[i].time / maxTime) * chartW;
      ctx.fillStyle = '#a1a1a6';
      ctx.fillText(data[i].time + 's', x, h - 8);
    }

    // Area fill
    const gradient = ctx.createLinearGradient(0, padding.top, 0, h - padding.bottom);
    gradient.addColorStop(0, 'rgba(45, 127, 249, 0.12)');
    gradient.addColorStop(1, 'rgba(45, 127, 249, 0)');

    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top + chartH);
    data.forEach(d => {
      const x = padding.left + (d.time / maxTime) * chartW;
      const y = padding.top + chartH - (d.wpm / maxWpm) * chartH;
      ctx.lineTo(x, y);
    });
    ctx.lineTo(padding.left + (data[data.length - 1].time / maxTime) * chartW, padding.top + chartH);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Line
    ctx.beginPath();
    data.forEach((d, i) => {
      const x = padding.left + (d.time / maxTime) * chartW;
      const y = padding.top + chartH - (d.wpm / maxWpm) * chartH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#2d7ff9';
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.stroke();

    // Data points
    data.forEach(d => {
      const x = padding.left + (d.time / maxTime) * chartW;
      const y = padding.top + chartH - (d.wpm / maxWpm) * chartH;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#2d7ff9';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    });

  }, [data]);

  return (
    <div className="w-full h-[140px] relative">
      <canvas ref={canvasRef} className="absolute inset-0 block" />
    </div>
  );
}
