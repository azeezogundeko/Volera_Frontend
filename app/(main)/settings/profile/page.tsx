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
  Link as LinkIcon,
  Globe2,
  Upload,
  ArrowLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Notification, { NotificationContainer } from '@/components/Notification';
import { useRouter } from 'next/navigation';
import process from 'process'

interface ProfileData {
  avatar?: File | string | null;
  first_name: string;
  last_name: string;
  email: string;
  gender?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
}

async function fetchUserProfile(): Promise<ProfileData> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile data');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching profile:', error);
    
    // Return default/fallback data
    return {
      last_name: '',
      first_name: '',
      email: '',
      gender: '',
      phone: '',
      address: '',
      city: '',
      country: '',
      avatar: null,
    };
  }
}

export default function ProfileSettings() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const [formData, setFormData] = useState<ProfileData>({
    last_name: '',
    first_name: '',
    email: '',
    avatar: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [notifications, setNotifications] = useState<Array<{ id: string; message: string; type: 'success' | 'error' }>>([]);
  const [errors, setErrors] = useState<Partial<ProfileData>>({});
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const addNotification = (message: string, type: 'success' | 'error') => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { id, message, type }]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  useEffect(() => {
    if (typeof formData.avatar === 'string') {
      setPreviewImage(formData.avatar);
    }
  }, [formData.avatar]);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setIsLoading(true);
        const profileData = await fetchUserProfile();
        setFormData(profileData);
      } catch (error) {
        addNotification('Unable to load profile data. Please try again later.', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
        setIsDirty(true);
        setFormData(prevData => ({
          ...prevData,
          avatar: file
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setPreviewImage(null);
    setFormData(prev => ({ ...prev, avatar: null }));
    setIsDirty(true);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setIsDirty(true);
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setIsDirty(true);
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isDirty) return;

    const formDataToSend = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'avatar') return; // Skip avatar here
      
      if (value !== null && value !== undefined && value !== '') {
        formDataToSend.append(key, value as string);
      }
    });

    if (formData.avatar instanceof File) {
      formDataToSend.append('avatar', formData.avatar);
    }

    if (formData.avatar === null) {
      formDataToSend.append('avatar', '');
    }

    try {
      setIsSaving(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: formDataToSend
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      addNotification('Profile updated successfully', 'success');
      setIsDirty(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      addNotification('Unable to update profile. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] py-12">
      <NotificationContainer notifications={notifications} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={handleGoBack}
            className={cn(
              'text-gray-600 dark:text-gray-300',
              'hover:bg-gray-100 dark:hover:bg-[#1a1a1a]',
              'p-2 rounded-full',
              'transition-colors duration-200',
              'flex items-center justify-center'
            )}
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture */}
          <div className="bg-white dark:bg-[#141414] rounded-2xl border border-gray-200 dark:border-[#222] p-6">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className={cn(
                  'w-24 h-24 aspect-square rounded-full',
                  'bg-gray-200 dark:bg-[#0a0a0a]',
                  'flex items-center justify-center',
                  'border-2 border-dashed border-emerald-500/30',
                  'hover:border-emerald-500/50 transition-colors'
                )}>
                  {previewImage ? (
                    <div className="relative w-full h-full">
                      <img 
                        src={previewImage} 
                        alt="Profile" 
                        className="w-full h-full aspect-square object-cover rounded-full" 
                      />
                      {previewImage && (
                        <button
                          type="button"
                          onClick={handleRemoveAvatar}
                          className={cn(
                            'absolute -top-1 -right-1',
                            'bg-white dark:bg-[#141414]',
                            'text-gray-500 dark:text-gray-400',
                            'rounded-full w-5 h-5',
                            'flex items-center justify-center',
                            'shadow-sm',
                            'hover:bg-gray-50 dark:hover:bg-[#1a1a1a]',
                            'hover:text-gray-700 dark:hover:text-gray-200',
                            'border border-gray-200 dark:border-[#222]',
                            'transition-all duration-200'
                          )}
                          aria-label="Remove profile picture"
                        >
                          <svg 
                            width="10" 
                            height="10" 
                            viewBox="0 0 12 12" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg"
                            className="opacity-75"
                          >
                            <path 
                              d="M9 3L3 9M3 3L9 9" 
                              stroke="currentColor" 
                              strokeWidth="1.5" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  ) : (
                    <Camera className="w-8 h-8 text-emerald-500/50 dark:text-emerald-500/50" />
                  )}
                </div>
                <label className={cn(
                  'absolute inset-0 rounded-full cursor-pointer',
                  'flex items-center justify-center',
                  'bg-black/30 dark:bg-black/50 opacity-0 group-hover:opacity-100',
                  'transition-opacity'
                )}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Upload className="w-6 h-6 text-white" />
                </label>
              </div>
              <div>
                <h3 className="text-base font-medium text-gray-900 dark:text-white/90">Profile Picture</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-white/60">
                  Choose a profile picture. PNG or JPG up to 2MB.
                </p>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white dark:bg-[#141414] rounded-2xl border border-gray-200 dark:border-[#222] p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white/90 mb-6">Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className={cn(
                    'w-full px-3 py-2 rounded-lg',
                    'bg-white dark:bg-[#0a0a0a]',
                    'border border-gray-300 dark:border-[#222]',
                    'text-gray-900 dark:text-white',
                    'placeholder-gray-500 dark:placeholder-white/30',
                    'focus:outline-none focus:ring-2 focus:ring-emerald-500/50',
                    'transition-colors duration-200'
                  )}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className={cn(
                    'w-full px-3 py-2 rounded-lg',
                    'bg-white dark:bg-[#0a0a0a]',
                    'border border-gray-300 dark:border-[#222]',
                    'text-gray-900 dark:text-white',
                    'placeholder-gray-500 dark:placeholder-white/30',
                    'focus:outline-none focus:ring-2 focus:ring-emerald-500/50',
                    'transition-colors duration-200'
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={cn(
                    'w-full px-3 py-2 rounded-lg',
                    'bg-white dark:bg-[#0a0a0a]',
                    'border border-gray-300 dark:border-[#222]',
                    'text-gray-900 dark:text-white',
                    'placeholder-gray-500 dark:placeholder-white/30',
                    'focus:outline-none focus:ring-2 focus:ring-emerald-500/50',
                    'transition-colors duration-200'
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-1">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
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
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 000-0000"
                  className={cn(
                    'w-full px-3 py-2 rounded-lg',
                    'bg-white dark:bg-[#0a0a0a]',
                    'border border-gray-300 dark:border-[#222]',
                    'text-gray-900 dark:text-white',
                    'placeholder-gray-500 dark:placeholder-white/30',
                    'focus:outline-none focus:ring-2 focus:ring-emerald-500/50',
                    'transition-colors duration-200'
                  )}
                />
              </div>

              <div className="col-span-full">
                <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Street address"
                  className={cn(
                    'w-full px-3 py-2 rounded-lg',
                    'bg-white dark:bg-[#0a0a0a]',
                    'border border-gray-300 dark:border-[#222]',
                    'text-gray-900 dark:text-white',
                    'placeholder-gray-500 dark:placeholder-white/30',
                    'focus:outline-none focus:ring-2 focus:ring-emerald-500/50',
                    'transition-colors duration-200'
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={cn(
                    'w-full px-3 py-2 rounded-lg',
                    'bg-white dark:bg-[#0a0a0a]',
                    'border border-gray-300 dark:border-[#222]',
                    'text-gray-900 dark:text-white',
                    'placeholder-gray-500 dark:placeholder-white/30',
                    'focus:outline-none focus:ring-2 focus:ring-emerald-500/50',
                    'transition-colors duration-200'
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-1">
                  Country
                </label>
                <div className="relative">
                  <Globe2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className={cn(
                      'w-full pl-10 pr-3 py-2 rounded-lg',
                      'bg-white dark:bg-[#0a0a0a]',
                      'border border-gray-300 dark:border-[#222]',
                      'text-gray-900 dark:text-white',
                      'placeholder-gray-500 dark:placeholder-white/30',
                      'focus:outline-none focus:ring-2 focus:ring-emerald-500/50',
                      'transition-colors duration-200'
                    )}
                  />
                </div>
              </div>
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
      </div>
    </div>
  );
}
