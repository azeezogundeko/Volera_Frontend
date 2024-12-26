'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

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
    <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-light-200 dark:bg-dark-200">
      <input
        type="checkbox"
        className="peer sr-only"
        id="theme-toggle"
        checked={theme === 'dark'}
        onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
      />
      <span className="peer-checked:translate-x-6 absolute left-[2px] top-[2px] h-5 w-5 transform rounded-full bg-white transition-transform flex items-center justify-center">
        {theme === 'dark' ? (
          <Moon className="w-3 h-3 text-black/70" />
        ) : (
          <Sun className="w-3 h-3 text-black/70" />
        )}
      </span>
    </div>
  );
}
