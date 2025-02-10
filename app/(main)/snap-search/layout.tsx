'use client';

import { ThemeProvider } from '@/app/contexts/ThemeContext';

export default function SnapSearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
} 