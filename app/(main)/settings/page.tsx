'use client';

import { useState } from 'react';
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
        label: 'Notifications',
        description: 'Configure how you receive notifications',
        href: '/settings/notifications',
        icon: Bell
      },
    ]
  },
  {
    title: 'Preferences',
    icon: Palette,
    description: 'Customize your experience',
    items: [
      { 
        label: 'Appearance',
        description: 'Customize the look and feel of the application',
        href: '/settings/appearance',
        icon: Palette
      },
      { 
        label: 'Language',
        description: 'Choose your preferred language',
        href: '/settings/language',
        icon: Globe
      }
    ]
  },
  {
    title: 'Billing',
    icon: CreditCard,
    description: 'Manage your billing information and subscription',
    items: [
      { 
        label: 'Payment Methods',
        description: 'Add or remove payment methods',
        href: '/settings/payment',
        icon: CreditCard
      },
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

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [language, setLanguage] = useState('en');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Theme Selector */}
        <div className="mb-12 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Theme Preference</h2>
          <div className="grid grid-cols-3 gap-4">
            {themes.map(({ value, label, icon: Icon }) => (
              <motion.button
                key={value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setTheme(value)}
                className={cn(
                  'relative p-4 rounded-lg',
                  'flex items-center gap-3',
                  'border-2 transition-all duration-200',
                  theme === value
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10'
                    : 'border-gray-200 dark:border-gray-700 hover:border-emerald-500/50'
                )}
              >
                <Icon className={cn(
                  'w-5 h-5',
                  theme === value ? 'text-emerald-500' : 'text-gray-500 dark:text-gray-400'
                )} />
                <span className={cn(
                  'font-medium',
                  theme === value ? 'text-emerald-500' : 'text-gray-700 dark:text-gray-300'
                )}>
                  {label}
                </span>
                {theme === value && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                  >
                    <Check className="w-4 h-4 text-emerald-500" />
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Settings Sections */}
        <div className="space-y-12">
          {settingsSections.map((section) => (
            <SettingsSection key={section.title} {...section} />
          ))}
        </div>

        {/* Logout Button */}
        <div className="mt-12 border-t border-gray-200 dark:border-gray-800 pt-8">
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

function SettingsSection({ title, icon: Icon, description, items }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg">
          <Icon className="w-5 h-5 text-emerald-500" />
        </div>
        <div>
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <motion.a
            key={item.label}
            href={item.href}
            whileHover={{ x: 4 }}
            className={cn(
              'flex items-center justify-between p-4 rounded-lg',
              'border border-gray-100 dark:border-gray-700',
              'hover:border-emerald-500/50 dark:hover:border-emerald-500/50',
              'hover:bg-gray-50 dark:hover:bg-gray-700/50',
              'group transition-all duration-200'
            )}
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-5 h-5 text-gray-400 group-hover:text-emerald-500" />
              <div>
                <div className="font-medium text-gray-700 dark:text-gray-200 group-hover:text-emerald-500">
                  {item.label}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {item.description}
                </div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-500" />
          </motion.a>
        ))}
      </div>
    </div>
  );
}
