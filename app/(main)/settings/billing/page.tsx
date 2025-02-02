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
    return <div>Loading billing information...</div>;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Billing & Credits</h1>
        
        {/* <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold">Current Plan: {billingInfo?.currentPlan}</h2>
              <p className="text-gray-600 dark:text-gray-300">
                {billingInfo?.billingCycle === 'monthly' ? 'Monthly' : 'Yearly'} Billing
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">
                {billingInfo?.remainingCredits} Credits
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Used: {billingInfo?.usedCredits} / {billingInfo?.totalCredits}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Credit Usage History</h3>
            <div className="grid grid-cols-5 gap-2">
              {billingInfo?.creditHistory.map((entry, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 p-3 rounded-md shadow-sm">
                  <p className="text-sm font-medium">{entry.date}</p>
                  <p className="text-blue-600 font-bold">{entry.credits} Credits</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 text-sm text-gray-600 dark:text-gray-300">
            <p>Next Billing Date: {billingInfo?.nextBillingDate}</p>
          </div>
        </div> */}

        {/* Credits Overview */}
        <div className="bg-white dark:bg-[#141414] rounded-xl sm:rounded-2xl border border-gray-200 dark:border-[#222] p-4 sm:p-6 mt-8">
          <div className="flex flex-col sm:flex-row justify-between mb-6">
            <div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white/90">Credits Overview</h3>
              <p className="text-sm text-gray-500 dark:text-white/60">
                Your current credit balance and usage
              </p>
            </div>
            <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-full text-sm font-medium">
              <Star className="w-4 h-4" />
              {billingInfo?.currentPlan}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#0a0a0a] rounded-xl p-4 border border-[#222]">
              <p className="text-sm text-white/60 mb-2">Total Credits (This Month)</p>
              <p className="text-2xl font-bold text-white">{billingInfo?.totalCredits.toLocaleString()}</p>
            </div>
            <div className="bg-[#0a0a0a] rounded-xl p-4 border border-[#222]">
              <p className="text-sm text-white/60 mb-2">Used Credits (This Month)</p>
              <p className="text-2xl font-bold text-white">{billingInfo?.usedCredits.toLocaleString()}</p>
            </div>
            <div className="bg-[#0a0a0a] rounded-xl p-4 border border-[#222]">
              <p className="text-sm text-white/60 mb-2">Available Credits</p>
              <p className="text-2xl font-bold text-white">{billingInfo?.remainingCredits.toLocaleString()}</p>
            </div>
          </div>

          {/* Credits Usage Graph */}
          <div className="mt-6 h-48 w-full">
            {billingInfo.creditHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                  data={billingInfo.creditHistory}
                  margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#888" 
                    interval="preserveStartEnd"
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis 
                    stroke="#888" 
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0a0a0a', 
                      borderColor: '#222',
                      color: 'white',
                      fontSize: 12
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="credits" 
                    stroke="#10b981" 
                    strokeWidth={2} 
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-white/60 text-sm">
                No credit usage history available
              </div>
            )}
          </div>
        </div>

        {/* Plans */}
        <div className="bg-white dark:bg-[#141414] rounded-xl sm:rounded-2xl border border-gray-200 dark:border-[#222] p-4 sm:p-6 mt-8">
          <div className="mb-6">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white/90">Credit Plans</h3>
            <p className="text-sm text-gray-500 dark:text-white/60">
              Choose a plan that fits your needs
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={cn(
                  'relative bg-[#0a0a0a] rounded-xl p-4 sm:p-6 space-y-4 border border-[#222]',
                  plan.recommended && 'ring-2 ring-emerald-500',
                  plan.name === billingInfo?.currentPlan && 'border-emerald-500'
                )}
              >
                {plan.recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap">
                    Recommended
                  </div>
                )}
                <div>
                  <h4 className="text-base sm:text-lg font-medium text-white">{plan.name}</h4>
                  <p className="text-sm text-white/60">{plan.description}</p>
                </div>
                <div className="flex items-baseline">
                  <span className="text-xl sm:text-2xl font-bold text-white">{plan.currency}</span>
                  <span className="text-2xl sm:text-3xl font-bold text-white">{plan.price}</span>
                  <span className="text-white/60 ml-2">/{plan.credits.toLocaleString()} credits</span>
                </div>
                <ul className="space-y-2 text-sm text-white/80">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
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
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="hidden sm:inline">Upgrading...</span>
                      <span className="sm:hidden">...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      {plan.name === billingInfo?.currentPlan ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span className="hidden sm:inline">Current Plan</span>
                          <span className="sm:hidden">Current</span>
                        </>
                      ) : (
                        <>
                          <span className="hidden sm:inline">{plan.buttonText}</span>
                          <span className="sm:hidden">Upgrade</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </div>
                  )}
                </button>
              </div>
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
