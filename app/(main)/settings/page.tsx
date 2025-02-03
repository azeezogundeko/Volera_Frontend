'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  CreditCard, 
  HelpCircle,
  ChevronRight,
  Moon,
  Sun,
  Globe,
  Bell as BellIcon,
  Mail,
  LogOut,
  Monitor,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

const settingsSections = [
  {
    title: 'Account',
    icon: User,
    description: 'Manage your account settings and preferences',
    items: [
      { 
        label: 'Profile Information',
        description: 'Update your personal information and profile settings',
        href: '/settings/profile',
        icon: User
      },
      { 
        label: 'Security',
        description: 'Manage your password and security preferences',
        href: '/settings/security',
        icon: Shield
      },
      { 
        label: 'Preferences',
        description: 'Manage your shopping preferences',
        href: '/settings/preferences',
        icon: Globe
      },
    ]
  },
  {
    title: 'Billing',
    icon: CreditCard,
    description: 'Manage your billing information and subscription',
    items: [
      { 
        label: 'Subscription',
        description: 'View and manage your subscription',
        href: '/settings/subscription',
        icon: CreditCard
      }
    ]
  }
];

const themes = [
  {
    value: 'light',
    label: 'Light',
    icon: Sun
  },
  {
    value: 'dark',
    label: 'Dark',
    icon: Moon
  },
  {
    value: 'system',
    label: 'System',
    icon: Monitor
  }
] as const;

interface SettingsSectionProps {
  title: string;
  icon: React.ElementType;
  description: string;
  items: {
    label: string;
    description: string;
    href: string;
    icon: React.ElementType;
  }[];
}

function SettingsSection({ title, icon: Icon, description, items }: SettingsSectionProps) {
  return (
    <div className="bg-white dark:bg-[#141414] rounded-2xl border border-gray-200 dark:border-[#222] shadow-sm p-4 sm:p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg">
          <Icon className="w-5 h-5 text-emerald-500" />
        </div>
        <div>
          <h2 className="text-lg font-medium text-gray-900 dark:text-white/90">{title}</h2>
          <p className="text-sm text-gray-500 dark:text-white/60">{description}</p>
        </div>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="group flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-[#222] hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-50 dark:bg-white/5 rounded-lg group-hover:bg-emerald-50 dark:group-hover:bg-emerald-500/10 transition-colors">
                <item.icon className="w-5 h-5 text-gray-500 dark:text-white/60 group-hover:text-emerald-500" />
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white/90 group-hover:text-emerald-500">
                  {item.label}
                </div>
                <div className="text-sm text-gray-500 dark:text-white/60">
                  {item.description}
                </div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 dark:text-white/40 group-hover:text-emerald-500" />
          </a>
        ))}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [language, setLanguage] = useState('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors duration-300">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white/90">Settings</h1>
            <p className="mt-2 text-base text-gray-600 dark:text-white/60">
              Manage your account settings and preferences
            </p>
          </div>
          
          {/* Loading state for theme selector */}
          <div className="mb-12 bg-white dark:bg-[#141414] rounded-2xl border border-gray-200 dark:border-[#222] shadow-sm p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white/90 mb-4 sm:mb-6">Theme Preference</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {themes.map(({ value, label, icon: Icon }) => (
                <div
                  key={value}
                  className="relative py-3 sm:py-4 px-4 rounded-lg flex items-center justify-between sm:justify-start gap-3 border-2 border-gray-200 dark:border-[#222]"
                >
                  <div className="flex items-center gap-3 flex-1 sm:flex-none">
                    <Icon className="w-5 h-5 text-gray-500 dark:text-white/60" />
                    <span className="font-medium text-gray-700 dark:text-white/90">
                      {label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Settings Sections */}
          <div className="space-y-6">
            {settingsSections.map((section) => (
              <SettingsSection key={section.title} {...section} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors duration-300">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white/90">Settings</h1>
          <p className="mt-2 text-base text-gray-600 dark:text-white/60">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Theme Selector */}
        <div className="mb-12 bg-white dark:bg-[#141414] rounded-2xl border border-gray-200 dark:border-[#222] shadow-sm p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white/90 mb-4 sm:mb-6">Theme Preference</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {themes.map(({ value, label, icon: Icon }) => (
              <motion.button
                key={value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setTheme(value)}
                className={cn(
                  'relative py-3 sm:py-4 px-4 rounded-lg',
                  'flex items-center justify-between sm:justify-start gap-3',
                  'border-2 transition-all duration-200',
                  theme === value
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10'
                    : 'border-gray-200 dark:border-[#222] hover:border-emerald-500/50'
                )}
              >
                <div className="flex items-center gap-3 flex-1 sm:flex-none">
                  <Icon className={cn(
                    'w-5 h-5',
                    theme === value ? 'text-emerald-500' : 'text-gray-500 dark:text-white/60'
                  )} />
                  <span className={cn(
                    'font-medium',
                    theme === value ? 'text-emerald-500' : 'text-gray-700 dark:text-white/90'
                  )}>
                    {label}
                  </span>
                </div>
                {theme === value && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex-shrink-0"
                  >
                    <Check className="w-4 h-4 text-emerald-500" />
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {settingsSections.map((section) => (
            <SettingsSection key={section.title} {...section} />
          ))}
        </div>

        {/* Logout Button */}
        <div className="mt-12 border-t border-gray-200 dark:border-[#222] pt-8">
          <button
            onClick={() => {}}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
