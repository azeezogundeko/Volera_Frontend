'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!formData.email || !formData.password) {
        throw new Error('All fields are required');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('auth_token', data.token.access_token);
        localStorage.setItem('token_type', data.token.token_type);
        localStorage.setItem('user', JSON.stringify(data.user));

        toast.success('Successfully logged in!', {
          duration: 5000,
          position: 'top-center',
          style: {
            background: 'rgb(34 197 94)',
            color: '#fff',
            padding: '16px',
          },
        });

        router.push('/dashboard');
      } else {
        throw new Error(data.detail || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Failed to log in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      // Generate a random state parameter for security
      const state = crypto.randomUUID();
      localStorage.setItem('googleOAuthState', state);

      // Construct Google OAuth URL with the correct redirect URI
      const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
      const redirectUri = `${window.location.origin}/auth/google/callback`;

      const params = new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
        redirect_uri: redirectUri,
        response_type: 'code',
        state: state,
        scope: 'email profile',
        access_type: 'offline',
        prompt: 'consent',
      });

      // Log for debugging
      console.log('OAuth Configuration:', {
        clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        redirectUri,
        fullUrl: `${googleAuthUrl}?${params.toString()}`
      });

      // Redirect to Google OAuth
      window.location.href = `${googleAuthUrl}?${params.toString()}`;
    } catch (err) {
      console.error('Google sign-in error:', err);
      setError('Google sign-in failed. Please try again.');
      setLoading(false);
    }
  };

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
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Sign in to your account
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
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
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-12 py-2 rounded-lg border border-white/10 bg-[#0a0a0a] text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-200"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              <div className="mt-2 flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors duration-200"
                >
                  Forgot password?
                </Link>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
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
              onClick={handleGoogleLogin}
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
              Sign in with Google
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <Link
            href="/signup"
            className="text-emerald-400 hover:text-emerald-300 transition-colors duration-200"
          >
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
