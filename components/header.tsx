"use client";

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Menu, X, ShoppingCart } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-[#0a0a0a]/80 backdrop-blur-lg border-b border-white/10 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <Image 
                src="/favicon.ico" 
                alt="Volera Logo" 
                width={32} 
                height={32} 
                className="rounded-lg"
              />
              <span className="text-xl font-bold">Volera</span>
            </Link>
            <nav className="hidden md:flex items-center ml-12 gap-8">
              <Link href="features" className="text-sm text-gray-300 hover:text-white transition-colors">Features</Link>
              <Link href="how-it-works" className="text-sm text-gray-300 hover:text-white transition-colors">How it Works</Link>
              <Link href="pricing" className="text-sm text-gray-300 hover:text-white transition-colors">Pricing</Link>
              <Link href="privacy" className="text-sm text-gray-300 hover:text-white transition-colors">Privacy</Link>
            </nav>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <Link 
              href="/login" 
              className="relative text-sm px-6 py-2.5 overflow-hidden group bg-gradient-to-b from-white/[0.03] to-white/[0.07] hover:from-white/[0.05] hover:to-white/[0.1] border border-white/10 rounded-xl transition-all duration-300"
            >
              <span className="relative z-10 flex items-center gap-2">
                Sign In
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/[0.05] to-emerald-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-700"></div>
            </Link>
            <Link 
              href="/signup" 
              className="relative text-sm px-6 py-2.5 overflow-hidden group bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-xl transition-all duration-300"
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Started
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/[0.07] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10">
            <div className="px-4 py-6 space-y-4">
              <Link href="features" className="block text-sm text-gray-300 hover:text-white transition-colors">Features</Link>
              <Link href="how-it-works" className="block text-sm text-gray-300 hover:text-white transition-colors">How it Works</Link>
              <Link href="pricing" className="block text-sm text-gray-300 hover:text-white transition-colors">Pricing</Link>
              <div className="pt-4 space-y-3">
                <Link 
                  href="/login" 
                  className="relative block text-sm px-6 py-3 overflow-hidden group bg-gradient-to-b from-white/[0.03] to-white/[0.07] hover:from-white/[0.05] hover:to-white/[0.1] border border-white/10 rounded-xl transition-all duration-300"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Sign In
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                  </span>
                </Link>
                <Link 
                  href="/signup" 
                  className="relative block text-sm px-6 py-3 overflow-hidden group bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-xl transition-all duration-300"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Get Started
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}