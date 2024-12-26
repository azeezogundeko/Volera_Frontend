'use client';
import { ThemeProvider } from 'next-themes';

const ThemeProviderComponent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <ThemeProvider 
      attribute="class" 
      defaultTheme="light"
      enableSystem={true}
      themes={['light', 'dark']}
    >
      {children}
    </ThemeProvider>
  );
};

export default ThemeProviderComponent;
