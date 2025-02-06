'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

export default function VerifyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Get the user's email from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setEmail(user.email);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!verificationCode) {
        throw new Error('Please enter the verification code');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          code: verificationCode,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Email verified successfully!', {
          duration: 5000,
          position: 'top-center',
          style: {
            background: 'rgb(34 197 94)',
            color: '#fff',
            padding: '16px',
          },
        });

        // Update user status in localStorage if needed
        const userData = localStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          user.verified = true;
          localStorage.setItem('user', JSON.stringify(user));
        }

        // Redirect to dashboard or home page
        router.push('/dashboard');
      } else {
        throw new Error(data.detail || 'Verification failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        toast.success('Verification code resent!', {
          duration: 3000,
          position: 'top-center',
          style: {
            background: 'rgb(34 197 94)',
            color: '#fff',
            padding: '16px',
          },
        });
      } else {
        throw new Error('Failed to resend verification code');
      }
    } catch (err) {
      setError('Failed to resend verification code. Please try again.');
    } finally {
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
          <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-500/10 rounded-full mb-4">
            <Mail className="w-6 h-6 text-emerald-400" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent">
            Verify Your Email
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            We've sent a verification code to{' '}
            <span className="text-emerald-400">{email}</span>
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-2">
            <label htmlFor="code" className="block text-sm font-medium text-gray-300">
              Verification Code
            </label>
            <div className="mt-1 relative">
              <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                id="code"
                required
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 rounded-lg border border-white/10 bg-[#0a0a0a] text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-200"
                placeholder="Enter verification code"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Verifying...' : 'Verify Email'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-400">
            Didn't receive the code?{' '}
            <button
              onClick={handleResendCode}
              disabled={loading}
              className="text-emerald-400 hover:text-emerald-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Resend
            </button>
          </p>
        </div>

        <div className="border-t border-white/10 pt-6">
          <p className="text-center text-sm text-gray-400">
            Want to use a different email?{' '}
            <Link
              href="/signup"
              className="text-emerald-400 hover:text-emerald-300 transition-colors duration-200"
            >
              Sign up again
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
} 