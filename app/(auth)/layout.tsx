import { Metadata } from 'next';
import React from 'react';
import { Toaster } from 'sonner';
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
        <Toaster
          toastOptions={{
            unstyled: true,
            classNames: {
              toast:
                'bg-light-primary dark:bg-dark-secondary dark:text-white/70 text-black-70 rounded-lg p-4 flex flex-row items-center space-x-2',
            },
          }}
        />
      </ThemeProvider>
    </div>
  );
};

export default AuthLayout; 