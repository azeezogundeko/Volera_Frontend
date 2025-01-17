'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  Loader2, 
  CheckCircle2, 
  Github, 
  Twitter, 
  Linkedin,
  Link as LinkIcon,
  AlertCircle,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  avatarUrl: string;
  socialLinks: {
    github: string;
    twitter: string;
    linkedin: string;
    website: string;
  };
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    timezone: string;
    currency: string;
    notifications: {
      email: boolean;
      push: boolean;
      inApp: boolean;
    };
    privacy: {
      profileVisibility: 'public' | 'private' | 'contacts';
      showEmail: boolean;
      showPhone: boolean;
      showLocation: boolean;
    };
  };
}

export default function ProfileSettings() {
  const [formData, setFormData] = useState<ProfileData>({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    location: 'New York, USA',
    bio: 'Software developer passionate about creating amazing user experiences.',
    avatarUrl: '',
    socialLinks: {
      github: 'https://github.com/johndoe',
      twitter: 'https://twitter.com/johndoe',
      linkedin: 'https://linkedin.com/in/johndoe',
      website: 'https://johndoe.com',
    },
    preferences: {
      theme: 'system',
      language: 'en',
      timezone: 'UTC',
      currency: 'USD',
      notifications: {
        email: true,
        push: true,
        inApp: true,
      },
      privacy: {
        profileVisibility: 'public',
        showEmail: true,
        showPhone: false,
        showLocation: true,
      },
    },
  });

  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<ProfileData>>({});
  const [previewImage, setPreviewImage] = useState<string | null>(null);

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

  const validateForm = (): boolean => {
    const newErrors: Partial<ProfileData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (formData.phone && !/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
        setIsDirty(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (
    field: keyof ProfileData | { type: 'socialLinks' | 'preferences'; field: keyof ProfileData['socialLinks'] | keyof ProfileData['preferences'] },
    value: string | boolean
  ) => {
    setIsDirty(true);
    if (typeof field === 'object') {
      if (field.type === 'socialLinks') {
        setFormData(prev => ({
          ...prev,
          socialLinks: {
            ...prev.socialLinks,
            [field.field]: value as string,
          },
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          preferences: {
            ...prev.preferences,
            [field.field]: value as string | boolean,
          },
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value as string,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

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
        {/* Profile Picture Section */}
        <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400" />
                )}
              </div>
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 p-2 bg-emerald-600 rounded-full text-white cursor-pointer transform transition-transform group-hover:scale-110"
              >
                <Camera className="w-5 h-5" />
              </label>
              <input
                type="file"
                id="avatar-upload"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Profile Picture</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Upload a high-quality image for your profile. PNG or JPG up to 2MB.
              </p>
            </div>
          </div>
        </section>

        {/* Personal Information Section */}
        <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Full Name
                </label>
                <div className="mt-1 relative">
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                  )}
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Email Address
                </label>
                <div className="mt-1 relative">
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Preferences Section */}
        <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Preferences</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="theme" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Theme
                </label>
                <select
                  id="theme"
                  value={formData.preferences.theme}
                  onChange={(e) => handleInputChange({ type: 'preferences', field: 'theme' }, e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Language
                </label>
                <select
                  id="language"
                  value={formData.preferences.language}
                  onChange={(e) => handleInputChange({ type: 'preferences', field: 'language' }, e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3">Privacy Settings</h4>
            <div className="space-y-4">
              <div>
                <label htmlFor="profileVisibility" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Profile Visibility
                </label>
                <select
                  id="profileVisibility"
                  value={formData.preferences.privacy.profileVisibility}
                  onChange={(e) => handleInputChange({ type: 'preferences', field: 'privacy.profileVisibility' }, e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="contacts">Contacts Only</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-200">Show Email Address</span>
                <button
                  type="button"
                  onClick={() => handleInputChange({ type: 'preferences', field: 'privacy.showEmail' }, !formData.preferences.privacy.showEmail)}
                  className={`${
                    formData.preferences.privacy.showEmail ? 'bg-emerald-600' : 'bg-gray-200 dark:bg-gray-700'
                  } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500`}
                >
                  <span className={`${
                    formData.preferences.privacy.showEmail ? 'translate-x-5' : 'translate-x-0'
                  } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                  />
                </button>
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
