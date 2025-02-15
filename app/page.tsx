"use client";

import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/footer';
import Header from '@/components/header';
import { ShoppingCart, Sparkles, Search, ArrowRight, ShieldCheck, Zap, Menu, X, Play, LineChart, Brain, DollarSign, ThumbsUp, BarChart3 } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Header */}
      <Header />
      {/* Hero Section */}
      <div className="relative min-h-screen">
        {/* Background Gradients */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 -left-4 w-72 md:w-96 h-72 md:h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob" />
          <div className="absolute top-0 -right-4 w-72 md:w-96 h-72 md:h-96 bg-emerald-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-10 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 md:w-96 h-72 md:h-96 bg-emerald-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-10 animate-blob animation-delay-4000" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-12 md:pb-24">
          <div className="flex flex-col items-center gap-12 md:gap-20">
            {/* Text Content */}
            <div className="text-center max-w-4xl mx-auto relative z-10 px-4">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500/20 to-emerald-400/20 text-emerald-400 px-4 md:px-6 py-2 rounded-full text-xs md:text-sm font-medium mb-6 md:mb-8 border border-emerald-500/20 backdrop-blur-sm">
                <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
                AI-Powered Shopping Assistant
                <span className="inline-flex items-center justify-center px-2 py-0.5 text-[10px] md:text-xs font-semibold bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">
                  BETA
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 md:mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-emerald-400 leading-tight">
                Shop Smarter with
                <br className="hidden sm:block" />
                <span className="sm:inline"> Artificial Intelligence</span>
              </h1>
              <p className="text-base md:text-lg text-gray-400 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed">
                Experience the future of e-commerce with Volera.{" "}
                <span className="hidden md:inline-block">Our AI agents analyze products across multiple platforms to help you make informed purchase decisions.</span>
              </p>
              <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
                <button 
                  className="group relative px-6 md:px-8 py-3 md:py-4 overflow-hidden bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl transition-all duration-300 hover:scale-105 transform"
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/[0.07] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 rounded-xl bg-[url('/grid.svg')] opacity-20"></div>
                  <span className="relative z-10 flex items-center justify-center gap-2 font-medium text-white text-sm md:text-base">
                    <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
                    Get Started Free
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </button>
                <button 
                  className="group relative px-6 md:px-8 py-3 md:py-4 overflow-hidden bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 transform backdrop-blur-sm"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2 font-medium text-sm md:text-base">
                    Watch Demo
                    <Play className="w-4 h-4 md:w-5 md:h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </button>
              </div>
            </div>

            {/* Video Section */}
            <div className="w-full max-w-5xl mx-auto relative z-10 px-4">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-[#111111]/60 to-[#111111]/40 backdrop-blur-xl border border-white/10 shadow-2xl">
                {/* Decorative Elements */}
                <div className="absolute top-2 md:top-4 left-2 md:left-4 flex items-center gap-1.5 md:gap-2 z-10">
                  <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-red-500/70" />
                  <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-yellow-500/70" />
                  <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-green-500/70" />
                </div>
                <Image 
                  src="/dark-marketplace.png"
                  alt="Marketplace Demo"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="w-full h-full object-contain opacity-90"
                />
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              {/* Video Controls */}
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 flex items-center gap-3 md:gap-4 px-4 md:px-6 py-1.5 md:py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-xs md:text-sm text-gray-400">AI Demo in Progress</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative bg-[#0c0c0c] py-16 md:py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Powerful Features
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need for smarter shopping
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our AI-powered platform brings together advanced features to revolutionize your shopping experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                title: 'Smart Product Search',
                description: 'AI-powered search across multiple platforms to find exactly what you need',
                icon: Search,
                gradient: 'from-emerald-500/20 to-emerald-500/0'
              },
              {
                title: 'Price Analysis',
                description: 'Real-time price comparisons and historical trends for smart shopping',
                icon: LineChart,
                gradient: 'from-emerald-400/20 to-emerald-400/0'
              },
              {
                title: 'Price Tracking',
                description: 'Monitor price drops and get alerts for best deals',
                icon: DollarSign,
                gradient: 'from-emerald-600/20 to-emerald-600/0'
              },
              {
                title: 'Instant Recommendations',
                description: 'Personalized product suggestions tailored to your unique preferences',
                icon: Brain,
                gradient: 'from-emerald-500/20 to-emerald-500/0'
              },
              {
                title: 'Smart Comparisons',
                description: 'Compare products across multiple dimensions with intelligent AI',
                icon: ThumbsUp,
                gradient: 'from-emerald-600/20 to-emerald-600/0'
              },
              {
                title: 'Market Intelligence',
                description: 'Comprehensive market data and trends for informed decision-making',
                icon: BarChart3,
                gradient: 'from-emerald-400/20 to-emerald-400/0'
              },
              
            ].map((feature, index) => (
              <div 
                key={feature.title}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                <div className="relative p-6 md:p-8 bg-white/[0.03] backdrop-blur-sm rounded-2xl border border-white/10 hover:border-emerald-500/20 transition-colors duration-300">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-b ${feature.gradient} p-2 mb-4 border border-white/10`}>
                    <feature.icon className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-10 animate-blob" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-5 animate-blob animation-delay-2000" />
        </div>
      </div>

      {/* Supported Platforms Section */}
      <div className="relative bg-[#0a0a0a] py-16 md:py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Search className="w-4 h-4" />
              Supported Platforms
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Search Across Major E-commerce Platforms
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our AI-powered search engine aggregates product data from leading e-commerce platforms
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {[
              {
                name: 'Amazon',
                logo: '/amazon.svg',
                products: '500M+ products'
              },
              {
                name: 'eBay',
                logo: '/ebay.svg',
                products: '1.7B+ listings'
              },
              {
                name: 'Walmart',
                logo: '/walmart.svg',
                products: '100M+ items'
              },
              {
                name: 'AliExpress',
                logo: '/aliexpress.svg',
                products: '100M+ products'
              },
            ].map((platform, index) => (
              <div 
                key={index}
                className="group relative bg-[#111111] hover:bg-[#141414] border border-white/5 rounded-2xl p-6 flex flex-col items-center text-center transition-all hover:border-emerald-500/20"
              >
                <div className="w-16 h-16 mb-4 relative grayscale group-hover:grayscale-0 transition-all">
                  <Image
                    src={platform.logo}
                    alt={platform.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="text-lg font-semibold mb-1">{platform.name}</h3>
                <p className="text-sm text-gray-400">{platform.products}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Testimonials Section */}
      <div className="relative bg-[#0a0a0a] py-16 md:py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Community Love
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What People Are Saying
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Join thousands of satisfied users who transformed their shopping experience
            </p>
          </div>

          {/* Auto-scrolling Cards Container */}
          <div className="relative overflow-hidden">
            <motion.div 
              className="flex gap-6 md:gap-8"
              animate={{
                x: ["0%", "-50%"],
              }}
              transition={{
                x: {
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                },
              }}
            >
              {/* First set of cards */}
              {[1, 2, 3, 4, 5].map((item) => (
                <div 
                  key={item}
                  className="flex-shrink-0 w-[320px] md:w-[400px] bg-[#111111] border border-white/5 rounded-2xl p-6 group hover:border-emerald-500/20 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                        <span className="text-emerald-400 font-bold">
                          {['A', 'B', 'C', 'D', 'E'][item-1]}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium">User {item}</h4>
                        <p className="text-sm text-gray-400">Verified Buyer</p>
                      </div>
                    </div>
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  </div>
                  <p className="text-gray-300 mb-4">
                    &quot;Volera completely transformed how I shop online. The AI recommendations
                    are scarily accurate and saved me hours of research!&quot;
                  </p>
                  <div className="flex items-center gap-2 text-emerald-400">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm">Saved $420 last month</span>
                  </div>
                </div>
              ))}
              
              {/* Duplicate set for seamless loop */}
              {[1, 2, 3, 4, 5].map((item) => (
                <div 
                  key={`duplicate-${item}`}
                  className="flex-shrink-0 w-[320px] md:w-[400px] bg-[#111111] border border-white/5 rounded-2xl p-6 group hover:border-emerald-500/20 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                        <span className="text-emerald-400 font-bold">
                          {['A', 'B', 'C', 'D', 'E'][item-1]}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium">User {item}</h4>
                        <p className="text-sm text-gray-400">Verified Buyer</p>
                      </div>
                    </div>
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  </div>
                  <p className="text-gray-300 mb-4">
                    &quot;Volera completely transformed how I shop online. The AI recommendations
                    are scarily accurate and saved me hours of research!&quot;
                  </p>
                  <div className="flex items-center gap-2 text-emerald-400">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm">Saved $420 last month</span>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Gradient Overlays */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0a0a0a] to-transparent z-20 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0a0a0a] to-transparent z-20 pointer-events-none" />
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative bg-[#0c0c0c] py-16 md:py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent rounded-3xl overflow-hidden">
            <div className="relative z-10 px-6 py-12 md:px-16 md:py-16 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent">
                Ready to Transform Your Shopping Experience?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl">
                Join thousands of smart shoppers making better decisions with Volera&apos;s AI-powered platform
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link 
                  href="/auth/signup" 
                  className="relative px-8 py-4 overflow-hidden group bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-xl transition-all duration-300 w-full sm:w-auto"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3 font-medium">
                    <ShoppingCart className="w-5 h-5" />
                    Get Started Free
                    <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/[0.07] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 rounded-xl bg-[url('/grid.svg')] opacity-10"></div>
                </Link>
                <span className="text-gray-400 text-sm flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                  No credit card required
                </span>
              </div>
            </div>
            {/* Decorative Elements */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
            <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-[64px] opacity-10 animate-blob"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-400 rounded-full mix-blend-multiply filter blur-[64px] opacity-10 animate-blob animation-delay-2000"></div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
