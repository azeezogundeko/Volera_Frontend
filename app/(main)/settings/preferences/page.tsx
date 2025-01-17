'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings,
  Moon,
  Sun,
  Monitor,
  Globe,
  Clock,
  DollarSign,
  Bell,
  Shield,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface PreferencesData {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  currency: string;
  notifications: {
    email: boolean;
    push: boolean;
    inApp: boolean;
    marketing: boolean;
    digest: 'daily' | 'weekly' | 'monthly' | 'never';
    quietHours: {
      enabled: boolean;
      start: string;
      end: string;
    };
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'contacts';
    showEmail: boolean;
    showPhone: boolean;
    showLocation: boolean;
  };
}

export default function PreferencesSettings() {
  const [formData, setFormData] = useState<PreferencesData>({
    theme: 'system',
    language: 'en',
    timezone: 'UTC',
    currency: 'USD',
    notifications: {
      email: true,
      push: true,
      inApp: true,
      marketing: false,
      digest: 'weekly',
      quietHours: {
        enabled: false,
        start: '22:00',
        end: '07:00',
      },
    },
    privacy: {
      profileVisibility: 'public',
      showEmail: true,
      showPhone: false,
      showLocation: true,
    },
  });

  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (
    field: string,
    value: string | boolean | object
  ) => {
    setIsDirty(true);
    setFormData(prev => {
      const newData = { ...prev };
      const fields = field.split('.');
      let current: any = newData;
      
      for (let i = 0; i < fields.length - 1; i++) {
        current = current[fields[i]];
      }
      
      current[fields[fields.length - 1]] = value;
      return newData;
    });
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
        {/* Appearance Section */}
        <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Appearance</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Theme
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'light', label: 'Light', icon: Sun },
                    { value: 'dark', label: 'Dark', icon: Moon },
                    { value: 'system', label: 'System', icon: Monitor },
                  ].map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleInputChange('theme', value)}
                      className={`
                        flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-colors
                        ${formData.theme === value
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
                          : 'border-gray-200 dark:border-gray-700 hover:border-emerald-200 dark:hover:border-emerald-800'
                        }
                      `}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Localization Section */}
        <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Localization</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Language
                </label>
                <select
                  id="language"
                  value={formData.language}
                  onChange={(e) => handleInputChange('language', e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>

              <div>
                <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Timezone
                </label>
                <select
                  id="timezone"
                  value={formData.timezone}
                  onChange={(e) => handleInputChange('timezone', e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="UTC">UTC</option>
                  <option value="EST">Eastern Time</option>
                  <option value="PST">Pacific Time</option>
                </select>
              </div>

              <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Currency
                </label>
                <select
                  id="currency"
                  value={formData.currency}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Notification Preferences */}
        <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Notifications</h3>
            
            <div className="space-y-4">
              {/* Notification Channels */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200">Notification Channels</h4>
                {[
                  { key: 'email', label: 'Email Notifications' },
                  { key: 'push', label: 'Push Notifications' },
                  { key: 'inApp', label: 'In-App Notifications' },
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-200">{label}</span>
                    <button
                      type="button"
                      onClick={() => handleInputChange(`notifications.${key}`, !formData.notifications[key as keyof typeof formData.notifications])}
                      className={`
                        relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer 
                        transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500
                        ${formData.notifications[key as keyof typeof formData.notifications] ? 'bg-emerald-600' : 'bg-gray-200 dark:bg-gray-700'}
                      `}
                    >
                      <span
                        className={`
                          pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200
                          ${formData.notifications[key as keyof typeof formData.notifications] ? 'translate-x-5' : 'translate-x-0'}
                        `}
                      />
                    </button>
                  </div>
                ))}
              </div>

              {/* Email Digest */}
              <div>
                <label htmlFor="digest" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Email Digest Frequency
                </label>
                <select
                  id="digest"
                  value={formData.notifications.digest}
                  onChange={(e) => handleInputChange('notifications.digest', e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="never">Never</option>
                </select>
              </div>

              {/* Quiet Hours */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Quiet Hours</span>
                  <button
                    type="button"
                    onClick={() => handleInputChange('notifications.quietHours.enabled', !formData.notifications.quietHours.enabled)}
                    className={`
                      relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer 
                      transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500
                      ${formData.notifications.quietHours.enabled ? 'bg-emerald-600' : 'bg-gray-200 dark:bg-gray-700'}
                    `}
                  >
                    <span
                      className={`
                        pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200
                        ${formData.notifications.quietHours.enabled ? 'translate-x-5' : 'translate-x-0'}
                      `}
                    />
                  </button>
                </div>

                {formData.notifications.quietHours.enabled && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="quietHoursStart" className="block text-sm text-gray-700 dark:text-gray-200">
                        Start Time
                      </label>
                      <input
                        type="time"
                        id="quietHoursStart"
                        value={formData.notifications.quietHours.start}
                        onChange={(e) => handleInputChange('notifications.quietHours.start', e.target.value)}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label htmlFor="quietHoursEnd" className="block text-sm text-gray-700 dark:text-gray-200">
                        End Time
                      </label>
                      <input
                        type="time"
                        id="quietHoursEnd"
                        value={formData.notifications.quietHours.end}
                        onChange={(e) => handleInputChange('notifications.quietHours.end', e.target.value)}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Privacy Settings */}
        <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Privacy</h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="profileVisibility" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Profile Visibility
                </label>
                <select
                  id="profileVisibility"
                  value={formData.privacy.profileVisibility}
                  onChange={(e) => handleInputChange('privacy.profileVisibility', e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="contacts">Contacts Only</option>
                </select>
              </div>

              {/* Privacy Toggles */}
              <div className="space-y-3">
                {[
                  { key: 'showEmail', label: 'Show Email Address' },
                  { key: 'showPhone', label: 'Show Phone Number' },
                  { key: 'showLocation', label: 'Show Location' },
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-200">{label}</span>
                    <button
                      type="button"
                      onClick={() => handleInputChange(`privacy.${key}`, !formData.privacy[key as keyof typeof formData.privacy])}
                      className={`
                        relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer 
                        transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500
                        ${formData.privacy[key as keyof typeof formData.privacy] ? 'bg-emerald-600' : 'bg-gray-200 dark:bg-gray-700'}
                      `}
                    >
                      <span
                        className={`
                          pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200
                          ${formData.privacy[key as keyof typeof formData.privacy] ? 'translate-x-5' : 'translate-x-0'}
                        `}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 right-4 bg-emerald-50 dark:bg-emerald-900/50 text-emerald-900 dark:text-emerald-100 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            Changes saved successfully
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
