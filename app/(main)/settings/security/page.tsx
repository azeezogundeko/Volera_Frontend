'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Key, 
  Smartphone, 
  Mail, 
  Clock, 
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApi } from '@/lib/hooks/useApi';

export default function SecurityPage() {
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading completion
    setIsLoading(false);
  }, []);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return;
    }
    setPasswordError('');
    setIsSaving(true);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/change_password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (!response.ok) throw new Error('Failed to update password');

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating password:', error);
      setPasswordError('Failed to update password. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white/90">Security Settings</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-white/60">
            Manage your account security and authentication preferences
          </p>
        </div>

        <div className="space-y-6">
          {/* Password Section */}
          <div className="bg-white dark:bg-[#141414] rounded-2xl border border-gray-200 dark:border-[#222] p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white/90 mb-6">Change Password</h3>
            
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className={cn(
                      'w-full px-3 py-2 rounded-lg',
                      'bg-white dark:bg-[#0a0a0a]',
                      'border border-gray-200 dark:border-[#222]',
                      'text-gray-900 dark:text-white',
                      'pr-10',
                      'focus:outline-none focus:ring-2 focus:ring-emerald-500/50'
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-1">
                  New Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={cn(
                    'w-full px-3 py-2 rounded-lg',
                    'bg-white dark:bg-[#0a0a0a]',
                    'border border-gray-200 dark:border-[#222]',
                    'text-gray-900 dark:text-white',
                    'focus:outline-none focus:ring-2 focus:ring-emerald-500/50'
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-1">
                  Confirm New Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={cn(
                    'w-full px-3 py-2 rounded-lg',
                    'bg-white dark:bg-[#0a0a0a]',
                    'border border-gray-200 dark:border-[#222]',
                    'text-gray-900 dark:text-white',
                    'focus:outline-none focus:ring-2 focus:ring-emerald-500/50'
                  )}
                />
              </div>

              {passwordError && (
                <p className="text-sm text-red-500">{passwordError}</p>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!currentPassword || !newPassword || !confirmPassword || isSaving}
                  className={cn(
                    'px-4 py-2 rounded-lg',
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
                      Updating...
                    </>
                  ) : (
                    'Update Password'
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Two-Factor Authentication */}
          {/* This section can be added later */}
        </div>

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
