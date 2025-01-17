'use client';

import { cn } from '@/lib/utils';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { Camera } from 'lucide-react';
import { Fragment, useState } from 'react';
import ThemeSwitcher from './theme/Switcher';
import process from 'process';

interface SettingsDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

interface User {
  first_name: string;
  last_name: string;
  email: string;
  // Add other properties as needed
}
let token: string | null;
let user: User = { first_name: '', last_name: '', email: '' }; // Initialize with default values

if (typeof window !== 'undefined') {
  token = localStorage.getItem('auth_token');
  user = JSON.parse(localStorage.getItem('user') || '{}') as User; // Cast to User type
}

export default function SettingsDialog({
  isOpen,
  setIsOpen,
}: SettingsDialogProps) {
  const [isChecked, setIsChecked] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);

  const handleCheckboxChange = async () => {
    console.log('Checkbox clicked'); // Log when the checkbox is clicked
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ notificationsEnabled: newCheckedState }),
    });

    if (!response.ok) {
      setIsChecked(isChecked);
    }
  };

  const handleProfilePictureChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Use optional chaining to safely access the first file
    if (!file) return;

    const formData = new FormData();
    formData.append('profilePicture', file);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile-picture`, {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${token}`,
        // 'Content-Type': 'multipart/form-data', // Do not set Content-Type here
      },
      body: formData,
    });

    if (response.ok) {
      // Optionally update the state or UI to reflect the new profile picture
      const updatedUser = await response.json();
      setProfilePicture(updatedUser.profilePicture);
    } else {
      console.error('Failed to upload profile picture');
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-light-50 dark:bg-dark-50 p-6 shadow-xl transition-all">
                <DialogTitle as="h3" className="text-lg font-medium leading-6 text-black/90 dark:text-white/90">
                  Settings
                </DialogTitle>

                <div className="mt-6 space-y-6">
                  {/* Profile Section */}
                  <div>
                    <h4 className="text-sm font-medium text-black/90 dark:text-white/90">Profile</h4>
                    <div className="mt-4 space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm text-black/60 dark:text-white/60">Profile Picture</label>
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center">
                            <span className="text-xl font-medium text-white">A</span>
                          </div>
                          <button className="px-3 py-2 text-sm rounded-lg border border-light-200 dark:border-dark-200 hover:bg-light-100 dark:hover:bg-dark-100 transition-colors">
                            <Camera className="w-4 h-4 mr-2 inline-block" />
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleProfilePictureChange}
                              className="hidden"
                            />
                            Change
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm text-black/60 dark:text-white/60">Display Name</label>
                        <input
                          type="text"
                          placeholder={`${user.first_name} ${user.last_name}`}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-light-200 dark:border-dark-200 bg-light-secondary dark:bg-dark-secondary text-black/90 dark:text-white/90"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm text-black/60 dark:text-white/60">Email</label>
                        <input
                          type="email"
                          value={user.email || ''}
                          disabled
                          className="w-full px-3 py-2 text-sm rounded-lg border border-light-200 dark:border-dark-200 bg-light-100 dark:bg-dark-100 text-black/50 dark:text-white/50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Preferences Section */}
                  <div>
                    <h4 className="text-sm font-medium text-black/90 dark:text-white/90">Preferences</h4>
                    <div className="mt-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm text-black/90 dark:text-white/90">Email Notifications</label>
                          <p className="text-xs text-black/50 dark:text-white/50">
                            Receive email about your account activity
                          </p>
                        </div>
                        <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-light-200 dark:bg-dark-200">
                          <input
                            type="checkbox"
                            className="peer sr-only"
                            id="notifications"
                            checked={isChecked}
                            onChange={handleCheckboxChange}
                          />
                          <span className="peer-checked:translate-x-6 peer-checked:bg-green-500 absolute left-[2px] top-[2px] h-5 w-5 transform rounded-full bg-white transition-transform" />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm text-black/90 dark:text-white/90">Theme</label>
                          <p className="text-xs text-black/50 dark:text-white/50">
                            Choose your preferred appearance
                          </p>
                        </div>
                        <ThemeSwitcher />
                      </div>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
