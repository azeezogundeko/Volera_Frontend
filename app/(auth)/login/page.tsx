'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useChat } from '@/hooks/useChat';
import { NotificationContainer } from '@/components/Notification';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
        addNotification('Login successful!', 'success');
        try {
          const newChatId = crypto.randomUUID();
          router.push(`/c/${newChatId}`);
        } catch (error) {
          console.error('Error creating new chat:', error);
          addNotification('Failed to create new chat', 'error');
        }
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
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-4">
      <NotificationContainer notifications={notifications} />
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Sign in to your account to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-2 bg-[#111111] border border-white/10 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-12 py-2 bg-[#111111] border border-white/10 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <Link
              href="/forgot-password"
              className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors duration-200"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign in'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-sm text-gray-400">
          Don&apos;t have an account?{' '}
          <Link
            href="/signup"
            className="text-emerald-400 hover:text-emerald-300 transition-colors duration-200"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
