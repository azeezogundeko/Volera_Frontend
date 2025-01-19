'use client';

import { useState } from 'react';
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

const plans = [
  {
    name: 'Free',
    description: 'Perfect for trying out Volera',
    price: '0',
    currency: '₦',
    features: [
      '5 search requests daily',
      '1 product tracking',
      'Basic product insights',
      'Standard support',
      'Text search only',
    ],
    limitations: [
      'Limited search results',
      'Basic tracking features',
      'No AI-powered insights',
      'No image search',
      'No voice search',
    ],
    buttonText: 'Current Plan',
    recommended: false,
  },
  {
    name: 'Basic',
    description: 'Great for regular shoppers',
    price: '1,000',
    currency: '₦',
    features: [
      '20 search requests daily',
      '10 product tracking slots',
      'Enhanced product insights',
      'Priority support',
      'Price history data',
      'Deal alerts',
      'Image search (10/day)',
      'Voice search (10/day)',
    ],
    buttonText: 'Upgrade to Basic',
    recommended: true,
  },
  {
    name: 'Premium',
    description: 'Best for power users',
    price: '5,000',
    currency: '₦',
    features: [
      '100 search requests daily',
      '50 product tracking slots',
      'Advanced AI insights',
      'Priority support',
      'Detailed price history',
      'Instant deal alerts',
      'Market trend analysis',
      'Custom tracking intervals',
      'Unlimited image search',
      'Unlimited voice search',
      'Advanced search filters',
    ],
    buttonText: 'Upgrade to Premium',
    recommended: false,
  },
];

const paymentMethods = [
  {
    id: 'card1',
    type: 'Visa',
    last4: '4242',
    expiry: '12/25',
    isDefault: true,
  },
  {
    id: 'card2',
    type: 'Mastercard',
    last4: '8888',
    expiry: '06/24',
    isDefault: false,
  },
];

const billingHistory = [
  {
    id: 'inv_001',
    date: 'Jan 1, 2024',
    amount: '₦1,000',
    status: 'Paid',
    plan: 'Basic Plan',
  },
  {
    id: 'inv_002',
    date: 'Dec 1, 2023',
    amount: '₦1,000',
    status: 'Paid',
    plan: 'Basic Plan',
  },
];

export default function BillingSettings() {
  const [currentPlan] = useState('Free');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleUpgrade = async (planName: string) => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      // Handle error
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white/90">Billing Settings</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-white/60">
            Manage your subscription and payment methods
          </p>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {/* Current Plan */}
          <div className="bg-white dark:bg-[#141414] rounded-xl sm:rounded-2xl border border-gray-200 dark:border-[#222] p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-2 sm:space-y-0">
              <div>
                <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white/90">Current Plan</h3>
                <p className="text-sm text-gray-500 dark:text-white/60">
                  You are currently on the {currentPlan} plan
                </p>
              </div>
              <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-full text-sm font-medium self-start sm:self-auto">
                <Star className="w-4 h-4" />
                {currentPlan}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={cn(
                    'relative bg-[#0a0a0a] rounded-xl p-4 sm:p-6 space-y-4 border border-[#222]',
                    plan.recommended && 'ring-2 ring-emerald-500',
                    plan.name === currentPlan && 'border-emerald-500'
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
                    <span className="text-white/60 ml-2">/mo</span>
                  </div>
                  <button
                    onClick={() => handleUpgrade(plan.name)}
                    disabled={plan.name === currentPlan || isSaving}
                    className={cn(
                      'w-full py-2 px-4 rounded-lg text-sm font-medium transition-all',
                      plan.name === currentPlan
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
                        {plan.name === currentPlan ? (
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

          {/* Payment Methods */}
          <div className="bg-white dark:bg-[#141414] rounded-xl sm:rounded-2xl border border-gray-200 dark:border-[#222] p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
              <div>
                <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white/90">Payment Methods</h3>
                <p className="text-sm text-gray-500 dark:text-white/60">
                  Manage your payment methods
                </p>
              </div>
              <button className="w-full sm:w-auto px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors">
                Add New Card
              </button>
            </div>

            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#0a0a0a] border border-[#222] rounded-xl space-y-4 sm:space-y-0"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                      <CreditCard className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-medium text-white">
                          {method.type} ending in {method.last4}
                        </p>
                        {method.isDefault && (
                          <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-white/60">Expires {method.expiry}</p>
                    </div>
                  </div>
                  <button className="text-white/60 hover:text-white transition-colors w-full sm:w-auto text-center sm:text-left">
                    Edit
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Billing History */}
          <div className="bg-white dark:bg-[#141414] rounded-xl sm:rounded-2xl border border-gray-200 dark:border-[#222] p-4 sm:p-6">
            <div className="mb-6">
              <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white/90">Billing History</h3>
              <p className="text-sm text-gray-500 dark:text-white/60">
                View your billing history and download invoices
              </p>
            </div>

            <div className="space-y-4">
              {billingHistory.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#0a0a0a] border border-[#222] rounded-xl space-y-4 sm:space-y-0"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                      <Receipt className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{invoice.plan}</p>
                      <p className="text-sm text-white/60">{invoice.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <p className="text-sm font-medium text-white">{invoice.amount}</p>
                    <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-full">
                      {invoice.status}
                    </span>
                    <button className="text-white/60 hover:text-white transition-colors">
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
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
