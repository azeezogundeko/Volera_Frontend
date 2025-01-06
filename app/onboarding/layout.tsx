import { Metadata } from 'next';
import React from 'react';
import { Toaster } from 'sonner';
import ThemeProvider from '@/components/theme/Provider';
import OnboardingProgress from '@/components/OnboardingProgress';

export const metadata: Metadata = {
  title: 'Welcome to Volera - Your Shopping Assistant',
  description: 'Get started with Volera, your AI-powered shopping assistant.',
};

const OnboardingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen">
      <ThemeProvider>
        <OnboardingProgress currentStep={1} totalSteps={3} />
        <main className="pt-16 px-4 sm:px-6">
          {children}
        </main>
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

export default OnboardingLayout; 