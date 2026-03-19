import type { Metadata } from "next";
import { Inter, Fira_Code } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://typeflow-typing.vercel.app"),
  title: {
    default: "TypeFlow — Premium Typing Test",
    template: "%s | TypeFlow"
  },
  description: "TypeFlow is a beautifully designed typing test platform. Measure your WPM, accuracy, and improve your typing speed with timed tests and custom paragraphs.",
  keywords: ["typing test", "wpm", "typing practice", "minimalist typing", "typeflow", "coding typing"],
  authors: [{ name: "Pankaj" }],
  creator: "Pankaj",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://typeflow-typing.vercel.app",
    title: "TypeFlow — Premium Typing Test",
    description: "Measure your WPM and accuracy with our beautifully designed minimalist typing test.",
    siteName: "TypeFlow",
    images: [{
      url: "/og-image.png",
      width: 1200,
      height: 630,
      alt: "TypeFlow Preview"
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "TypeFlow — Premium Typing Test",
    description: "Measure your WPM and accuracy with our beautifully designed minimalist typing test.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${firaCode.variable} antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
