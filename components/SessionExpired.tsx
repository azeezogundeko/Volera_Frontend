'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Clock, LogIn } from 'lucide-react';

export default function SessionExpired() {
  const router = useRouter();

  useEffect(() => {
    // Clear any auth-related data from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      // Save current URL for redirect after login
      localStorage.setItem('redirectAfterLogin', window.location.href);
    }
  }, []);

  const handleLogin = () => {
    // Force a hard navigation to the login page
    window.location.href = '/login';
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6 p-8 rounded-2xl bg-gradient-to-b from-white/[0.03] to-white/[0.07] border border-white/10">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
            <Clock className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Session Expired</h2>
          <p className="text-white/70">
            Your session has expired. Please log in again to continue using the application.
          </p>
        </div>
        <button
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors duration-200"
        >
          <LogIn className="w-5 h-5" />
          Log In Again
        </button>
      </div>
    </div>
  );
} 