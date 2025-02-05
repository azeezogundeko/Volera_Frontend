'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import process from 'process';
import { useApi } from '@/lib/hooks/useApi';

interface PreferencesData {
  interest?: string[];
  price_range?: string;
  shopping_frequency?: string;
  preferred_categories?: string[];
  notification_preferences?: string[];
}

const CATEGORIES = [
  'Fashion & Apparel', 'Electronics', 'Home & Living',
  'Beauty & Health', 'Sports & Fitness', 'Books & Media',
  'Toys & Games', 'Jewelry & Accessories', 'Food & Grocery'
];

const NOTIFICATION_TYPES = [
  'Price Drops', 'New Arrivals', 'Flash Sales',
  'Similar Items', 'Back in Stock', 'Daily Deals'
];

export default function PreferencesSettings() {
  const { fetchWithAuth } = useApi();
  const [formData, setFormData] = useState<PreferencesData>({
    interest: [],
    price_range: 'mid',
    shopping_frequency: 'monthly',
    preferred_categories: ['Electronics', 'Books & Media'],
    notification_preferences: ['Price Drops', 'Flash Sales']
  });

  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/settings/preferences`);
        const data = await response.json();
        setFormData(data);
      } catch (error) {
        console.error('Failed to fetch preferences:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPreferences();
  }, []);

  const toggleCategory = (category: string) => {
    setFormData(prev => ({
      ...prev,
      preferred_categories: prev.preferred_categories?.includes(category)
        ? prev.preferred_categories.filter(c => c !== category)
        : [...(prev.preferred_categories || []), category],
    }));
    setIsDirty(true);
  };

  const toggleNotification = (type: string) => {
    setFormData(prev => ({
      ...prev,
      notification_preferences: prev.notification_preferences?.includes(type)
        ? prev.notification_preferences.filter(t => t !== type)
        : [...(prev.notification_preferences || []), type],
    }));
    setIsDirty(true);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setIsDirty(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/settings/preferences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save preferences');
      }

      setShowSuccess(true);
      setIsDirty(false);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving preferences:', error);
      // Handle error (e.g., show a notification)
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white/90">Shopping Preferences</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-white/60">
            Customize your shopping experience and notification settings
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
              <p className="text-sm text-gray-600 dark:text-white/60">Loading preferences...</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Shopping Preferences */}
            <div className="bg-white dark:bg-[#141414] rounded-2xl border border-gray-200 dark:border-[#222] p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white/90 mb-6">Shopping Preferences</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-2">
                    Shopping Frequency
                  </label>
                  <select
                    name="shopping_frequency"
                    value={formData.shopping_frequency}
                    onChange={handleSelectChange}
                    className={cn(
                      'w-full px-3 py-2 rounded-lg',
                      'bg-white dark:bg-[#0a0a0a]',
                      'border border-gray-300 dark:border-[#222]',
                      'text-gray-900 dark:text-white',
                      'focus:outline-none focus:ring-2 focus:ring-emerald-500/50',
                      'transition-colors duration-200'
                    )}
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Every few months</option>
                    <option value="occasionally">Occasionally</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-2">
                    Preferred Price Range
                  </label>
                  <select
                    name="price_range"
                    value={formData.price_range}
                    onChange={handleSelectChange}
                    className={cn(
                      'w-full px-3 py-2 rounded-lg',
                      'bg-white dark:bg-[#0a0a0a]',
                      'border border-gray-300 dark:border-[#222]',
                      'text-gray-900 dark:text-white',
                      'focus:outline-none focus:ring-2 focus:ring-emerald-500/50',
                      'transition-colors duration-200'
                    )}
                  >
                    <option value="budget">Budget-friendly</option>
                    <option value="mid">Mid-range</option>
                    <option value="premium">Premium</option>
                    <option value="luxury">Luxury</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Shopping Categories */}
            <div className="bg-white dark:bg-[#141414] rounded-2xl border border-gray-200 dark:border-[#222] p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white/90 mb-6">Shopping Categories</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {CATEGORIES.map(category => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => toggleCategory(category)}
                    className={cn(
                      'px-3 py-2 rounded-lg text-sm w-full',
                      'border transition-colors',
                      'flex items-center gap-2',
                      'min-h-[2.5rem]',
                      formData.preferred_categories?.includes(category)
                        ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                        : 'bg-white dark:bg-[#0a0a0a] border-gray-300 dark:border-[#222] text-gray-700 dark:text-white/70 hover:border-emerald-500/30'
                    )}
                  >
                    {formData.preferred_categories?.includes(category) && (
                      <Check className="w-4 h-4 flex-shrink-0" />
                    )}
                    <span className="text-left flex-1 line-clamp-1">{category}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="bg-white dark:bg-[#141414] rounded-2xl border border-gray-200 dark:border-[#222] p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white/90 mb-6">Notification Preferences</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {NOTIFICATION_TYPES.map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleNotification(type)}
                    className={cn(
                      'px-3 py-2 rounded-lg text-sm w-full',
                      'border transition-colors',
                      'flex items-center gap-2',
                      'min-h-[2.5rem]',
                      formData.notification_preferences?.includes(type)
                        ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                        : 'bg-white dark:bg-[#0a0a0a] border-gray-300 dark:border-[#222] text-gray-700 dark:text-white/70 hover:border-emerald-500/30'
                    )}
                  >
                    {formData.notification_preferences?.includes(type) && (
                      <Check className="w-4 h-4 flex-shrink-0" />
                    )}
                    <span className="text-left flex-1 line-clamp-1">{type}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!isDirty || isSaving}
                className={cn(
                  'px-6 py-2 rounded-lg',
                  'bg-emerald-500 hover:bg-emerald-600',
                  'text-white font-medium',
                  'flex items-center gap-2',
                  'transition-colors',
                  'disabled:opacity-50 disabled:hover:bg-emerald-500'
                )}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        )}

        {/* Success Message */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-4 right-4 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-900 dark:text-emerald-300 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Changes saved successfully
            </motion.div>
          )}
        </AnimatePresence>

        {/* Unsaved Changes Warning */}
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
      </div>
    </div>
  );
}
