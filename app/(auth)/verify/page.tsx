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
    // Get the user's email from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setEmail(user.email);
    }
  }, []);

  const isCodeComplete = (code: string[]) => {
    return code.every(digit => digit !== '');
  };

  const handleCodeChange = async (index: number, value: string) => {
    // Only allow numeric input
    if (!/^\d*$/.test(value)) return;
    
    // Only allow single digit
    if (value.length > 1) return;

    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);
    setError(''); // Clear any previous errors

    // Move to next input if value is entered
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // If this is the last digit and code is complete, submit automatically
    if (value !== '' && isCodeComplete(newCode)) {
      await handleSubmit(newCode.join('')); // Pass the newCode directly
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (verificationCode[index] === '' && index > 0) {
        // Move to previous input if current is empty
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current input
        const newCode = [...verificationCode];
        newCode[index] = '';
        setVerificationCode(newCode);
      }
    }
  };

  const handleSubmit = async (submittedCode?: string, e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (loading) return;

    const code = submittedCode || verificationCode.join('');
    const codeArray = submittedCode ? submittedCode.split('') : verificationCode;
    
    if (!isCodeComplete(codeArray)) {
      setError('Please enter the complete verification code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          code,
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

        const userData = localStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          user.verified = true;
          localStorage.setItem('user', JSON.stringify(user));
        }

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