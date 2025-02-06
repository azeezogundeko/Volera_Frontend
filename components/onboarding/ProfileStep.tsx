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
  onNext: () => void;
  setFormData: (data: any) => void;
  formData: {
    profile: Partial<ProfileData>;
    preferences: any;
  };
}

export default function ProfileStep({ onNext, setFormData, formData }: ProfileStepProps) {
  const [profileData, setProfileData] = useState<ProfileData>({
    gender: formData.profile.gender || '',
    phone: formData.profile.phone || '',
    address: formData.profile.address || '',
    city: formData.profile.city || '',
    country: formData.profile.country || ''
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileData(prev => ({ ...prev, avatar: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    setFormData((prev: { profile: Partial<ProfileData>; preferences: any }) => ({ ...prev, profile: profileData }));
  }, [profileData, setFormData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="h-full flex flex-col justify-center"
    >
      <h2 className="text-xl font-semibold text-white/90 mb-6 text-center">
        Complete Your Profile
      </h2>

      <div className="flex flex-col sm:grid sm:grid-cols-[200px_1fr] gap-6">
        {/* Avatar Upload */}
        <div className="flex flex-col items-center justify-start">
          <div className="relative group">
            <div className={cn(
              'w-24 sm:w-32 h-24 sm:h-32 rounded-full overflow-hidden',
              'bg-[#0a0a0a]',
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
          <p className="mt-2 text-sm text-white/50">
            Click to upload profile picture
          </p>
        </div>

        {/* Profile Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              name="gender"
              value={profileData.gender}
              onChange={handleInputChange}
              required
              className={cn(
                'w-full px-3 py-2 rounded-lg',
                'bg-[#0a0a0a]',
                'border',
                !profileData.gender ? 'border-red-500' : 'border-dark-200',
                'text-white',
                'focus:outline-none focus:ring-2 focus:ring-primary/50'
              )}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            {!profileData.gender && (
              <p className="mt-1 text-sm text-red-500">
                Please select your gender
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={profileData.phone}
              onChange={handleInputChange}
              placeholder="+1 (555) 000-0000"
              className={cn(
                'w-full px-3 py-2 rounded-lg',
                'bg-[#0a0a0a]',
                'border border-dark-200',
                'text-white',
                'placeholder-white/30',
                'focus:outline-none focus:ring-2 focus:ring-primary/50'
              )}
            />
          </div>

          <div className="col-span-1 sm:col-span-2">
            <label className="block text-sm font-medium text-white/70 mb-1">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={profileData.address}
              onChange={handleInputChange}
              placeholder="Street address"
              className={cn(
                'w-full px-3 py-2 rounded-lg',
                'bg-[#0a0a0a]',
                'border border-dark-200',
                'text-white',
                'placeholder-white/30',
                'focus:outline-none focus:ring-2 focus:ring-primary/50'
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">
              City
            </label>
            <input
              type="text"
              name="city"
              value={profileData.city}
              onChange={handleInputChange}
              placeholder="City"
              className={cn(
                'w-full px-3 py-2 rounded-lg',
                'bg-[#0a0a0a]',
                'border border-dark-200',
                'text-white',
                'placeholder-white/30',
                'focus:outline-none focus:ring-2 focus:ring-primary/50'
              )}
            />
          </div>
          <div>
              <label className="block text-sm font-medium text-white/70 mb-1">
                Country
              </label>
              <div className="mt-1 relative">
                <Globe2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type="text"
                  name="country"
                  id="country"
                  required
                  value={profileData.country}
                  onChange={handleInputChange}
                  className={cn(
                    'w-full pl-10 pr-3 py-2 rounded-lg',
                    'bg-[#0a0a0a]',
                    'border border-dark-200',
                    'text-white',
                    'placeholder-white/30',
                    'focus:outline-none focus:ring-2 focus:ring-primary/50'
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
