'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Mail, Lock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useChat } from '@/hooks/useChat';
import { NotificationContainer } from '@/components/Notification';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { createNewChat } = useChat();

  const [notifications, setNotifications] = useState<Array<{ id: string; message: string; type: 'success' | 'error' }>>([]);

  const addNotification = (message: string, type: 'success' | 'error') => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(notification => notification.id !== id));
    }, 3300); // Slightly longer than the notification display time
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setNotifications([]);

    try {
      // console.log('Starting login process...', { email: formData.email });

      if (!formData.email || !formData.password) {
        console.warn('Missing required fields');
        throw new Error('Email and password are required');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        console.warn('Invalid email format:', formData.email);
        throw new Error('Please enter a valid email address');
      }

      console.log('Sending login request to:', `${process.env.NEXT_PUBLIC_API_URL}/auth/login`);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // console.log('Login response status:', response.status);
      const data = await response.json();
      // console.log('Login response:', data);

      if (!response.ok) {
        console.error('Login failed:', data.detail);
        throw new Error(data.detail || 'Login failed');
      }

      if (data.token && data.user) {
        // Store the token and user data
        localStorage.setItem('auth_token', data.token.access_token);
        localStorage.setItem('token_type', data.token.token_type);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('userStatus', JSON.stringify(data.user.is_pro));

        // Trigger a storage event for other tabs
        window.dispatchEvent(new Event('storage'));

        // Set authorization header for future requests
        const authHeader = `${data.token.token_type} ${data.token.access_token}`;

        // Check for redirect URL from pro page
        const redirectUrl = localStorage.getItem('redirectAfterLogin');
        if (redirectUrl && redirectUrl.includes('/checkout')) {
          localStorage.removeItem('redirectAfterLogin'); // Clean up
          window.location.href = redirectUrl; // Redirect back to checkout
          return; // Skip chat creation for checkout flow
        }

        // Default flow - create chat and redirect
        const da = await createNewChat();
        if (da) {
          router.push(`/c/${da.id}`);
        } else {
          console.error('Failed to create chat, sendMessage not available.');
        }
        addNotification('Login successful!', 'success');
      } else {
        console.error('Invalid response format:', data);
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      if (err instanceof Error) {
        addNotification(err.message, 'error');
      } else {
        addNotification('An unknown error occurred', 'error');
      }
    } finally {
      setLoading(false);
      // console.log('Login process completed');
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      // Implement Google OAuth sign-in
      router.push('/api/auth/google');
    } catch (err) {
      addNotification('Google sign-in failed. Please try again.', 'error');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-primary dark:bg-dark-primary p-4">
      <NotificationContainer notifications={notifications} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8 bg-white dark:bg-dark-secondary rounded-xl shadow-lg p-8"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-emerald-500 hover:text-emerald-600">
              Sign up
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  value={formData.email}
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
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-emerald-500 hover:text-emerald-600"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  id="password"
                  required
                  value={formData.password}
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
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={cn(
                "w-full flex justify-center py-2.5 px-4 rounded-lg",
                "bg-gradient-to-r from-emerald-400 to-emerald-500",
                "hover:from-emerald-500 hover:to-emerald-600",
                "text-white font-medium",
                "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500",
                "transition duration-200",
                loading && "opacity-50 cursor-not-allowed"
              )}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-dark-secondary text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className={cn(
                "w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-lg",
                "bg-white dark:bg-dark-secondary",
                "border border-gray-300 dark:border-gray-600",
                "hover:bg-gray-50 dark:hover:bg-dark-100",
                "text-gray-700 dark:text-gray-300 font-medium",
                "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500",
                "transition duration-200",
                loading && "opacity-50 cursor-not-allowed"
              )}
            >
              <Image
                src="/google.svg"
                alt="Google"
                width={20}
                height={20}
                className="w-5 h-5"
              />
              Sign in with Google
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
