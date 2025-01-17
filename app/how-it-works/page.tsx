'use client';

import { 
  Search, 
  Target, 
  Bot, 
  Sparkles, 
  LineChart, 
  ShoppingBag, 
  ArrowRight, 
  Star,
  Check
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const steps = [
  {
    title: 'Step 1: Smart Search',
    description: 'Use our AI-powered search to find products across multiple platforms.',
    icon: Search,
    image: '/how-it-works/smart-search.png',
    details: 'Simply enter your query in natural language, and our AI will fetch the best results from various e-commerce sites, including images and prices.'
  },
  {
    title: 'Step 2: Track Prices',
    description: 'Monitor your favorite products and get notified about price changes.',
    icon: Target,
    image: '/how-it-works/price-tracking.png',
    details: 'Set up alerts for price drops or stock availability. Our tracking system keeps you informed in real-time.'
  },
  {
    title: 'Step 3: Chat Assistant',
    description: 'Get personalized recommendations and shopping advice from our AI assistant.',
    icon: Bot,
    image: '/how-it-works/chat-assistant.png',
    details: 'Ask questions, get product suggestions, and compare prices—all through our intuitive chat interface.'
  },
  {
    title: 'Step 4: Make Informed Decisions',
    description: 'Utilize price analysis and insights to make smarter purchasing decisions.',
    icon: Sparkles,
    image: '/how-it-works/price-analysis.png',
    details: 'Access historical price trends and predictive analytics to understand when to buy.'
  },
  {
    title: 'Step 5: Enjoy Savings',
    description: 'Take advantage of deals and discounts tailored to your shopping habits.',
    icon: ShoppingBag,
    image: '/how-it-works/savings.png',
    details: 'With our smart recommendations, you’ll never miss a deal on products you love.'
  }
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Header */}
      <div className="relative py-24">
        <div className="text-center space-y-4 max-w-3xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Star className="w-4 h-4" />
            How It Works
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent">
            Discover the Power of Volera
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Follow these simple steps to start saving time and money while shopping.
          </p>
        </div>
        
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-10 animate-blob" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-5 animate-blob animation-delay-2000" />
        </div>
      </div>

      {/* Steps Section */}
      <div className="relative bg-[#0c0c0c] py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          {steps.map((step, index) => (
            <div 
              key={step.title}
              className={`relative py-24 ${index % 2 === 0 ? 'bg-[#0c0c0c]' : 'bg-[#0a0a0a]'} border-t border-white/5`}
            >
              <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 0 ? '' : 'lg:flex-row-reverse'}`}> 
                {/* Content */}
                <div className="space-y-8">
                  <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full text-sm font-medium">
                    <step.icon className="w-4 h-4" />
                    {step.title}
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-3xl font-bold">{step.description}</h2>
                    <p className="text-gray-400 text-lg">{step.details}</p>
                  </div>
                </div>

                {/* Image */}
                <div className={`relative ${index % 2 === 0 ? 'lg:order-last' : 'lg:order-first'}`}> 
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#111111] border border-white/10">
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent opacity-60" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative bg-[#0c0c0c] py-24 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent mb-6">
            Ready to Start Shopping Smarter?
          </h2>
          <p className="text-gray-400 mb-8">
            Join thousands of smart shoppers who are already saving time and money with Volera.
          </p>
          <Link
            href="/auth/signup"
            className="relative inline-flex px-8 py-4 overflow-hidden group bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-xl transition-all duration-300"
          >
            <span className="relative z-10 flex items-center gap-2 font-medium">
              Get Started Free
              <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/[0.07] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
          <div className="mt-4 text-gray-400 text-sm flex items-center justify-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            No credit card required
          </div>
        </div>
      </div>
    </div>
  );
}
