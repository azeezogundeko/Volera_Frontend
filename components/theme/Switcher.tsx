'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export default function ThemeSwitcher({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <button
        onClick={() => setTheme('light')}
        className={cn(
          'p-2 rounded-lg transition-colors',
          theme === 'light' 
            ? 'bg-emerald-100 text-emerald-900' 
            : 'hover:bg-light-100 dark:hover:bg-dark-100 text-black/70 dark:text-white/70'
        )}
        aria-label="Light mode"
      >
        <Sun className="w-5 h-5" />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={cn(
          'p-2 rounded-lg transition-colors',
          theme === 'dark' 
            ? 'bg-emerald-900 text-emerald-100' 
            : 'hover:bg-light-100 dark:hover:bg-dark-100 text-black/70 dark:text-white/70'
        )}
        aria-label="Dark mode"
      >
        <Moon className="w-5 h-5" />
      </button>
    </div>
  );
}
