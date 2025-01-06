import { Montserrat } from 'next/font/google';
import { cn } from '@/lib/utils';

const montserrat = Montserrat({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  fallback: ['Arial', 'sans-serif'],
});

export default function AuthTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={cn('min-h-screen', montserrat.className)}>
      {children}
    </div>
  );
} 