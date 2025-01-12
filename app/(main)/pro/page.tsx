'use client';

import { useState } from 'react';
import { Check, Sparkles, Zap, Target, Search, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

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

const features = [
  {
    icon: Search,
    title: 'Smart Search',
    description: 'Text, image, and voice search across multiple stores with AI-powered results',
  },
  {
    icon: Target,
    title: 'Price Tracking',
    description: 'Track prices and get notified when they drop',
  },
  {
    icon: Sparkles,
    title: 'AI Insights',
    description: 'Get smart recommendations and price predictions',
  },
  {
    icon: Zap,
    title: 'Real-time Alerts',
    description: 'Instant notifications for price drops and deals',
  },
];

export default function ProPage() {
  const [billingCycle] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="min-h-screen p-6 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold">
          Upgrade to{' '}
          <span className="bg-gradient-to-r from-emerald-500 to-emerald-400 bg-clip-text text-transparent">
            Pro
          </span>
        </h1>
        <p className="text-black/60 dark:text-white/60 text-lg">
          Get more out of Volera with increased limits and advanced features
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="bg-light-100 dark:bg-dark-100 rounded-xl p-6 space-y-3"
          >
            <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <feature.icon className="w-6 h-6 text-emerald-500" />
            </div>
            <h3 className="font-semibold text-lg">{feature.title}</h3>
            <p className="text-black/60 dark:text-white/60 text-sm">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              'relative bg-light-100 dark:bg-dark-100 rounded-2xl p-8 space-y-6',
              plan.recommended && 'ring-2 ring-emerald-500'
            )}
          >
            {plan.recommended && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-sm font-medium px-3 py-1 rounded-full">
                Recommended
              </div>
            )}
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">{plan.name}</h3>
              <p className="text-black/60 dark:text-white/60 text-sm">
                {plan.description}
              </p>
            </div>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold">{plan.currency}</span>
              <span className="text-5xl font-bold">{plan.price}</span>
              {billingCycle === 'monthly' && (
                <span className="text-black/60 dark:text-white/60 ml-2">/mo</span>
              )}
            </div>
            <ul className="space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
              {plan.limitations?.map((limitation) => (
                <li key={limitation} className="flex items-start gap-2 opacity-50">
                  <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{limitation}</span>
                </li>
              ))}
            </ul>
            <button
              className={cn(
                'w-full py-3 px-4 rounded-xl text-sm font-medium transition-colors',
                plan.recommended
                  ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                  : 'bg-light-200 dark:bg-dark-200 hover:bg-light-300 dark:hover:bg-dark-300'
              )}
            >
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
        <p className="text-black/60 dark:text-white/60">
          Need help? Check out our{' '}
          <a href="/faq" className="text-emerald-500 hover:text-emerald-600">
            FAQ page
          </a>{' '}
          or{' '}
          <a href="/contact" className="text-emerald-500 hover:text-emerald-600">
            contact support
          </a>
        </p>
      </div>
    </div>
  );
} 