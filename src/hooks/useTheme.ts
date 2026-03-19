'use client';

import { useState, useEffect } from 'react';

export type Theme = 'light' | 'midnight' | 'sakura' | 'obsidian' | 'terminal';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('typeflow-theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      // Check system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('midnight');
        document.documentElement.setAttribute('data-theme', 'midnight');
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
      }
    }
  }, []);

  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('typeflow-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return { theme, changeTheme };
}
