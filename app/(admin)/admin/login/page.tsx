'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, Shield, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import { useTheme } from '@/app/contexts/ThemeContext';
import Cookies from 'js-cookie';

export default function AdminLoginPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Store just the token string, not the entire object
        Cookies.set('admin_token', data.token.access_token || data.token, { 
          expires: 7, // 7 days
          path: '/',
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'Lax'
        });
        toast.success('Login successful');
        router.push('/admin/dashboard');
      } else {
        toast.error(data.detail || 'Invalid credentials');
      }
    } catch (error) {
      toast.error('Failed to connect to the server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={cn(
      "min-h-screen flex flex-col items-center justify-center p-4",
      theme === 'dark' ? "bg-[#0a0a0a]" : "bg-gray-50"
    )}>
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className={cn(
            "w-12 h-12 rounded-xl mb-4 mx-auto flex items-center justify-center",
            theme === 'dark' 
              ? "bg-emerald-500/10" 
              : "bg-emerald-50"
          )}>
            <Shield className={cn(
              "w-6 h-6",
              theme === 'dark' ? "text-emerald-400" : "text-emerald-500"
            )} />
          </div>
          <h1 className={cn(
            "text-2xl font-bold mb-2 bg-gradient-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent"
          )}>
            Admin Portal
          </h1>
          <p className={cn(
            "text-sm",
            theme === 'dark' ? "text-gray-400" : "text-gray-600"
          )}>
            Sign in to access the admin dashboard
          </p>
        </div>

        {/* Login Form */}
        <div className={cn(
          "rounded-2xl p-8 shadow-xl",
          theme === 'dark' 
            ? "bg-[#1a1a1a] border border-white/10" 
            : "bg-white border border-gray-200"
        )}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className={cn(
                "block text-sm font-medium mb-2",
                theme === 'dark' ? "text-gray-300" : "text-gray-700"
              )}>
                Email Address
              </label>
              <div className="relative">
                <Mail className={cn(
                  "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5",
                  theme === 'dark' ? "text-gray-400" : "text-gray-500"
                )} />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className={cn(
                    'w-full pl-10 pr-3 py-2 rounded-lg transition-colors',
                    theme === 'dark'
                      ? [
                          "bg-[#0a0a0a]",
                          "border border-white/10",
                          "text-white",
                          "placeholder-gray-500"
                        ]
                      : [
                          "bg-white",
                          "border border-gray-300",
                          "text-gray-900",
                          "placeholder-gray-400"
                        ],
                    'focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent'
                  )}
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className={cn(
                "block text-sm font-medium mb-2",
                theme === 'dark' ? "text-gray-300" : "text-gray-700"
              )}>
                Password
              </label>
              <div className="relative">
                <Lock className={cn(
                  "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5",
                  theme === 'dark' ? "text-gray-400" : "text-gray-500"
                )} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className={cn(
                    'w-full pl-10 pr-10 py-2 rounded-lg transition-colors',
                    theme === 'dark'
                      ? [
                          "bg-[#0a0a0a]",
                          "border border-white/10",
                          "text-white",
                          "placeholder-gray-500"
                        ]
                      : [
                          "bg-white",
                          "border border-gray-300",
                          "text-gray-900",
                          "placeholder-gray-400"
                        ],
                    'focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent'
                  )}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className={cn(
                    "absolute right-3 top-1/2 -translate-y-1/2",
                    "p-1 rounded-md transition-colors",
                    theme === 'dark' 
                      ? "hover:bg-white/10 text-gray-400" 
                      : "hover:bg-gray-100 text-gray-500"
                  )}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                'w-full py-2 px-4 rounded-lg',
                'bg-gradient-to-r from-emerald-500 to-emerald-600',
                'hover:from-emerald-600 hover:to-emerald-700',
                'text-white font-medium',
                'transition-all duration-200',
                'flex items-center justify-center gap-2',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2',
                theme === 'dark' ? 'focus:ring-offset-[#1a1a1a]' : 'focus:ring-offset-white'
              )}
            >
              {isLoading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className={cn(
            "text-xs",
            theme === 'dark' ? "text-gray-500" : "text-gray-600"
          )}>
            This is a secure area. Only authorized personnel allowed.
          </p>
        </div>
      </div>
    </div>
  );
} 