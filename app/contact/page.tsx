'use client';

import { useState } from 'react';
import { ArrowRight, Star } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Header */}
      <div className="relative py-24">
        <div className="text-center space-y-4 max-w-3xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Star className="w-4 h-4" />
            Contact Us
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent">
            We’re Here to Help
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Have questions or need assistance? Reach out to us!
          </p>
        </div>
        
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-10 animate-blob" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-5 animate-blob animation-delay-2000" />
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="relative bg-[#0c0c0c] py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 block w-full bg-[#111111] border border-white/10 rounded-md p-2 text-white focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full bg-[#111111] border border-white/10 rounded-md p-2 text-white focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="mt-1 block w-full bg-[#111111] border border-white/10 rounded-md p-2 text-white focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl text-sm font-medium bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative bg-[#0a0a0a] py-24 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent mb-6">
            Have More Questions?
          </h2>
          <p className="text-gray-400 mb-8">
            Check out our FAQ page or contact support for further assistance.
          </p>
          <Link
            href="/faq"
            className="relative inline-flex px-8 py-4 overflow-hidden group bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-xl transition-all duration-300"
          >
            <span className="relative z-10 flex items-center gap-2 font-medium">
              Go to FAQ
              <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/[0.07] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
          <div className="mt-4 text-gray-400 text-sm flex items-center justify-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            We’re here to help!
          </div>
        </div>
      </div>
    </div>
  );
}
