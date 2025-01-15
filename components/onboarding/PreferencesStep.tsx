'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface PreferencesData {
  interests: string[];
  price_range: string;
  shopping_frequency: string;
  preferred_categories: string[];
  notification_preferences: string[];
}

interface PreferencesStepProps {
  onSave: (data: PreferencesData) => void;
  initialData?: Partial<PreferencesData>;
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


export default function PreferencesStep({ onSave, initialData = {} }: PreferencesStepProps) {
  const [formData, setFormData] = useState<PreferencesData>({
    interests: initialData.interests || [],
    price_range: initialData.price_range || '',
    shopping_frequency: initialData.shopping_frequency || '',
    preferred_categories: initialData.preferred_categories || [],
    notification_preferences: initialData.notification_preferences || [],
  });

  const toggleCategory = (category: string) => {
    setFormData(prev => ({
      ...prev,
      preferred_categories: prev.preferred_categories.includes(category)
        ? prev.preferred_categories.filter(c => c !== category)
        : [...prev.preferred_categories, category],
    }));
  };

  // In PreferencesStep component
    useEffect(() => {
      onSave(formData);
    }, [formData, onSave]);

  const toggleNotification = (type: string) => {
    setFormData(prev => ({
      ...prev,
      notification_preferences: prev.notification_preferences.includes(type)
        ? prev.notification_preferences.filter(t => t !== type)
        : [...prev.notification_preferences, type],
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="h-full flex flex-col justify-center"
    >
      <h2 className="text-xl font-semibold text-black/90 dark:text-white/90 mb-6">
        Shopping Preferences
      </h2>

      <div className="grid grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-2">
              Shopping Frequency
            </label>
            <select
              name="shopping_frequency"
              value={formData.shopping_frequency}
              onChange={(e) => setFormData(prev => ({ ...prev, shopping_frequency: e.target.value }))}
              className={cn(
                'w-full px-3 py-2 rounded-lg',
                'bg-light-100 dark:bg-dark-100',
                'border border-light-200 dark:border-dark-200',
                'text-black dark:text-white',
                'focus:outline-none focus:ring-2 focus:ring-primary/50'
              )}
            >
              <option value="">Select frequency</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Every few months</option>
              <option value="occasionally">Occasionally</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-2">
              Preferred Price Range
            </label>
            <select
              name="price_range"
              value={formData.price_range}
              onChange={(e) => setFormData(prev => ({ ...prev, price_range: e.target.value }))}
              className={cn(
                'w-full px-3 py-2 rounded-lg',
                'bg-light-100 dark:bg-dark-100',
                'border border-light-200 dark:border-dark-200',
                'text-black dark:text-white',
                'focus:outline-none focus:ring-2 focus:ring-primary/50'
              )}
            >
              <option value="">Select price range</option>
              <option value="budget">Budget-friendly</option>
              <option value="mid">Mid-range</option>
              <option value="premium">Premium</option>
              <option value="luxury">Luxury</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-2">
              Notification Preferences
            </label>
            <div className="grid grid-cols-2 gap-2">
              {NOTIFICATION_TYPES.map(type => (
                <button
                  key={type}
                  onClick={() => toggleNotification(type)}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm',
                    'border transition-colors',
                    'flex items-center gap-2',
                    formData.notification_preferences.includes(type)
                      ? 'bg-primary/10 border-primary/30 text-primary'
                      : 'bg-light-100 dark:bg-dark-100 border-light-200 dark:border-dark-200 text-black/70 dark:text-white/70'
                  )}
                >
                  {formData.notification_preferences.includes(type) && (
                    <Check className="w-4 h-4" />
                  )}
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div>
          <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-2">
            Shopping Categories
          </label>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => toggleCategory(category)}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm',
                  'border transition-colors',
                  'flex items-center gap-2',
                  formData.preferred_categories.includes(category)
                    ? 'bg-primary/10 border-primary/30 text-primary'
                    : 'bg-light-100 dark:bg-dark-100 border-light-200 dark:border-dark-200 text-black/70 dark:text-white/70'
                )}
              >
                {formData.preferred_categories.includes(category) && (
                  <Check className="w-4 h-4" />
                )}
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
