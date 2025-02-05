import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import Sidebar from '@/components/Sidebar';
import LoadingPage from '@/components/LoadingPage';
import { Toaster } from 'sonner';
import ThemeProvider from '@/components/theme/Provider';
import { Suspense } from 'react';
import { SessionProvider } from '@/components/providers/SessionProvider'

const montserrat = Montserrat({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  fallback: ['Arial', 'sans-serif'],
});

export const metadata: Metadata = {
  title: 'Volera - Shop with Artificial Intelligence',
  description:
    'Volera is an AI powered agentic shopping assistant.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="h-full" lang="en" suppressHydrationWarning>
      <body className={cn('h-full', montserrat.className)}>
        <SessionProvider>
          {/* Your existing providers */}
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
