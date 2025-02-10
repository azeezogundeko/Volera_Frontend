'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, KeyRound, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import process from 'process'

type Step = 'email' | 'verify' | 'reset';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef<HTMLInputElement[]>([]);

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
      await handleVerifyCode(newCode.join(''));
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

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot_password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(email)
      });

      if (!response.ok) throw new Error('Failed to send verification code');
      
      setStep('verify');
    } catch (err) {
      setError('Failed to send verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (submittedCode?: string, e?: React.FormEvent) => {
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify_code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });

      if (!response.ok) throw new Error('Invalid verification code');

      setStep('reset');
    } catch (err) {
      setError('Invalid verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset_password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          code: verificationCode.join(''), 
          password 
        })
      });

      if (!response.ok) throw new Error('Failed to reset password');

      router.push('/login');
    } catch (err) {
      setError('Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent">
            {step === 'email' && 'Forgot Password'}
            {step === 'verify' && 'Verify Code'}
            {step === 'reset' && 'Reset Password'}
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            {step === 'email' && 'Enter your email to receive a verification code'}
            {step === 'verify' && 'Enter the verification code sent to your email'}
            {step === 'reset' && 'Create a new password for your account'}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {step === 'email' && (
          <form onSubmit={handleEmailSubmit} className="mt-8 space-y-6">
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
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 bg-[#111111] border border-white/10 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Verification Code'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {step === 'verify' && (
          <form onSubmit={(e) => handleVerifyCode(undefined, e)} className="mt-8 space-y-6">
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
              {loading ? 'Verifying...' : 'Verify Code'}
              <CheckCircle className="w-4 h-4" />
            </button>
          </form>
        )}

        {step === 'reset' && (
          <form onSubmit={handlePasswordReset} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 bg-[#111111] border border-white/10 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white"
                    placeholder="Enter new password"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    id="confirmPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 bg-[#111111] border border-white/10 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="mt-4 text-center">
          <Link
            href="/login"
            className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors duration-200"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
} 