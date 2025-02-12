  'use client';

  import { useState, useEffect } from 'react';
  import { useRouter } from 'next/navigation';
  import { motion } from 'framer-motion';
  import { cn } from '@/lib/utils';
  import { Mail, Lock, User, Globe2, ArrowRight, Gift } from 'lucide-react';
  import Image from 'next/image';
  import Link from 'next/link';
  import toast, { Toaster } from 'react-hot-toast';

  export default function SignupPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      confirmPassword: '',
      referralCode: '',
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

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      try {
        console.log('Starting registration process...', { email: formData.email, firstName: formData.firstName });

        if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
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

          // Show success notification with react-hot-toast
          toast.success('Account created successfully! Please verify your email.', {
            duration: 5000,
            position: 'top-center',
            style: {
              background: 'rgb(34 197 94)',
              color: '#fff',
              padding: '16px',
            },
          });

          // Redirect to verification page
          router.push('/verify');
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
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-4">
        <Toaster />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-8 bg-[#111111] rounded-xl shadow-lg p-8"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent">
              Create Account
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Join us and start your journey
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-300">
                    First Name
                  </label>
                  <div className="mt-1 relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      name="firstName"
                      id="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-2 rounded-lg border border-white/10 bg-[#0a0a0a] text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-200"
                      placeholder="John"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-300">
                    Last Name
                  </label>
                  <div className="mt-1 relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      name="lastName"
                      id="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-2 rounded-lg border border-white/10 bg-[#0a0a0a] text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-200"
                      placeholder="Doe"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Email
                </label>
                <div className="mt-1 relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-2 rounded-lg border border-white/10 bg-[#0a0a0a] text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-200"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                <div className="mt-1 relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="password"
                    name="password"
                    id="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-2 rounded-lg border border-white/10 bg-[#0a0a0a] text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-200"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                  Confirm Password
                </label>
                <div className="mt-1 relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-2 rounded-lg border border-white/10 bg-[#0a0a0a] text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-200"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="referralCode" className="block text-sm font-medium text-gray-300">
                  Referral Code (Optional)
                </label>
                <div className="mt-1 relative">
                  <Gift className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    name="referralCode"
                    id="referralCode"
                    value={formData.referralCode}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-2 rounded-lg border border-white/10 bg-[#0a0a0a] text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-200"
                    placeholder="Enter referral code"
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#111111] text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={handleGoogleSignup}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-lg bg-[#0a0a0a] border border-white/10 text-gray-300 hover:bg-[#0f0f0f] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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

          <p className="text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-emerald-400 hover:text-emerald-300 transition-colors duration-200"
            >
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    );
  }
