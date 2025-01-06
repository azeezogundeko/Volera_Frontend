'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Mail, Lock, User, Globe2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    country: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Starting registration process...', { email: formData.email, firstName: formData.firstName });

      if (!formData.email || !formData.password || !formData.firstName || !formData.lastName || !formData.country) {
        console.warn('Missing required fields');
        throw new Error('All fields are required');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        console.warn('Invalid email format:', formData.email);
        throw new Error('Please enter a valid email address');
      }

      if (formData.password.length < 8) {
        console.warn('Password too short');
        throw new Error('Password must be at least 8 characters long');
      }

      console.log('Sending registration request to:', `${process.env.NEXT_PUBLIC_API_URL}/auth/register`);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Registration response status:', response.status);
      const data = await response.json();
      console.log('Registration response:', data);

      if (response.ok) {
        console.log('Registration successful, storing auth data...');
        
        // Store the token and user data
        localStorage.setItem('auth_token', data.token.access_token);
        localStorage.setItem('token_type', data.token.token_type);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Redirect to onboarding
        router.push('/onboarding');
      } else {
        console.error('Registration failed:', data);
        // Handle specific error cases
        if (data.detail) {
          if (data.detail === 'Email already exists') {
            throw new Error('This email is already registered. Please try logging in or use a different email.');
          }
          throw new Error(data.detail);
        }
        throw new Error('Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
      console.log('Registration process completed');
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    try {
      // Implement Google OAuth sign-in
      // This will be implemented when we set up the authentication backend
      router.push('/api/auth/google');
    } catch (err) {
      setError('Google sign-in failed. Please try again.');
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Signup page mounted');
    
    // Log API URL configuration
    console.log('API URL configured as:', process.env.NEXT_PUBLIC_API_URL);
    
    return () => {
      console.log('Signup page unmounted');
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-primary dark:bg-dark-primary p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8 bg-white dark:bg-dark-secondary rounded-xl shadow-lg p-8"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="text-emerald-500 hover:text-emerald-600">
              Log in
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  First Name
                </label>
                <div className="mt-1 relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    required
                    value={formData.firstName}
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
                    placeholder="John"
                  />
                </div>
              </div>
              <div className="flex-1">
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Last Name
                </label>
                <div className="mt-1 relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    required
                    value={formData.lastName}
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
                    placeholder="Doe"
                  />
                </div>
              </div>
            </div>

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
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
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
                  placeholder="United States"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

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
              {loading ? 'Creating account...' : 'Create account'}
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
              onClick={handleGoogleSignup}
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
              Sign up with Google
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
