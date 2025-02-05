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

interface SecurityData {
  twoFactorEnabled: boolean;
  twoFactorMethod: 'authenticator' | 'sms' | 'email';
  sessionTimeout: number;
  lastPasswordChange: string;
  securityQuestions: {
    question: string;
    answer: string;
  }[];
  loginNotifications: boolean;
  suspiciousActivityAlerts: boolean;
}

const SECURITY_QUESTIONS = [
  "What was your first pet's name?",
  "In what city were you born?",
  "What is your mother's maiden name?",
  "What high school did you attend?",
  "What was your childhood nickname?",
  "What is the name of your favorite childhood friend?",
  "What street did you live on in third grade?",
  "What is your oldest sibling's middle name?",
  "What was the name of your first stuffed animal?",
  "In what city did you meet your spouse/significant other?"
];

export default function SecuritySettings() {
  const { fetchWithAuth } = useApi();
  const [formData, setFormData] = useState<SecurityData>({
    twoFactorEnabled: false,
    twoFactorMethod: 'authenticator',
    sessionTimeout: 30,
    lastPasswordChange: '2024-12-25',
    securityQuestions: [
      { question: SECURITY_QUESTIONS[0], answer: '' },
      { question: SECURITY_QUESTIONS[1], answer: '' }
    ],
    loginNotifications: true,
    suspiciousActivityAlerts: true
  });

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
    const fetchSecuritySettings = async () => {
      try {
        const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/settings/security`);
        const data = await response.json();
        setFormData(data);
      } catch (error) {
        console.error('Failed to fetch security settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSecuritySettings();
  }, []);

  const handleInputChange = async (field: keyof SecurityData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setIsDirty(true);

    // If the field is related to immediate settings (like 2FA or notifications), update immediately
    if (['twoFactorEnabled', 'loginNotifications', 'suspiciousActivityAlerts'].includes(field)) {
      try {
        const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/settings/security/${field}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ value }),
        });

        if (!response.ok) throw new Error(`Failed to update ${field}`);

        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } catch (error) {
        console.error(`Error updating ${field}:`, error);
        // Revert the change if the update failed
        setFormData(prev => ({
          ...prev,
          [field]: !value
        }));
      }
    }
  };

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
      const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/settings/security/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/settings/security`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to update security settings');

      setShowSuccess(true);
      setIsDirty(false);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating security settings:', error);
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
                      'bg-[#0a0a0a]',
                      'border border-[#222]',
                      'text-white',
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
                    'bg-[#0a0a0a]',
                    'border border-[#222]',
                    'text-white',
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
                    'bg-[#0a0a0a]',
                    'border border-[#222]',
                    'text-white',
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
          <div className="bg-white dark:bg-[#141414] rounded-2xl border border-gray-200 dark:border-[#222] p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white/90 mb-6">Two-Factor Authentication</h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white/90">Enable 2FA</h4>
                  <p className="text-sm text-gray-500 dark:text-white/60">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleInputChange('twoFactorEnabled', !formData.twoFactorEnabled)}
                  className={cn(
                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out',
                    'focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2',
                    formData.twoFactorEnabled ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-[#222]'
                  )}
                >
                  <span
                    className={cn(
                      'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                      formData.twoFactorEnabled ? 'translate-x-5' : 'translate-x-0'
                    )}
                  />
                </button>
              </div>

              {formData.twoFactorEnabled && (
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-white/70">
                    Authentication Method
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { value: 'authenticator', label: 'Authenticator App', icon: Key },
                      { value: 'sms', label: 'SMS', icon: Smartphone },
                      { value: 'email', label: 'Email', icon: Mail }
                    ].map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => handleInputChange('twoFactorMethod', value)}
                        className={cn(
                          'px-3 py-2 rounded-lg text-sm',
                          'border transition-colors',
                          'flex items-center gap-2',
                          formData.twoFactorMethod === value
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                            : 'bg-[#0a0a0a] border-[#222] text-white/70 hover:border-emerald-500/30'
                        )}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span>{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Security Questions */}
          <div className="bg-white dark:bg-[#141414] rounded-2xl border border-gray-200 dark:border-[#222] p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white/90 mb-6">Security Questions</h3>
            
            <div className="space-y-4">
              {formData.securityQuestions.map((q, index) => (
                <div key={index} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-white/70">
                    Question {index + 1}
                  </label>
                  <select
                    value={q.question}
                    onChange={(e) => {
                      const newQuestions = [...formData.securityQuestions];
                      newQuestions[index].question = e.target.value;
                      handleInputChange('securityQuestions', newQuestions);
                    }}
                    className={cn(
                      'w-full px-3 py-2 rounded-lg',
                      'bg-[#0a0a0a]',
                      'border border-[#222]',
                      'text-white',
                      'focus:outline-none focus:ring-2 focus:ring-emerald-500/50'
                    )}
                  >
                    {SECURITY_QUESTIONS.map((question) => (
                      <option key={question} value={question}>
                        {question}
                      </option>
                    ))}
                  </select>
                  <input
                    type="password"
                    placeholder="Your answer"
                    value={q.answer}
                    onChange={(e) => {
                      const newQuestions = [...formData.securityQuestions];
                      newQuestions[index].answer = e.target.value;
                      handleInputChange('securityQuestions', newQuestions);
                    }}
                    className={cn(
                      'w-full px-3 py-2 rounded-lg',
                      'bg-[#0a0a0a]',
                      'border border-[#222]',
                      'text-white',
                      'focus:outline-none focus:ring-2 focus:ring-emerald-500/50'
                    )}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Session Settings */}
          <div className="bg-white dark:bg-[#141414] rounded-2xl border border-gray-200 dark:border-[#222] p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white/90 mb-6">Session Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-2">
                  Session Timeout (minutes)
                </label>
                <select
                  value={formData.sessionTimeout}
                  onChange={(e) => handleInputChange('sessionTimeout', parseInt(e.target.value))}
                  className={cn(
                    'w-full px-3 py-2 rounded-lg',
                    'bg-[#0a0a0a]',
                    'border border-[#222]',
                    'text-white',
                    'focus:outline-none focus:ring-2 focus:ring-emerald-500/50'
                  )}
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={120}>2 hours</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white/90">Login Notifications</h4>
                  <p className="text-sm text-gray-500 dark:text-white/60">
                    Get notified of new sign-ins to your account
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleInputChange('loginNotifications', !formData.loginNotifications)}
                  className={cn(
                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out',
                    'focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2',
                    formData.loginNotifications ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-[#222]'
                  )}
                >
                  <span
                    className={cn(
                      'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                      formData.loginNotifications ? 'translate-x-5' : 'translate-x-0'
                    )}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white/90">Suspicious Activity Alerts</h4>
                  <p className="text-sm text-gray-500 dark:text-white/60">
                    Get alerts about unusual activity on your account
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleInputChange('suspiciousActivityAlerts', !formData.suspiciousActivityAlerts)}
                  className={cn(
                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out',
                    'focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2',
                    formData.suspiciousActivityAlerts ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-[#222]'
                  )}
                >
                  <span
                    className={cn(
                      'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                      formData.suspiciousActivityAlerts ? 'translate-x-5' : 'translate-x-0'
                    )}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSubmit}
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
