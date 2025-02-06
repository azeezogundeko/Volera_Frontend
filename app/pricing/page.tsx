'use client';

import { useState } from 'react';
import { Check, Sparkles, Zap, Target, Search, Star, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const plans = [
  {
    name: 'Free',
    description: 'Perfect for trying out Volera',
    price: '0',
    currency: '₦',
    features: [
      '1 product tracking',
      'Basic product insights',
      'Standard support',
      'Text search only',
    ],
    limitations: [
      'Limited search results',
      'No AI-powered insights/search',
      'No image search',
      'No voice search',
    ],
    buttonText: 'Get Started Free',
    recommended: false,
    href: '/signup'
  },
  {
    name: 'Pro Pack',
    description: 'Best for power users',
    price: '3,000',
    currency: '₦',
    features: [
      '7000 credits',
      'Save ₦1000 (33% more credits)',
      'Flexible credit usage',
      'Credits never expire',
      'Priority support',
      'Exclusive deals access',
    ],
    buttonText: 'Purchase Credits',
    recommended: true,
    href: '/checkout'
  },
  {
    name: 'Starter Pack',
    description: 'Great for regular shoppers',
    price: '1,000',
    currency: '₦',
    features: [
      '3000 credits',
      'Bonus 500 credits',
      'Flexible credit usage',
      'Credits never expire',
      'Priority support',
    ],
    buttonText: 'Purchase Credits',
    recommended: false,
    href: '/checkout'
  },
];

const features = [
  {
    icon: Search,
    title: 'Smart Search',
    description: 'Text, image, and voice search across multiple stores with AI-powered results',
    gradient: 'from-emerald-500/20 to-emerald-500/0'
  },
  {
    icon: Target,
    title: 'Price Tracking',
    description: 'Track prices and get notified when they drop',
    gradient: 'from-emerald-400/20 to-emerald-400/0'
  },
  {
    icon: Sparkles,
    title: 'AI Insights',
    description: 'Get smart recommendations and price predictions',
    gradient: 'from-emerald-600/20 to-emerald-600/0'
  },
  {
    icon: Zap,
    title: 'Real-time Alerts',
    description: 'Instant notifications for price drops and deals',
    gradient: 'from-emerald-500/20 to-emerald-500/0'
  },
];

export default function ProPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Header */}
      <div className="relative py-24">
        <div className="text-center space-y-4 max-w-3xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Star className="w-4 h-4" />
            Flexible Credit Plans
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent">
            Buy Credits
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Get more value with our credit packages - use them for any feature and never lose unused credits
          </p>
        </div>
        
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-10 animate-blob" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-5 animate-blob animation-delay-2000" />
        </div>
      </div>

      {/* Features Grid */}
      <div className="relative bg-[#0c0c0c] py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative bg-[#111111] hover:bg-[#141414] border border-white/5 rounded-2xl p-6 transition-all hover:border-emerald-500/20"
              >
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className="relative space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="relative bg-[#0a0a0a] py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={cn(
                  'group relative bg-[#111111] hover:bg-[#141414] rounded-2xl p-8 space-y-6 border border-white/5 transition-all duration-300 hover:border-emerald-500/20 flex flex-col h-full',
                  plan.recommended && 'ring-2 ring-emerald-500'
                )}
              >
                {plan.recommended && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-medium px-4 py-1 rounded-full">
                    Best Value
                  </div>
                )}
                
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">{plan.name}</h3>
                  <p className="text-gray-400 text-sm">
                    {plan.description}
                  </p>
                </div>
                
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold">{plan.currency}</span>
                  <span className="text-5xl font-bold bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent">{plan.price}</span>
                </div>

                <div className="flex flex-col h-full">
                  <ul className="space-y-3 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-300">{feature}</span>
                      </li>
                    ))}
                    {plan.limitations?.map((limitation) => (
                      <li key={limitation} className="flex items-start gap-2 opacity-50">
                        <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-400">{limitation}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-6 mt-auto">
                    <Link
                      href={plan.href === '/checkout' ? `${plan.href}?plan=${plan.name}&amount=${plan.price.replace(',', '')}` : plan.href}
                      className={cn(
                        'relative w-full py-4 px-6 rounded-xl text-sm font-medium transition-all duration-300 overflow-hidden group block',
                        plan.recommended
                          ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700'
                          : 'bg-gradient-to-b from-white/[0.03] to-white/[0.07] hover:from-white/[0.05] hover:to-white/[0.1] border border-white/10'
                      )}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {plan.buttonText}
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 -left-4 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-10 animate-blob" />
          <div className="absolute bottom-0 -right-4 w-96 h-96 bg-emerald-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-5 animate-blob animation-delay-2000" />
        </div>
      </div>

      {/* FAQ Section */}
      <div className="relative bg-[#0c0c0c] py-24 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6 text-center space-y-4">
          <h2 className="text-2xl font-semibold bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent">
            Credit Usage Examples
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-400 text-sm">
            <div className="p-4 bg-[#111111] rounded-xl">
              <div className="font-medium text-emerald-400">1 Credit</div>
              <div className="mt-1">= 1 Product Search</div>
            </div>
            <div className="p-4 bg-[#111111] rounded-xl">
              <div className="font-medium text-emerald-400">5 Credits</div>
              <div className="mt-1">= 1 Hour of Price Tracking</div>
            </div>
            <div className="p-4 bg-[#111111] rounded-xl">
              <div className="font-medium text-emerald-400">10 Credits</div>
              <div className="mt-1">= 1 AI-Powered Insight</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}