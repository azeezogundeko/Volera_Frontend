'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, CreditCard, Zap, Shield, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Plan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  isPopular?: boolean;
}

const plans: Plan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 9.99,
    interval: 'month',
    features: [
      'Up to 5 projects',
      'Basic analytics',
      'Email support',
      '5GB storage',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 49.99,
    interval: 'month',
    features: [
      'Unlimited projects',
      'Advanced analytics',
      'Priority support',
      '50GB storage',
      'Custom domains',
      'Team collaboration',
    ],
    isPopular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99.99,
    interval: 'month',
    features: [
      'Everything in Pro',
      'Enterprise support',
      'Unlimited storage',
      'Custom integrations',
      'Advanced security',
      'Dedicated account manager',
    ],
  },
];

export default function SubscriptionSettings() {
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');

  return (
    <div className="space-y-8">
      {/* Current Subscription */}
      <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Current Subscription</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Pro Plan - Monthly</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 bg-emerald-500 rounded-full"></div>
            <span className="text-sm text-emerald-600">Active</span>
          </div>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Next billing date: February 17, 2025
        </div>
      </section>

      {/* Billing Interval Toggle */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-lg p-1 bg-gray-100 dark:bg-gray-800">
          <button
            onClick={() => setBillingInterval('month')}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-md',
              billingInterval === 'month'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow'
                : 'text-gray-500 dark:text-gray-400'
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingInterval('year')}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-md',
              billingInterval === 'year'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow'
                : 'text-gray-500 dark:text-gray-400'
            )}
          >
            Yearly
            <span className="ml-1 text-emerald-600">-20%</span>
          </button>
        </div>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <motion.div
            key={plan.id}
            whileHover={{ scale: 1.02 }}
            className={cn(
              'relative bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden',
              plan.isPopular && 'ring-2 ring-emerald-500',
              selectedPlan === plan.id && 'ring-2 ring-emerald-500'
            )}
          >
            {plan.isPopular && (
              <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-medium px-3 py-1 rounded-bl-lg">
                Popular
              </div>
            )}
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">{plan.name}</h3>
              <div className="mt-4">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  ${billingInterval === 'year' ? (plan.price * 0.8 * 12).toFixed(2) : plan.price}
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  /{billingInterval}
                </span>
              </div>
              <ul className="mt-6 space-y-4">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <button
                  onClick={() => setSelectedPlan(plan.id)}
                  className={cn(
                    'w-full px-4 py-2 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500',
                    selectedPlan === plan.id
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                  )}
                >
                  {selectedPlan === plan.id ? 'Current Plan' : 'Select Plan'}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Cancel Subscription */}
      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-8">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Cancel Subscription</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          You can cancel your subscription at any time. Your plan will remain active until the end of your billing period.
        </p>
        <button className="mt-4 text-sm text-red-600 hover:text-red-700">
          Cancel Subscription
        </button>
      </div>
    </div>
  );
}
