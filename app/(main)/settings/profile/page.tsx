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
  X,
  Globe2,
  Upload
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfileData {
  avatar?: File;
  gender: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  name: string;
  email: string;
  bio: string;
  socialLinks: {
    github: string;
    twitter: string;
    linkedin: string;
    website: string;
  };
}

export default function ProfileSettings() {
  const [formData, setFormData] = useState<ProfileData>({
    name: 'John Doe',
    email: 'john@example.com',
    gender: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    bio: 'Software developer passionate about creating amazing user experiences.',
    socialLinks: {
      github: 'https://github.com/johndoe',
      twitter: 'https://twitter.com/johndoe',
      linkedin: 'https://linkedin.com/in/johndoe',
      website: 'https://johndoe.com',
    }
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
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white/90">Profile Settings</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-white/60">
            Update your profile information and manage your account settings
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture */}
          <div className="bg-white dark:bg-[#141414] rounded-2xl border border-gray-200 dark:border-[#222] p-6">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className={cn(
                  'w-24 sm:w-32 h-24 sm:h-32 rounded-full overflow-hidden',
                  'bg-[#0a0a0a]',
                  'flex items-center justify-center',
                  'border-2 border-dashed border-emerald-500/30',
                  'hover:border-emerald-500/50 transition-colors'
                )}>
                  {previewImage ? (
                    <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="w-8 h-8 text-emerald-500/50" />
                  )}
                </div>
                <label className={cn(
                  'absolute inset-0 rounded-full cursor-pointer',
                  'flex items-center justify-center',
                  'bg-black/50 opacity-0 group-hover:opacity-100',
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
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={cn(
                    'w-full px-3 py-2 rounded-lg',
                    'bg-[#0a0a0a]',
                    'border border-[#222]',
                    'text-white',
                    'placeholder-white/30',
                    'focus:outline-none focus:ring-2 focus:ring-emerald-500/50'
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
                    'bg-[#0a0a0a]',
                    'border border-[#222]',
                    'text-white',
                    'placeholder-white/30',
                    'focus:outline-none focus:ring-2 focus:ring-emerald-500/50'
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
                    'bg-[#0a0a0a]',
                    'border border-[#222]',
                    'text-white',
                    'focus:outline-none focus:ring-2 focus:ring-emerald-500/50'
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
                    'bg-[#0a0a0a]',
                    'border border-[#222]',
                    'text-white',
                    'placeholder-white/30',
                    'focus:outline-none focus:ring-2 focus:ring-emerald-500/50'
                  )}
                />
              </div>

              <div className="col-span-full">
                <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-1">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={3}
                  className={cn(
                    'w-full px-3 py-2 rounded-lg',
                    'bg-[#0a0a0a]',
                    'border border-[#222]',
                    'text-white',
                    'placeholder-white/30',
                    'focus:outline-none focus:ring-2 focus:ring-emerald-500/50'
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
                    'bg-[#0a0a0a]',
                    'border border-[#222]',
                    'text-white',
                    'placeholder-white/30',
                    'focus:outline-none focus:ring-2 focus:ring-emerald-500/50'
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
                    'bg-[#0a0a0a]',
                    'border border-[#222]',
                    'text-white',
                    'placeholder-white/30',
                    'focus:outline-none focus:ring-2 focus:ring-emerald-500/50'
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
                      'bg-[#0a0a0a]',
                      'border border-[#222]',
                      'text-white',
                      'placeholder-white/30',
                      'focus:outline-none focus:ring-2 focus:ring-emerald-500/50'
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white dark:bg-[#141414] rounded-2xl border border-gray-200 dark:border-[#222] p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white/90 mb-6">Social Links</h3>
            <div className="space-y-4">
              {Object.entries(formData.socialLinks).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-1 capitalize">
                    {key}
                  </label>
                  <input
                    type="url"
                    name={`socialLinks.${key}`}
                    value={value}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        socialLinks: {
                          ...prev.socialLinks,
                          [key]: e.target.value
                        }
                      }));
                      setIsDirty(true);
                    }}
                    className={cn(
                      'w-full px-3 py-2 rounded-lg',
                      'bg-[#0a0a0a]',
                      'border border-[#222]',
                      'text-white',
                      'placeholder-white/30',
                      'focus:outline-none focus:ring-2 focus:ring-emerald-500/50'
                    )}
                    placeholder={`Your ${key} profile URL`}
                  />
                </div>
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
      </div>
    </div>
  );
}
