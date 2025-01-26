"use client";

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Sparkles, Zap, ShieldCheck, ArrowRight, Menu, X, ShoppingCart } from 'lucide-react';

export default function Waitlist() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [topEmail, setTopEmail] = useState('');
  const [bottomEmail, setBottomEmail] = useState('');

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Header - Same as home page */}
      {/* <header className="fixed top-0 left-0 right-0 bg-[#0a0a0a]/80 backdrop-blur-lg border-b border-white/10 z-50"> */}
       <Header />
      {/* </header> */}

      {/* Hero Section */}
      <div className="relative pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              Early Access Program
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent">
              Join the Future of
              <br />
              Smart Shopping
            </h1>
            {/* Adjusted text size here */}
            <p className="text-base md:text-lg text-gray-400 mb-8 px-4 sm:px-0">
              Be among the first to experience Volera's AI-powered shopping assistant. Get early access, exclusive updates, and special privileges.
            </p>

            {/* Waitlist Form */}
            <div className="max-w-xl mx-auto px-4 sm:px-0">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative group">
                  <input
                    type="email"
                    value={topEmail}
                    onChange={(e) => setTopEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="relative z-10 w-full px-4 py-3 md:px-6 md:py-4 bg-white/5 border border-white/10 rounded-xl placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-all text-sm md:text-base"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <button className="relative px-6 py-3 md:px-8 md:py-4 overflow-hidden group bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-xl transition-all duration-300 text-sm md:text-base">
                  <span className="relative z-10 flex items-center justify-center gap-2 md:gap-3 font-medium">
                    Join Waitlist
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/[0.07] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              </div>
              <p className="text-xs md:text-sm text-gray-500 mt-3 flex items-center justify-center gap-2">
                <ShieldCheck className="w-3 h-3 md:w-4 md:h-4 text-emerald-500" />
                We respect your privacy. No spam, ever.
              </p>
            </div>
          </div>
        </div>

        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 -left-4 w-72 h-72 md:w-96 md:h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-[100px] md:blur-[128px] opacity-20 animate-blob" />
          <div className="absolute top-0 -right-4 w-72 h-72 md:w-96 md:h-96 bg-emerald-400 rounded-full mix-blend-multiply filter blur-[100px] md:blur-[128px] opacity-10 animate-blob animation-delay-2000" />
        </div>
      </div>

      {/* Benefits Section */}
      <div className="relative bg-[#0c0c0c] py-12 md:py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              Why Join the Waitlist?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
              Exclusive benefits for our early community members
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {[
              {
                title: 'Early Access',
                description: 'Be first to experience new features before public release',
                icon: Zap,
                gradient: 'from-emerald-500/20 to-emerald-500/0'
              },
              {
                title: 'Exclusive Updates',
                description: 'Get insider news and product development updates',
                icon: ShieldCheck,
                gradient: 'from-emerald-400/20 to-emerald-400/0'
              },
              {
                title: 'Special Privileges',
                description: 'Earn early adopter rewards and premium benefits',
                icon: Sparkles,
                gradient: 'from-emerald-600/20 to-emerald-600/0'
              },
            ].map((benefit, index) => (
              <div 
                key={index}
                className="group relative bg-[#111111] hover:bg-[#141414] border border-white/5 rounded-2xl p-4 md:p-6 transition-all hover:border-emerald-500/20"
              >
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className="relative">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-3 md:mb-4 group-hover:bg-emerald-500/20 transition-colors">
                    <benefit.icon className="w-5 h-5 md:w-6 md:h-6 text-emerald-400" />
                  </div>
                  <h3 className="text-base md:text-lg font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-gray-400 text-xs md:text-sm">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative bg-[#0c0c0c] py-12 md:py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent rounded-3xl overflow-hidden">
            <div className="relative z-10 px-4 py-8 md:px-16 md:py-16 text-center">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent">
                Ready to Transform Your Shopping Experience?
              </h2>
              <p className="text-base md:text-xl text-gray-300 mb-6 md:mb-8 max-w-2xl mx-auto">
                Join thousands of smart shoppers making better decisions with Volera's AI-powered platform
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <div className="flex-1 relative group max-w-md w-full">
                  <input
                    type="email"
                    value={bottomEmail}
                    onChange={(e) => setBottomEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="relative z-10 w-full px-4 py-3 md:px-6 md:py-4 bg-white/5 border border-white/10 rounded-xl placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-all text-sm md:text-base"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <button 
                  className="relative px-6 py-3 md:px-8 md:py-4 overflow-hidden group bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-xl transition-all duration-300 w-full sm:w-auto text-sm md:text-base"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2 md:gap-3 font-medium">
                    <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
                    Join Waitlist
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/[0.07] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 rounded-xl bg-[url('/grid.svg')] opacity-10"></div>
                </button>
                <span className="text-gray-400 text-xs md:text-sm flex items-center gap-2 sm:hidden">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                  No credit card required
                </span>
              </div>
            </div>
            <div className="absolute inset-0 rounded-3xl bg-[url('/grid.svg')] opacity-10"></div>
          </div>
        </div>
      </div>

      {/* Footer - Same as home page */}
      {/* <footer className="bg-[#0a0a0a] border-t border-white/5"> */}
        <Footer/>
      {/* </footer> */}
    </div>
  );
}