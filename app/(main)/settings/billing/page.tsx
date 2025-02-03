'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, 
  Check, 
  Clock, 
  AlertCircle,
  CheckCircle2,
  Loader2,
  ArrowRight,
  Star,
  History,
  Receipt,
  Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { getBillingInfo, BillingInfo } from '@/lib/api';
import { useTheme } from 'next-themes';

const plans = [
  {
    name: 'Starter Pack',
    description: 'Perfect for occasional users',
    price: '1,000',
    credits: 3000,
    currency: '₦',
    features: [
      '3,000 credits',
      'Basic search requests',
      'Standard product tracking',
      'Basic insights',
    ],
    buttonText: 'Current Plan',
    recommended: false,
  },
  {
    name: 'Pro Plan',
    description: 'Best for power users',
    price: '3,000',
    credits: 7000,
    currency: '₦',
    features: [
      '7,000 credits',
      'Advanced search capabilities',
      'Priority product tracking',
      'Detailed AI insights',
      'Bonus 500 credits',
    ],
    buttonText: 'Upgrade to Pro',
    recommended: true,
  },
];


export default function BillingSettings() {
  const { theme } = useTheme();
  const [billingInfo, setBillingInfo] = useState<BillingInfo>({
    currentPlan: '',
    totalCredits: 0,
    usedCredits: 0,
    remainingCredits: 0,
    creditHistory: [],
    
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBillingInfo = async () => {
      try {
        const info = await getBillingInfo();
        setBillingInfo(info);
      } catch (error) {
        console.error('Error fetching billing information:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBillingInfo();
  }, []);

  const handleUpgrade = async (plan: { name: string, credits: number }) => {
    setIsSaving(true);
    try {
      // Simulate API call for upgrading plan
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Refetch billing info after upgrade
      const updatedInfo = await getBillingInfo();
      setBillingInfo(updatedInfo);
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error upgrading plan:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0a0a0a] py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            <p className="text-sm text-gray-600 dark:text-white/60">Loading billing information...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white/90 mb-8">Billing & Credits</h1>

        {/* Credit Usage Overview */}
        <div className="bg-white dark:bg-[#141414] rounded-xl sm:rounded-2xl border border-gray-200 dark:border-[#222] shadow-sm p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between mb-6">
            <div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white/90">Credit Usage</h3>
              <p className="text-sm text-gray-500 dark:text-white/60">
                Your current credit usage and balance
              </p>
            </div>
            <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-full text-sm font-medium">
              <Star className="w-4 h-4" />
              {billingInfo?.currentPlan}
            </div>
          </div>

          <div className="space-y-6">
            {/* Progress Bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-500 dark:text-white/60">Usage</p>
                <p className="text-sm text-gray-500 dark:text-white/60">
                  {billingInfo?.usedCredits.toLocaleString()} / {billingInfo?.totalCredits.toLocaleString()}
                </p>
              </div>
              <div className="relative w-full h-4 bg-gray-100 dark:bg-[#222] rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "absolute left-0 top-0 h-full transition-all duration-500",
                    billingInfo.remainingCredits <= 0 
                      ? "bg-red-500" 
                      : billingInfo.remainingCredits < 500 
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                  )}
                  style={{ 
                    width: `${Math.min((billingInfo.usedCredits / billingInfo.totalCredits) * 100, 100)}%` 
                  }}
                />
              </div>
            </div>

            {/* Credit Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gray-50 dark:bg-[#0a0a0a] rounded-xl p-4 border border-gray-200 dark:border-[#222]">
                <p className="text-sm text-gray-500 dark:text-white/60 mb-2">Total Credits (Last 30 Days)</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{billingInfo?.totalCredits.toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 dark:bg-[#0a0a0a] rounded-xl p-4 border border-gray-200 dark:border-[#222]">
                <p className="text-sm text-gray-500 dark:text-white/60 mb-2">Used Credits (Last 30 Days)</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{billingInfo?.usedCredits.toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 dark:bg-[#0a0a0a] rounded-xl p-4 border border-gray-200 dark:border-[#222]">
                <p className="text-sm text-gray-500 dark:text-white/60 mb-2">Available Credits</p>
                <p className={cn(
                  "text-2xl font-bold",
                  billingInfo.remainingCredits <= 0 
                    ? "text-red-500" 
                    : billingInfo.remainingCredits < 500 
                      ? "text-amber-500"
                      : "text-gray-900 dark:text-white"
                )}>{billingInfo?.remainingCredits.toLocaleString()}</p>
              </div>
            </div>

            {/* Usage History Graph */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-base font-medium text-gray-900 dark:text-white/90">Usage History</h4>
                  <p className="text-sm text-gray-500 dark:text-white/60">Credit usage over time</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-white/60">
                  <History className="w-4 h-4" />
                  Last 30 days
            </div>
          </div>

              <div className="h-48 w-full">
            {billingInfo.creditHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                  data={billingInfo.creditHistory}
                  margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                >
                      <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#222' : '#e5e7eb'} />
                  <XAxis 
                    dataKey="date" 
                    stroke={theme === 'dark' ? '#888' : '#6b7280'} 
                    interval="preserveStartEnd"
                    tick={{ fontSize: 10 }}
                    tickFormatter={(dateStr) => {
                      const date = new Date(dateStr);
                      return date.toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        // hour: '2-digit',
                        // minute: '2-digit',
                        // hour12: true
                      });
                    }}
                  />
                  <YAxis 
                        stroke={theme === 'dark' ? '#888' : '#6b7280'}
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                          backgroundColor: theme === 'dark' ? '#0a0a0a' : '#fff',
                          borderColor: theme === 'dark' ? '#222' : '#e5e7eb',
                          color: theme === 'dark' ? 'white' : '#111827',
                          fontSize: 12,
                          borderRadius: '0.5rem',
                          padding: '0.5rem',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }} 
                        itemStyle={{
                          color: '#10b981'
                        }}
                        labelStyle={{
                          color: theme === 'dark' ? 'white' : '#111827',
                          fontWeight: 'bold',
                          marginBottom: '0.25rem'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="credits" 
                    stroke="#10b981" 
                    strokeWidth={2} 
                    dot={false}
                        activeDot={{ r: 4, fill: '#10b981' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
                  <div className="flex items-center justify-center h-full text-gray-500 dark:text-white/60 text-sm">
                    No usage history available
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Plans */}
        <div className="bg-white dark:bg-[#141414] rounded-xl sm:rounded-2xl border border-gray-200 dark:border-[#222] shadow-sm p-4 sm:p-6 mt-8">
          <div className="mb-6">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white/90">Credit Plans</h3>
            <p className="text-sm text-gray-500 dark:text-white/60">
              Choose a plan that fits your needs
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.3,
                  delay: index * 0.2,
                  ease: "easeOut"
                }}
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'relative bg-gray-50 dark:bg-[#0a0a0a] rounded-xl p-4 sm:p-6 space-y-4 border border-gray-200 dark:border-[#222]',
                  plan.recommended && 'ring-2 ring-emerald-500',
                  plan.name === billingInfo?.currentPlan && 'border-emerald-500'
                )}
              >
                {plan.recommended && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (index * 0.2) + 0.3 }}
                    className="absolute -top-3 inset-x-0 mx-auto flex items-center justify-center"
                  >
                    <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap">
                      <span className="relative inline-flex items-center gap-1">
                    Recommended
                        <motion.span
                          initial={{ opacity: 0.5, scale: 0.8 }}
                          animate={{ opacity: [0.5, 1, 0.5], scale: [0.8, 1, 0.8] }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          ✨
                        </motion.span>
                      </span>
                  </div>
                  </motion.div>
                )}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: (index * 0.2) + 0.2 }}
                >
                  <h4 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">{plan.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-white/60">{plan.description}</p>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: (index * 0.2) + 0.3 }}
                  className="flex items-baseline"
                >
                  <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{plan.currency}</span>
                  <span className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                  <span className="text-gray-500 dark:text-white/60 ml-2">/{plan.credits.toLocaleString()} credits</span>
                </motion.div>
                <motion.ul 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: (index * 0.2) + 0.4 }}
                  className="space-y-2 text-sm text-gray-600 dark:text-white/80"
                >
                  {plan.features.map((feature, featureIndex) => (
                    <motion.li 
                      key={featureIndex}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ 
                        delay: (index * 0.2) + 0.5 + (featureIndex * 0.1),
                        duration: 0.2
                      }}
                      className="flex items-center gap-2"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ 
                          delay: (index * 0.2) + 0.5 + (featureIndex * 0.1),
                          type: "spring",
                          stiffness: 200
                        }}
                      >
                      <Check className="w-4 h-4 text-emerald-400" />
                      </motion.div>
                      {feature}
                    </motion.li>
                  ))}
                </motion.ul>
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: (index * 0.2) + 0.6,
                    duration: 0.2
                  }}
                  whileHover={{ 
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleUpgrade(plan)}
                  disabled={plan.name === billingInfo?.currentPlan || isSaving}
                  className={cn(
                    'w-full py-2 px-4 rounded-lg text-sm font-medium transition-all',
                    plan.name === billingInfo?.currentPlan
                      ? 'bg-emerald-500/10 text-emerald-400 cursor-default'
                      : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                  )}
                >
                  {isSaving ? (
                    <div className="flex items-center justify-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ 
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      >
                        <Loader2 className="w-4 h-4" />
                      </motion.div>
                      <span className="hidden sm:inline">Upgrading...</span>
                      <span className="sm:hidden">...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      {plan.name === billingInfo?.currentPlan ? (
                        <>
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                          >
                          <Check className="w-4 h-4" />
                          </motion.div>
                          <span className="hidden sm:inline">Current Plan</span>
                          <span className="sm:hidden">Current</span>
                        </>
                      ) : (
                        <>
                          <span className="hidden sm:inline">{plan.buttonText}</span>
                          <span className="sm:hidden">Upgrade</span>
                          <motion.div
                            whileHover={{ x: 5 }}
                            transition={{ duration: 0.2 }}
                          >
                          <ArrowRight className="w-4 h-4" />
                          </motion.div>
                        </>
                      )}
                    </div>
                  )}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Success Message */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-4 right-4 left-4 sm:left-auto bg-emerald-50 dark:bg-emerald-500/10 text-emerald-900 dark:text-emerald-300 px-4 py-2 rounded-lg shadow-lg flex items-center justify-center sm:justify-start gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Plan updated successfully
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
