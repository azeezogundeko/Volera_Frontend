"use client";

import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center gap-6 text-center">
          {/* Branding */}
          <div className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/90 flex items-center justify-center transition-all group-hover:bg-emerald-500">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-semibold">Volera</span>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-400">
            <Link 
              href="/terms" 
              className="hover:text-emerald-400 transition-colors duration-200"
            >
              Terms
            </Link>
            <span className="text-white/10">•</span>
            <Link 
              href="/privacy" 
              className="hover:text-emerald-400 transition-colors duration-200"
            >
              Privacy
            </Link>
            <span className="text-white/10">•</span>
            <Link 
              href="/contact" 
              className="hover:text-emerald-400 transition-colors duration-200"
            >
              Contact
            </Link>
            <span className="text-white/10">•</span>
            <Link 
              href="/docs" 
              className="hover:text-emerald-400 transition-colors duration-200"
            >
              Docs
            </Link>
          </div>

          {/* Copyright */}
          <p className="text-xs text-gray-500 mt-4">
            &copy; {new Date().getFullYear()} Volera. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}