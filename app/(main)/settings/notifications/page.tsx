'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  Smartphone,
  Globe,
  Clock,
  Users,
  Heart,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotificationChannel {
  email: boolean;
  push: boolean;
  inApp: boolean;
}

interface NotificationSettings {
  securityAlerts: NotificationChannel;
  accountUpdates: NotificationChannel;
  newMessages: NotificationChannel;
  reminders: NotificationChannel;
  mentions: NotificationChannel;
  likes: NotificationChannel;
  reviews: NotificationChannel;
  newsletter: NotificationChannel;
  marketingEmails: boolean;
  digestFrequency: 'daily' | 'weekly' | 'monthly' | 'never';
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

export default function NotificationSettings() {
  const [settings, setSettings] = useState<NotificationSettings>({
    securityAlerts: { email: true, push: true, inApp: true },
    accountUpdates: { email: true, push: false, inApp: true },
    newMessages: { email: true, push: true, inApp: true },
    reminders: { email: true, push: true, inApp: true },
    mentions: { email: true, push: true, inApp: true },
    likes: { email: false, push: true, inApp: true },
    reviews: { email: true, push: true, inApp: true },
    newsletter: { email: true, push: false, inApp: true },
    marketingEmails: false,
    digestFrequency: 'weekly',
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '07:00',
    },
  });

  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Handle unsaved changes warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const handleChannelChange = (
    category: keyof Omit<NotificationSettings, 'marketingEmails' | 'digestFrequency' | 'quietHours'>,
    channel: keyof NotificationChannel,
    value: boolean
  ) => {
    setIsDirty(true);
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [channel]: value,
      },
    }));
  };

  const handleSettingChange = (
    setting: 'marketingEmails' | 'digestFrequency' | 'quietHours',
    value: any
  ) => {
    setIsDirty(true);
    setSettings(prev => ({
      ...prev,
      [setting]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShowSuccess(true);
      setIsDirty(false);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      // Handle error
    } finally {
      setIsSaving(false);
    }
  };

  const NotificationToggle = ({ 
    checked, 
    onChange,
    size = 'default'
  }: { 
    checked: boolean; 
    onChange: (checked: boolean) => void;
    size?: 'default' | 'small';
  }) => (
    <div className={cn(
      "relative inline-block",
      size === 'default' ? "w-14 h-8" : "w-11 h-6"
    )}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="peer sr-only"
      />
      <label
        className={cn(
          "absolute cursor-pointer inset-0 rounded-full bg-gray-200 peer-checked:bg-emerald-500 transition-colors duration-300",
          "after:content-[''] after:absolute after:bg-white after:rounded-full after:transition-transform after:duration-300",
          size === 'default' 
            ? "after:h-6 after:w-6 after:left-1 after:top-1 peer-checked:after:translate-x-6"
            : "after:h-4 after:w-4 after:left-1 after:top-1 peer-checked:after:translate-x-5"
        )}
      />
    </div>
  );

  const categories = [
    {
      id: 'securityAlerts',
      title: 'Security Alerts',
      description: 'Get notified about important security updates and login attempts',
      icon: AlertCircle,
    },
    {
      id: 'accountUpdates',
      title: 'Account Updates',
      description: 'Receive updates about your account status and changes',
      icon: Users,
    },
    {
      id: 'newMessages',
      title: 'New Messages',
      description: 'Get notified when you receive new messages',
      icon: MessageSquare,
    },
    {
      id: 'reminders',
      title: 'Reminders',
      description: 'Receive reminders about upcoming events and tasks',
      icon: Calendar,
    },
    {
      id: 'mentions',
      title: 'Mentions',
      description: 'Get notified when someone mentions you',
      icon: Users,
    },
    {
      id: 'likes',
      title: 'Likes',
      description: 'Receive notifications when someone likes your content',
      icon: Heart,
    },
    {
      id: 'reviews',
      title: 'Reviews',
      description: 'Get notified about new reviews and ratings',
      icon: Star,
    },
    {
      id: 'newsletter',
      title: 'Newsletter',
      description: 'Receive our newsletter with updates and tips',
      icon: Mail,
    },
  ] as const;

  return (
    <div className="space-y-8">
      <AnimatePresence>
        {isDirty && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 bg-emerald-50 dark:bg-emerald-900/50 text-emerald-900 dark:text-emerald-100 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4" />
            You have unsaved changes
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Notification Channels Section */}
        <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Notification Preferences</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Choose how you want to be notified for different activities
            </p>
          </div>

          <div className="space-y-6">
            {categories.map(({ id, title, description, icon: Icon }) => (
              <div key={id} className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700">
                    <Icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">{title}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center gap-1">
                    <NotificationToggle
                      checked={settings[id].email}
                      onChange={(checked) => handleChannelChange(id, 'email', checked)}
                      size="small"
                    />
                    <span className="text-xs text-gray-500 dark:text-gray-400">Email</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <NotificationToggle
                      checked={settings[id].push}
                      onChange={(checked) => handleChannelChange(id, 'push', checked)}
                      size="small"
                    />
                    <span className="text-xs text-gray-500 dark:text-gray-400">Push</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <NotificationToggle
                      checked={settings[id].inApp}
                      onChange={(checked) => handleChannelChange(id, 'inApp', checked)}
                      size="small"
                    />
                    <span className="text-xs text-gray-500 dark:text-gray-400">In-App</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Email Preferences Section */}
        <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Email Preferences</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage your email notification preferences
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Marketing Emails</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receive emails about new features and special offers
                </p>
              </div>
              <NotificationToggle
                checked={settings.marketingEmails}
                onChange={(checked) => handleSettingChange('marketingEmails', checked)}
              />
            </div>

            <div>
              <label htmlFor="digestFrequency" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Digest Frequency
              </label>
              <select
                id="digestFrequency"
                value={settings.digestFrequency}
                onChange={(e) => handleSettingChange('digestFrequency', e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="never">Never</option>
              </select>
            </div>
          </div>
        </section>

        {/* Quiet Hours Section */}
        <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Quiet Hours</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Set a time period when you don't want to receive notifications
              </p>
            </div>
            <NotificationToggle
              checked={settings.quietHours.enabled}
              onChange={(checked) => handleSettingChange('quietHours', { ...settings.quietHours, enabled: checked })}
            />
          </div>

          {settings.quietHours.enabled && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="quietHoursStart" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Start Time
                </label>
                <input
                  type="time"
                  id="quietHoursStart"
                  value={settings.quietHours.start}
                  onChange={(e) => handleSettingChange('quietHours', { ...settings.quietHours, start: e.target.value })}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label htmlFor="quietHoursEnd" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  End Time
                </label>
                <input
                  type="time"
                  id="quietHoursEnd"
                  value={settings.quietHours.end}
                  onChange={(e) => handleSettingChange('quietHours', { ...settings.quietHours, end: e.target.value })}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
          )}
        </section>

        {/* Save Button */}
        <div className="flex justify-end gap-4">
          <motion.button
            type="button"
            onClick={() => {
              setSettings({
                securityAlerts: { email: true, push: true, inApp: true },
                accountUpdates: { email: true, push: false, inApp: true },
                newMessages: { email: true, push: true, inApp: true },
                reminders: { email: true, push: true, inApp: true },
                mentions: { email: true, push: true, inApp: true },
                likes: { email: false, push: true, inApp: true },
                reviews: { email: true, push: true, inApp: true },
                newsletter: { email: true, push: false, inApp: true },
                marketingEmails: false,
                digestFrequency: 'weekly',
                quietHours: {
                  enabled: false,
                  start: '22:00',
                  end: '07:00',
                },
              });
              setIsDirty(false);
            }}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSaving}
          >
            Reset
          </motion.button>
          
          <motion.button
            type="submit"
            className={cn(
              "px-4 py-2 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500",
              isSaving
                ? "bg-emerald-500 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700"
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSaving}
          >
            <span className="flex items-center gap-2">
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : showSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Saved!
                </>
              ) : (
                'Save Changes'
              )}
            </span>
          </motion.button>
        </div>
      </form>
    </div>
  );
}
