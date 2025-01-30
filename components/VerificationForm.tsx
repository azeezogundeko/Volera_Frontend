'use client';

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const VerificationForm: React.FC = (): JSX.Element => {
  const router = useRouter();
  const [pin, setPin] = useState<string[]>(Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multiple characters

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    // Handle left arrow
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    // Handle right arrow
    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const newPin = [...pin];
    
    [...pastedData].forEach((char, index) => {
      if (index < 6) {
        newPin[index] = char;
      }
    });
    
    setPin(newPin);
    // Focus the next empty input or the last input
    const nextEmptyIndex = newPin.findIndex(digit => !digit);
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = pin.join('');
    if (code.length !== 6) return;

    setLoading(true);
    try {
      // const payload = {
      //   token: code,
      // };
      const params = new URLSearchParams();
      params.set('verification_code', code);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify_account?${params.toString()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
        // body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Verification failed: ${response.status} - ${errorText}`);
      }
      
      // If verification is successful
      toast.success('Email verified successfully!');
      router.push('/onboarding');
    } catch (error) {
      toast.error('Invalid verification code. Please try again.');
      console.error('Error verifying code:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleResend = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/resend-verification-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        }
      });
    
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to resend code: ${response.status} - ${errorText}`);
      }

      toast.success('Verification code resent to your email');
    } catch (error) {
      toast.error('Failed to resend code. Please try again.');
      console.error('Error resending code:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <div className="space-y-4">
        <div className="flex justify-center gap-2">
          {pin.map((digit, i) => (
            <input
              key={i}
              ref={(el: HTMLInputElement | null) => {
                if (el) {
                  inputRefs.current[i] = el;
                }
              }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              onPaste={handlePaste}
              disabled={loading}
              className="h-12 w-12 rounded-lg border border-gray-300 dark:border-gray-600 text-center text-xl font-semibold 
                focus:border-green-500 focus:ring-1 focus:ring-green-500 dark:bg-gray-800 dark:text-white
                disabled:opacity-50 disabled:cursor-not-allowed"
              required
            />
          ))}
        </div>
        
        <div className="text-center text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            Didn&apos;t receive the code?{' '}
          </span>
          <button
            type="button"
            onClick={handleResend}
            disabled={loading}
            className="text-green-600 hover:text-green-500 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Resend
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || pin.some(digit => !digit)}
        className="w-full rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white 
          shadow-sm hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
      >
        {loading ? 'Verifying...' : 'Verify Account'}
      </button>
    </form>
  );
};
