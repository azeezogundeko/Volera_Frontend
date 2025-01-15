'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Camera, Globe2, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface ProfileData {
  avatar?: File;
  gender: string;
  phone: string;
  address: string;
  city: string;
  country: string;
}

interface ProfileStepProps {
  onSave: (data: ProfileData) => void;
  initialData?: Partial<ProfileData>;
}

export default function ProfileStep({ onSave, initialData = {} }: ProfileStepProps) {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProfileData>({
    gender: initialData.gender || '',
    phone: initialData.phone || '',
    address: initialData.address || '',
    city: initialData.city || '',
    country: initialData.country || '',
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, avatar: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // In ProfileStep component
  useEffect(() => {
    onSave(formData);
  }, [formData, onSave]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="h-full flex flex-col justify-center"
    >
      <h2 className="text-xl font-semibold text-black/90 dark:text-white/90 mb-6 text-center">
        Complete Your Profile
      </h2>

      <div className="flex flex-col sm:grid sm:grid-cols-[200px_1fr] gap-6">
        {/* Avatar Upload */}
        <div className="flex flex-col items-center justify-start">
          <div className="relative group">
            <div className={cn(
              'w-24 sm:w-32 h-24 sm:h-32 rounded-full overflow-hidden',
              'bg-light-100 dark:bg-dark-100',
              'flex items-center justify-center',
              'border-2 border-dashed border-primary/30',
              'hover:border-primary/50 transition-colors'
            )}>
              {avatarPreview ? (
                <Image src={avatarPreview} alt="Preview" width={32} height={32} />
              ) : (
                <Camera className="w-8 h-8 text-primary/50" />
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
                onChange={handleImageChange}
                className="hidden"
              />
              <Upload className="w-6 h-6 text-white" />
            </label>
          </div>
          <p className="mt-2 text-sm text-black/50 dark:text-white/50">
            Click to upload profile picture
          </p>
        </div>

        {/* Profile Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className={cn(
                'w-full px-3 py-2 rounded-lg',
                'bg-light-100 dark:bg-dark-100',
                'border border-light-200 dark:border-dark-200',
                'text-black dark:text-white',
                'focus:outline-none focus:ring-2 focus:ring-primary/50'
              )}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              {/* <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option> */}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">
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
                'bg-light-100 dark:bg-dark-100',
                'border border-light-200 dark:border-dark-200',
                'text-black dark:text-white',
                'focus:outline-none focus:ring-2 focus:ring-primary/50'
              )}
            />
          </div>

          <div className="col-span-1 sm:col-span-2">
            <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">
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
                'bg-light-100 dark:bg-dark-100',
                'border border-light-200 dark:border-dark-200',
                'text-black dark:text-white',
                'focus:outline-none focus:ring-2 focus:ring-primary/50'
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">
              City
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="City"
              className={cn(
                'w-full px-3 py-2 rounded-lg',
                'bg-light-100 dark:bg-dark-100',
                'border border-light-200 dark:border-dark-200',
                'text-black dark:text-white',
                'focus:outline-none focus:ring-2 focus:ring-primary/50'
              )}
            />
          </div>
          <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Country
              </label>
              <div className="mt-1 relative">
                <Globe2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="country"
                  id="country"
                  required
                  value={formData.country}
                  onChange={handleInputChange}
                  className={cn(
                    "block w-full pl-10 pr-3 py-2 rounded-lg",
                    "border border-gray-300 dark:border-gray-600",
                    "bg-white dark:bg-dark-secondary",
                    "text-gray-900 dark:text-white",
                    "placeholder-gray-400 dark:placeholder-gray-500",
                    "focus:ring-2 focus:ring-emerald-500 focus:border-transparent",
                    "transition duration-200"
                  )}
                  placeholder="Nigeria"
                />
              </div>
            </div>
        </div>
      </div>
    </motion.div>
  );
}
