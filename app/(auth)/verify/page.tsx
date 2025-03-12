'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

export default function VerifyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [email, setEmail] = useState('');
  const inputRefs = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    // Get the user's email from localStorage.
    // It can either be stored in the pending registration data or from a previously saved user.
    const pendingData = localStorage.getItem('pendingRegistration');
    if (pendingData) {
      const { email } = JSON.parse(pendingData);
      setEmail(email);
    } else {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setEmail(user.email);
      }
    }
  }, []);

  const isCodeComplete = (code: string[]) => {
    return code.every(digit => digit !== '');
  };

  const handleCodeChange = async (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    if (value.length > 1) return;

    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);
    setError('');

    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (value !== '' && isCodeComplete(newCode)) {
      await handleSubmit(newCode.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (verificationCode[index] === '' && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else {
        const newCode = [...verificationCode];
        newCode[index] = '';
        setVerificationCode(newCode);
      }
    }
  };

  const handleSubmit = async (submittedCode?: string, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (loading) return;
  
    // Use the submitted code if provided, otherwise join the state
    const code = submittedCode || verificationCode.join('');
  
    // Instead of checking the state, check the code directly
    if (!code || code.length !== 6) {
      setError('Please enter the complete verification code');
      return;
    }
  
    setLoading(true);
    setError('');
  
    try {
      // Retrieve pending registration data from localStorage
      const pendingData = localStorage.getItem('pendingRegistration');
      if (!pendingData) {
        throw new Error('No pending registration data found.');
      }
      const registrationData = JSON.parse(pendingData);
  
      // Call a new endpoint to verify the code and create the account
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify_and_register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...registrationData,
          code,
        }),
      });
      const data = await response.json();
  
      if (response.ok) {
        toast.success('Email verified and account created successfully!', {
          duration: 5000,
          position: 'top-center',
          style: {
            background: 'rgb(34 197 94)',
            color: '#fff',
            padding: '16px',
          },
        });
  
        // Save token and user data in localStorage
        localStorage.setItem('auth_token', data.token.access_token);
        localStorage.setItem('token_type', data.token.token_type);
        localStorage.setItem('user', JSON.stringify(data.user));
  
        // Remove pending registration data
        localStorage.removeItem('pendingRegistration');
  
        router.push('/onboarding');
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/resend-verification-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(email),
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
        className="w-full max-w-md space-y-8"
      >
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-500/10 rounded-full mb-4">
            <CheckCircle className="w-6 h-6 text-emerald-400" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent">
            Verify Your Account
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            We emailed you the six digit code to{' '}
            <span className="text-emerald-400">{email}</span>
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Enter the code below to confirm your email address.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={(e) => handleSubmit(undefined, e)} className="mt-8 space-y-6">
          <div className="flex justify-center gap-2">
            {verificationCode.map((digit, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                ref={(el) => {
                  if (el) inputRefs.current[index] = el;
                }}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-2xl font-semibold rounded-lg border border-white/10 bg-[#0a0a0a] text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-200"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Account'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-400">
            Didn&apos;t receive the code?{' '}
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

      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-10 animate-blob" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-5 animate-blob animation-delay-2000" />
      </div>
    </div>
  );
}
