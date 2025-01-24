"use client";

import Image from 'next/image';
import Link from 'next/link';
import { BarChart3, ShoppingCart, Sparkles, Search, ArrowRight, ShieldCheck, Zap, BarChart4, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-[#0a0a0a]/80 backdrop-blur-lg border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                  <span className="text-white font-bold">V</span>
                </div>
                <span className="text-xl font-bold">Volera</span>
              </Link>
              <nav className="hidden md:flex items-center ml-12 gap-8">
                <Link href="#features" className="text-sm text-gray-300 hover:text-white transition-colors">Features</Link>
                <Link href="#how-it-works" className="text-sm text-gray-300 hover:text-white transition-colors">How it Works</Link>
                <Link href="#pricing" className="text-sm text-gray-300 hover:text-white transition-colors">Pricing</Link>
              </nav>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <Link 
                href="/auth/login" 
                className="relative text-sm px-6 py-2.5 overflow-hidden group bg-gradient-to-b from-white/[0.03] to-white/[0.07] hover:from-white/[0.05] hover:to-white/[0.1] border border-white/10 rounded-xl transition-all duration-300"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Sign In
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/[0.05] to-emerald-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-700"></div>
              </Link>
              <Link 
                href="/auth/signup" 
                className="relative text-sm px-6 py-2.5 overflow-hidden group bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-xl transition-all duration-300"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get Started
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/[0.07] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </div>
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10">
            <div className="px-4 py-6 space-y-4">
              <Link href="#features" className="block text-sm text-gray-300 hover:text-white transition-colors">Features</Link>
              <Link href="#how-it-works" className="block text-sm text-gray-300 hover:text-white transition-colors">How it Works</Link>
              <Link href="#pricing" className="block text-sm text-gray-300 hover:text-white transition-colors">Pricing</Link>
              <div className="pt-4 space-y-3">
                <Link 
                  href="/auth/login" 
                  className="relative block text-sm px-6 py-3 overflow-hidden group bg-gradient-to-b from-white/[0.03] to-white/[0.07] hover:from-white/[0.05] hover:to-white/[0.1] border border-white/10 rounded-xl transition-all duration-300"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Sign In
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/[0.05] to-emerald-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-700"></div>
                </Link>
                <Link 
                  href="/auth/signup" 
                  className="relative block text-sm px-6 py-3 overflow-hidden group bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-xl transition-all duration-300"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Get Started
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/[0.07] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 md:pt-40 md:pb-32">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left z-10">
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                AI-Powered Shopping Assistant
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent">
                Shop Smarter with Artificial
                <br />
                 Intelligence
              </h1>
              <p className="text-lg text-gray-400 mb-8 max-w-2xl">
                Experience the future of e-commerce with Volera. Our AI agents analyze products across multiple platforms to help you make informed purchase decisions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link 
                  href="/auth/signup" 
                  className="relative px-8 py-4 overflow-hidden group bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-xl transition-all duration-300"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3 font-medium">
                    <ShoppingCart className="w-5 h-5" />
                    Get Started Free
                    <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/[0.07] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 rounded-xl bg-[url('/grid.svg')] opacity-10"></div>
                </Link>
                <Link 
                  href="#features" 
                  className="relative px-8 py-4 overflow-hidden group bg-gradient-to-b from-white/[0.03] to-white/[0.07] hover:from-white/[0.05] hover:to-white/[0.1] border border-white/10 rounded-xl transition-all duration-300"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2 font-medium">
                    Learn More
                    <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/[0.05] to-emerald-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-700"></div>
                </Link>
              </div>
            </div>

            {/* Right Content - Dashboard Preview */}
            <div className="flex-1 relative z-10">
              <div className="bg-[#111111]/40 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="space-y-2">
                    <div className="h-3 w-32 bg-emerald-500/20 rounded-full" />
                    <div className="h-3 w-24 bg-emerald-500/10 rounded-full" />
                  </div>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500/40" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/20" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/10" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-24 bg-gradient-to-r from-emerald-500/20 to-emerald-500/5 rounded-xl" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-32 bg-emerald-500/10 rounded-xl p-4">
                      <BarChart3 className="w-6 h-6 text-emerald-400 mb-2" />
                      <div className="space-y-2">
                        <div className="h-2 w-16 bg-emerald-500/20 rounded-full" />
                        <div className="h-2 w-24 bg-emerald-500/10 rounded-full" />
                      </div>
                    </div>
                    <div className="h-32 bg-emerald-500/5 rounded-xl p-4">
                      <div className="space-y-2">
                        <div className="h-2 w-20 bg-emerald-500/20 rounded-full" />
                        <div className="h-2 w-16 bg-emerald-500/10 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 -left-4 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob" />
          <div className="absolute top-0 -right-4 w-96 h-96 bg-emerald-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-10 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-emerald-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-10 animate-blob animation-delay-4000" />
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
                description: 'Find exactly what you need with our AI-powered search across multiple platforms',
                icon: Search,
                gradient: 'from-emerald-500/20 to-emerald-500/0'
              },
              {
                title: 'Price Analysis',
                description: 'Get real-time price comparisons and historical price trends',
                icon: BarChart3,
                gradient: 'from-emerald-400/20 to-emerald-400/0'
              },
              {
                title: 'Secure Transactions',
                description: 'Shop with confidence with our secure transaction monitoring',
                icon: ShieldCheck,
                gradient: 'from-emerald-600/20 to-emerald-600/0'
              },
              {
                title: 'Instant Recommendations',
                description: 'Receive personalized product recommendations based on your preferences',
                icon: Zap,
                gradient: 'from-emerald-500/20 to-emerald-500/0'
              },
              {
                title: 'Market Intelligence',
                description: 'Access comprehensive market data and trends for informed decisions',
                icon: BarChart4,
                gradient: 'from-emerald-400/20 to-emerald-400/0'
              },
              {
                title: 'Smart Comparisons',
                description: 'Compare products across multiple dimensions with AI assistance',
                icon: ArrowRight,
                gradient: 'from-emerald-600/20 to-emerald-600/0'
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="group relative bg-[#111111] hover:bg-[#141414] border border-white/5 rounded-2xl p-6 transition-all hover:border-emerald-500/20"
              >
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
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
                    "Volera completely transformed how I shop online. The AI recommendations
                    are scarily accurate and saved me hours of research!"
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
                    "Volera completely transformed how I shop online. The AI recommendations
                    are scarily accurate and saved me hours of research!"
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
                Join thousands of smart shoppers making better decisions with Volera's AI-powered platform
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
      <footer className="bg-[#0a0a0a] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          {/* Branding Section */}
          <div className="space-y-4 max-w-sm">
              <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                <span className="text-white font-bold">V</span>
              </div>
              <span className="text-xl font-bold">Volera</span>
            </div>
            <p className="text-sm text-gray-400">
              AI-powered shopping assistant helping you make smarter purchase decisions.
            </p>
          </div>

          {/* Horizontal Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white mb-2">Resources</h3>
            <div className="flex flex-row gap-6 flex-wrap">
              <Link href="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">
                Terms
                </Link>
              <Link href="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/contact" className="text-sm text-gray-400 hover:text-white transition-colors">
                Support
              </Link>
              <Link href="/docs" className="text-sm text-gray-400 hover:text-white transition-colors">
                Docs
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-white/5">
          <p className="text-sm text-gray-400 text-center">
            &copy; {new Date().getFullYear()} Volera. All rights reserved.
          </p>
        </div>
      </div>
      </footer>
    </div>
  );
}
