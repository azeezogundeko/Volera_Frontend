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
  Scale,
  Zap,
  Brain,
  Bell,
  Check
} from 'lucide-react';
import Footer from '@/components/footer';
import Header from '@/components/header';
import Image from 'next/image';
import Link from 'next/link';

const features = [
  {
    title: 'AI Smart Search',
    description: 'Find products across multiple e-commerce platforms with our advanced AI-powered search engine.',
    icon: Search,
    gradient: 'from-emerald-500/20 to-emerald-500/0',
    image: '/dark-marketplace.PNG',
    benefits: [
      'Natural language processing for better results',
      'Image and voice search capabilities',
      'Real-time search suggestions',
      'Cross-platform product discovery'
    ],
    details: 'Search for products using text, images, or voice commands. Our AI understands natural language queries and provides accurate results across multiple e-commerce platforms. Get instant suggestions and find exactly what you\'re looking for.'
  },
  {
    title: 'Product Tracking',
    description: 'Monitor product prices and availability across different stores in real-time.',
    icon: Target,
    gradient: 'from-emerald-400/20 to-emerald-400/0',
    image: '/track.PNG',
    benefits: [
      'Real-time price alerts',
      'Price history graphs',
      'Stock availability notifications',
      'Custom tracking intervals'
    ],
    details: 'Track prices of your favorite products and get notified when they drop. View detailed price history graphs and set custom alerts for price changes. Never miss a deal again.'
  },
  {
    title: 'AI Chat Assistant',
    description: 'Get personalized shopping assistance and product recommendations from our AI assistant.',
    icon: Bot,
    gradient: 'from-emerald-600/20 to-emerald-600/0',
    image: '/chat.PNG',
    benefits: [
      'Product recommendations',
      'Price comparison assistance',
      'Shopping advice',
      'Deal hunting support'
    ],
    details: 'Our AI chat assistant helps you make informed shopping decisions. Get personalized recommendations, compare prices, and receive expert advice on the best time to buy.'
  },
  {
    title: 'Product Hunting',
    description: 'Discover the best deals and trending products across multiple platforms.',
    icon: ShoppingBag,
    gradient: 'from-emerald-500/20 to-emerald-500/0',
    image: '/features/product-hunting.png',
    benefits: [
      'Trending product alerts',
      'Deal notifications',
      'Price drop alerts',
      'Wishlist management'
    ],
    details: 'Stay ahead of the curve with our product hunting feature. Discover trending products, get notified about deals, and manage your wishlist effectively.'
  },
  {
    title: 'Price Analysis',
    description: 'Get detailed price insights and predictions for smarter shopping decisions.',
    icon: LineChart,
    gradient: 'from-emerald-400/20 to-emerald-400/0',
    image: '/details.PNG',
    benefits: [
      'Historical price trends',
      'Price prediction',
      'Seasonal analysis',
      'Market insights'
    ],
    details: 'Make data-driven shopping decisions with our advanced price analysis tools. View historical trends, predict future prices, and understand seasonal patterns.'
  },
  {
    title: 'Smart Recommendations',
    description: 'Receive personalized product recommendations based on your preferences and browsing history.',
    icon: Sparkles,
    gradient: 'from-emerald-600/20 to-emerald-600/0',
    image: '/features/recommendations.png',
    benefits: [
      'Personalized suggestions',
      'Similar product recommendations',
      'Alternative options',
      'Budget-friendly alternatives'
    ],
    details: 'Get tailored product recommendations based on your preferences and shopping history. Discover similar products, alternatives, and budget-friendly options.'
  }
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Header */}
      <Header />
      <div className="relative min-h-screen flex flex-col justify-center items-center py-12 sm:py-24">
        <div className="text-center space-y-4 max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
            <Star className="w-3 h-3 sm:w-4 sm:h-4" />
            Powerful Features
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent leading-tight">
            Everything You Need for Smart Shopping
          </h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto px-4 sm:px-0">
            Discover how Volera helps you find the best deals, track prices, and make smarter shopping decisions.
          </p>
        </div>
        
        {/* Background Effects */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-48 sm:w-96 h-48 sm:h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-[64px] sm:blur-[128px] opacity-10 animate-blob" />
          <div className="absolute bottom-0 right-1/4 w-48 sm:w-96 h-48 sm:h-96 bg-emerald-400 rounded-full mix-blend-multiply filter blur-[64px] sm:blur-[128px] opacity-5 animate-blob animation-delay-2000" />
        </div>
      </div>

      {/* Feature Sections */}
      {features.map((feature, index) => (
        <div 
          key={feature.title}
          className={`relative py-12 sm:py-24 ${index % 2 === 0 ? 'bg-[#0c0c0c]' : 'bg-[#0a0a0a]'} border-t border-white/5`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
              {/* Content */}
              <div className="space-y-6 sm:space-y-8">
                <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium">
                  <feature.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                  {feature.title}
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <h2 className="text-2xl sm:text-3xl font-bold">{feature.description}</h2>
                  <p className="text-gray-400 text-sm sm:text-lg">{feature.details}</p>
                </div>
                <ul className="space-y-3 sm:space-y-4">
                  {feature.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2 sm:gap-3">
                      <div className="mt-1">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-500/10 flex items-center justify-center">
                          <Check className="w-2 h-2 sm:w-3 sm:h-3 text-emerald-400" />
                        </div>
                      </div>
                      <span className="text-xs sm:text-base text-gray-300">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors text-sm sm:text-base"
                >
                  Try it now
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </Link>
              </div>

              {/* Image */}
              <div className="relative order-first lg:order-last">
                <div className="relative aspect-[16/9] sm:aspect-[16/9] rounded-xl sm:rounded-2xl overflow-hidden bg-[#111111] border border-white/10">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    className="object-contain p-2"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent opacity-60" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* CTA Section */}
      <div className="relative bg-[#0c0c0c] py-12 sm:py-24 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent mb-4 sm:mb-6">
            Ready to Start Shopping Smarter?
          </h2>
          <p className="text-gray-400 text-sm sm:text-base mb-6 sm:mb-8 px-4 sm:px-0">
            Join thousands of smart shoppers who are already saving time and money with Volera.
          </p>
          <Link
            href="/auth/signup"
            className="relative inline-flex px-6 py-3 sm:px-8 sm:py-4 overflow-hidden group bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-xl transition-all duration-300"
          >
            <span className="relative z-10 flex items-center gap-2 font-medium text-sm sm:text-base">
              Get Started Free
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/[0.07] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
          <div className="mt-3 sm:mt-4 text-gray-400 text-xs sm:text-sm flex items-center justify-center gap-2">
            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-emerald-500"></div>
            No credit card required
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
