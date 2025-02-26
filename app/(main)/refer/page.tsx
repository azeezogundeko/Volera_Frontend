'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Share2, Copy, CheckCircle2, Users, Gift, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useApi } from '@/lib/hooks/useApi';
import LoadingPage from '@/components/LoadingPage';

type ReferralStatus = "active" | "inactive";
interface ReferralUser {
  id: string;
  email: string;
  name: string;
}
interface ReferralData {
  id: string;
  referral_code: string;
  referral_count: number;
  referral_limit: number;
  referral_status: ReferralStatus;
  referral_users: Record<string, any>;
}

interface CachedReferralData extends ReferralData {
  timestamp: number;
}

const CACHE_KEY = 'referral_data_cache';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

export default function ReferPage() {
  const { fetchWithAuth } = useApi();
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getCachedData = useCallback((): CachedReferralData | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;
      return JSON.parse(cached);
    } catch (err) {
      console.error('Error reading cache:', err);
      return null;
    }
  }, []);

  const setCachedData = useCallback((data: ReferralData) => {
    try {
      const cacheData: CachedReferralData = {
        ...data,
        timestamp: Date.now()
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch (err) {
      console.error('Error setting cache:', err);
    }
  }, []);

  const isCacheValid = useCallback((cachedData: CachedReferralData): boolean => {
    const now = Date.now();
    return now - cachedData.timestamp < CACHE_DURATION;
  }, []);

  const fetchReferralData = useCallback(async (forceFetch: boolean = false) => {
    try {
      // Check cache first if not forcing fetch
      if (!forceFetch) {
        const cachedData = getCachedData();
        if (cachedData && isCacheValid(cachedData)) {
          setReferralData(cachedData);
          setLoading(false);
          return;
        }
      }

      setLoading(true);
      const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/auth/referral`);
      if (!response.ok) {
        throw new Error('Failed to fetch referral data');
      }
      const data = await response.json();
      setReferralData(data);
      setCachedData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching referral data:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchWithAuth, getCachedData, isCacheValid, setCachedData]);

  useEffect(() => {
    fetchReferralData(false);
  }, [fetchReferralData]);

  const handleCopy = useCallback(async () => {
    if (!referralData?.referral_code) return;
    await navigator.clipboard.writeText(referralData.referral_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [referralData?.referral_code]);

  const benefits = useMemo(() => [
    {
      icon: Gift,
      title: 'Earn Credits',
      description: 'Get 500 credits for each friend who signs up using your code',
      gradient: 'from-emerald-500/20 to-emerald-500/0'
    },
    {
      icon: Users,
      title: 'Friend Benefits',
      description: 'Your friends get 250 bonus credits when they join',
      gradient: 'from-emerald-400/20 to-emerald-400/0'
    },
    {
      icon: Sparkles,
      title: 'Invite Friends',
      description: 'You can invite up to 100 friends to join Volera',
      gradient: 'from-emerald-600/20 to-emerald-600/0'
    }
  ], []);

  if (loading) {
    return <LoadingPage />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors duration-300 flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!referralData) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors duration-300 flex items-center justify-center">
        <p className="text-red-500">No referral data available</p>
      </div>
    );
  }

  const { referral_count, referral_code, referral_status, referral_limit } = referralData;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors duration-300">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white/90">Refer Friends</h1>
          <p className="mt-2 text-base text-gray-600 dark:text-white/60">
            Share Volera with your friends and earn rewards
          </p>
          {referral_count > 0 && (
            <p className="mt-2 text-sm text-emerald-500">
              You&apos;ve successfully referred {referral_count} {referral_count === 1 ? 'friend' : 'friends'}!
            </p>
          )}
        </div>

        {/* Referral Code Card */}
        <div className="mb-12 bg-white dark:bg-[#141414] rounded-2xl border border-gray-200 dark:border-[#222] shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg">
              <Share2 className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white/90">Your Referral Code</h2>
              <p className="text-sm text-gray-500 dark:text-white/60">Share this code with your friends</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => fetchReferralData(true)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1a1a1a] transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-500 dark:text-white/60"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </motion.button>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-gray-50 dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-[#222] p-4">
              <code className="text-lg font-mono text-emerald-500">
                {referral_status === "active" ? referral_code : "INACTIVE"}
              </code>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCopy}
              disabled={referral_status !== "active"}
              className={cn(
                "p-4 rounded-xl border transition-all",
                copied
                  ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500/20"
                  : referral_status === "active"
                  ? "bg-gray-50 dark:bg-[#1a1a1a] border-gray-200 dark:border-[#222] hover:border-emerald-500/50"
                  : "bg-gray-100 dark:bg-[#1a1a1a] border-gray-200 dark:border-[#222] opacity-50 cursor-not-allowed"
              )}
            >
              {copied ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              ) : (
                <Copy className="w-5 h-5 text-gray-500 dark:text-white/60" />
              )}
            </motion.button>
          </div>
          {referral_status !== "active" && (
            <p className="mt-4 text-sm text-red-500">
              Your referral code is currently inactive. Please contact support for assistance.
            </p>
          )}
          {referral_limit > 0 && (
            <p className="mt-4 text-sm text-gray-500 dark:text-white/60">
              You can refer up to {referral_limit} more friends.
            </p>
          )}
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-white dark:bg-[#141414] hover:bg-gray-50 dark:hover:bg-[#1a1a1a] border border-gray-200 dark:border-[#222] rounded-2xl p-6 transition-all hover:border-emerald-500/20"
            >
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
                  <benefit.icon className="w-6 h-6 text-emerald-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white/90 mb-2">{benefit.title}</h3>
                <p className="text-gray-500 dark:text-white/60 text-sm">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 