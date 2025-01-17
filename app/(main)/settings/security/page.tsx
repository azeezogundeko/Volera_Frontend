'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, 
  Key, 
  Shield, 
  Smartphone, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  Eye,
  EyeOff,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SecurityFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  twoFactorEnabled: boolean;
  sessionTimeout: number;
  notifyOnNewLogin: boolean;
}

interface SecurityError {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export default function SecuritySettings() {
  const [formData, setFormData] = useState<SecurityFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
    sessionTimeout: 30,
    notifyOnNewLogin: true,
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<SecurityError>({});

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
    const newErrors: SecurityError = {};
    
    if (formData.currentPassword && formData.newPassword) {
      if (formData.currentPassword === formData.newPassword) {
        newErrors.newPassword = 'New password must be different from current password';
      }
    }

    if (formData.newPassword) {
      if (formData.newPassword.length < 8) {
        newErrors.newPassword = 'Password must be at least 8 characters long';
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword)) {
        newErrors.newPassword = 'Password must contain uppercase, lowercase, and numbers';
      }
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof SecurityFormData, value: string | boolean | number) => {
    setIsDirty(true);
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
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

      // Reset password fields
      if (formData.newPassword) {
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }));
      }
    } catch (error) {
      // Handle error
    } finally {
      setIsSaving(false);
    }
  };

  const sessionTimeoutOptions = [
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 60, label: '1 hour' },
    { value: 120, label: '2 hours' },
    { value: 240, label: '4 hours' },
    { value: 480, label: '8 hours' },
  ];

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
        {/* Password Change Section */}
        <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Change Password</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Ensure your account is using a strong, secure password
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Current Password
              </label>
              <div className="mt-1 relative">
                <input
                  type={showPasswords.current ? 'text' : 'password'}
                  id="currentPassword"
                  value={formData.currentPassword}
                  onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                  className={cn(
                    "block w-full px-4 py-2 pr-10 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors",
                    errors.currentPassword
                      ? "border-red-300 dark:border-red-500 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 dark:border-gray-600 focus:ring-emerald-500 focus:border-emerald-500"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.currentPassword}</p>
              )}
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                New Password
              </label>
              <div className="mt-1 relative">
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  id="newPassword"
                  value={formData.newPassword}
                  onChange={(e) => handleInputChange('newPassword', e.target.value)}
                  className={cn(
                    "block w-full px-4 py-2 pr-10 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors",
                    errors.newPassword
                      ? "border-red-300 dark:border-red-500 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 dark:border-gray-600 focus:ring-emerald-500 focus:border-emerald-500"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.newPassword}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirm New Password
              </label>
              <div className="mt-1 relative">
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={cn(
                    "block w-full px-4 py-2 pr-10 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors",
                    errors.confirmPassword
                      ? "border-red-300 dark:border-red-500 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 dark:border-gray-600 focus:ring-emerald-500 focus:border-emerald-500"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
              )}
            </div>
          </div>
        </section>

        {/* Two-Factor Authentication Section */}
        <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Add an extra layer of security to your account
              </p>
            </div>
            <div className="relative inline-block w-14 h-8 mr-2">
              <input
                type="checkbox"
                id="twoFactor"
                checked={formData.twoFactorEnabled}
                onChange={(e) => handleInputChange('twoFactorEnabled', e.target.checked)}
                className="peer sr-only"
              />
              <label
                htmlFor="twoFactor"
                className="absolute cursor-pointer inset-0 rounded-full bg-gray-200 peer-checked:bg-emerald-500 transition-colors duration-300"
              >
                <span className="absolute left-1 top-1 w-6 h-6 rounded-full bg-white transition-transform duration-300 peer-checked:translate-x-6" />
              </label>
            </div>
          </div>

          {formData.twoFactorEnabled && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900">
                  <Smartphone className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">Authenticator App</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Use an authenticator app to get 2FA codes
                  </p>
                </div>
                <motion.button
                  type="button"
                  className="ml-auto px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Set up
                </motion.button>
              </div>
            </div>
          )}
        </section>

        {/* Session Settings Section */}
        <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Session Settings</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage your session timeout and login notifications
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="sessionTimeout" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Session Timeout
              </label>
              <select
                id="sessionTimeout"
                value={formData.sessionTimeout}
                onChange={(e) => handleInputChange('sessionTimeout', parseInt(e.target.value))}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-emerald-500 focus:border-emerald-500"
              >
                {sessionTimeoutOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="notifyOnNewLogin" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Login Notifications
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Get notified when someone logs into your account
                </p>
              </div>
              <div className="relative inline-block w-14 h-8">
                <input
                  type="checkbox"
                  id="notifyOnNewLogin"
                  checked={formData.notifyOnNewLogin}
                  onChange={(e) => handleInputChange('notifyOnNewLogin', e.target.checked)}
                  className="peer sr-only"
                />
                <label
                  htmlFor="notifyOnNewLogin"
                  className="absolute cursor-pointer inset-0 rounded-full bg-gray-200 peer-checked:bg-emerald-500 transition-colors duration-300"
                >
                  <span className="absolute left-1 top-1 w-6 h-6 rounded-full bg-white transition-transform duration-300 peer-checked:translate-x-6" />
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* Active Sessions Section */}
        <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Active Sessions</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage your active sessions across different devices
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900">
                  <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">Current Session</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Windows • Chrome • New York, USA
                  </p>
                </div>
              </div>
              <span className="px-2 py-1 text-xs font-medium text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900 rounded-full">
                Active Now
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-600">
                  <Smartphone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">Mobile App</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    iOS • Last active 2 hours ago
                  </p>
                </div>
              </div>
              <motion.button
                type="button"
                className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <LogOut className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </section>

        {/* Save Button */}
        <div className="flex justify-end gap-4">
          <motion.button
            type="button"
            onClick={() => {
              setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
                twoFactorEnabled: false,
                sessionTimeout: 30,
                notifyOnNewLogin: true,
              });
              setIsDirty(false);
            }}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSaving}
          >
            Reset
          </motion.button>
          
          <motion.button
            type="submit"
            className={cn(
              "px-4 py-2 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500",
              isSaving
                ? "bg-emerald-500 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700"
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSaving}
          >
            <span className="flex items-center gap-2">
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : showSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Saved!
                </>
              ) : (
                'Save Changes'
              )}
            </span>
          </motion.button>
        </div>
      </form>
    </div>
  );
}
