'use client';

import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

const GoogleCallbackPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        if (!code) {
          throw new Error('No authorization code received');
        }

        // Exchange the code for tokens
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google/callback?code=${code}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || 'Authentication failed');
        }

        // Store the authentication data
        localStorage.setItem('auth_token', data.token.access_token);
        localStorage.setItem('token_type', data.token.token_type);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Show success message
        toast.success('Successfully signed in with Google!', {
          duration: 5000,
          position: 'top-center',
          style: {
            background: 'rgb(34 197 94)',
            color: '#fff',
            padding: '16px',
          },
        });

        // Redirect to the appropriate page based on user state
        if (data.user.is_new) {
          router.push('/onboarding');
        } else {
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Google callback error:', error);
        toast.error('Failed to sign in with Google. Please try again.', {
          duration: 5000,
          position: 'top-center',
        });
        router.push('/login');
      }
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-[#111111] rounded-xl shadow-lg p-8 text-center">
        <div className="animate-pulse">
          <h2 className="text-2xl font-semibold text-emerald-400">
            Completing sign in...
          </h2>
          <p className="mt-2 text-gray-400">
            Please wait while we complete your authentication
          </p>
        </div>
      </div>
    </div>
  );
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GoogleCallbackPage />
    </Suspense>
  );
} 