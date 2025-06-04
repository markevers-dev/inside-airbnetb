import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/header';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Inside Airbnetb',
  description: 'This is an app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex w-full max-w-screen flex-col items-center justify-between gap-y-4 bg-slate-100 font-[family-name:var(--font-geist-sans)] antialiased md:gap-y-12`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
