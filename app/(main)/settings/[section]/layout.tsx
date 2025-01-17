'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';

const sections = [
  {
    title: 'Profile',
    href: '/settings/profile',
    description: 'Manage your personal information'
  },
  {
    title: 'Security',
    href: '/settings/security',
    description: 'Update your password and security settings'
  },
  {
    title: 'Notifications',
    href: '/settings/notifications',
    description: 'Control your notification preferences'
  },
  {
    title: 'Billing',
    href: '/settings/billing',
    description: 'Manage your billing and subscription'
  },
  {
    title: 'Payment Methods',
    href: '/settings/payment-methods',
    description: 'Manage your payment methods'
  },
  {
    title: 'Subscription',
    href: '/settings/subscription',
    description: 'View and manage your subscription'
  }
];

export default function SettingsSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const currentSection = sections.find(section => section.href === pathname);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/settings"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Settings
          </Link>
        </div>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {currentSection?.title}
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {currentSection?.description}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-4">
            <nav className="p-6 border-r border-gray-200 dark:border-gray-700">
              <ul className="space-y-2">
                {sections.map((section) => (
                  <li key={section.href}>
                    <Link
                      href={section.href}
                      className={cn(
                        'block px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                        pathname === section.href
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700/50'
                      )}
                    >
                      {section.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <main className="p-6 md:col-span-3">
              {children}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
