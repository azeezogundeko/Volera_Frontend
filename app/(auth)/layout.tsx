import { Metadata } from 'next';
import React from 'react';
import ThemeProvider from '@/components/theme/Provider';

export const metadata: Metadata = {
  title: 'Volera - Your Shopping Assistant',
  description: 'Get started with Volera, your AI-powered shopping assistant.',
};

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </div>
  );
};

export default AuthLayout; 