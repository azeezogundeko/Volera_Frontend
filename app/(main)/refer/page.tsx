'use client';

import { useState } from 'react';
import { Share2, Copy, CheckCircle2, Users, Gift, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function ReferPage() {
  const [copied, setCopied] = useState(false);
  const referralCode = 'VOLERA2024'; // This would typically come from your backend

  const handleCopy = async () => {
    await navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const benefits = [
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
      title: 'Unlimited Rewards',
      description: 'No limit on how many friends you can refer',
      gradient: 'from-emerald-600/20 to-emerald-600/0'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors duration-300">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white/90">Refer Friends</h1>
          <p className="mt-2 text-base text-gray-600 dark:text-white/60">
            Share Volera with your friends and earn rewards
          </p>
        </div>

        {/* Referral Code Card */}
        <div className="mb-12 bg-white dark:bg-[#141414] rounded-2xl border border-gray-200 dark:border-[#222] shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg">
              <Share2 className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white/90">Your Referral Code</h2>
              <p className="text-sm text-gray-500 dark:text-white/60">Share this code with your friends</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 bg-gray-50 dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-[#222] p-4">
              <code className="text-lg font-mono text-emerald-500">{referralCode}</code>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCopy}
              className={cn(
                "p-4 rounded-xl border transition-all",
                copied
                  ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500/20"
                  : "bg-gray-50 dark:bg-[#1a1a1a] border-gray-200 dark:border-[#222] hover:border-emerald-500/50"
              )}
            >
              {copied ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              ) : (
                <Copy className="w-5 h-5 text-gray-500 dark:text-white/60" />
              )}
            </motion.button>
          </div>
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