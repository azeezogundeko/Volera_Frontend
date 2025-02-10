import React from 'react';
import { Toaster } from 'sonner';
import ThemeProvider from '@/components/theme/Provider';
import Sidebar from '@/components/Sidebar';
import LoadingPage from '@/components/LoadingPage';
import { Suspense } from 'react';
import { SessionProvider } from '@/components/providers/SessionProvider';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <ThemeProvider>
        <Suspense fallback={<LoadingPage />}>
          <Sidebar>{children}</Sidebar>
        </Suspense>
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
    </SessionProvider>
  );
};

export default MainLayout;