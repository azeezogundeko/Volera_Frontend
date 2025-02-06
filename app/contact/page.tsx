'use client';

import { useState } from 'react';
import { ArrowRight, Star } from 'lucide-react';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import process from 'process';


export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, message }),
    });

    if (response.ok) {
      toast.success('Message sent successfully!');
    } else {
      toast.error('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Header */}
      <div className="relative py-12 sm:py-16 md:py-24">
        <div className="text-center space-y-4 max-w-3xl mx-auto px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm font-medium mb-4 sm:mb-6">
            <Star className="w-3 h-3 sm:w-4 sm:h-4" />
            Contact Us
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent">
            We're Here to Help
          </h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
            Have questions or need assistance? Reach out to us!
          </p>
        </div>
        
        {/* Background Effects */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-[96px] sm:blur-[128px] opacity-10 animate-blob" />
          <div className="absolute bottom-0 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-emerald-400 rounded-full mix-blend-multiply filter blur-[96px] sm:blur-[128px] opacity-5 animate-blob animation-delay-2000" />
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="relative bg-[#0c0c0c] py-16 sm:py-20 md:py-24 border-t border-white/5">
        <div className="max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto px-4 sm:px-6">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 block w-full bg-[#111111] border border-white/10 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full bg-[#111111] border border-white/10 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={4}
                className="mt-1 block w-full bg-[#111111] border border-white/10 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 resize-y"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 sm:py-3 px-4 rounded-xl text-sm font-medium bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative bg-[#0a0a0a] py-16 sm:py-20 md:py-24 border-t border-white/5">
        <div className="max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent mb-4 sm:mb-6">
            Have More Questions?
          </h2>
          <p className="text-gray-400 mb-6 sm:mb-8 text-sm sm:text-base">
            Check out our FAQ page or contact support for further assistance.
          </p>
          <Link
            href="/faq"
            className="relative inline-flex px-6 sm:px-8 py-3 sm:py-4 overflow-hidden group bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-xl transition-all duration-300"
          >
            <span className="relative z-10 flex items-center gap-2 text-sm sm:text-base font-medium">
              Go to FAQ
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/[0.07] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
          <div className="mt-4 text-gray-400 text-xs sm:text-sm flex items-center justify-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            We're here to help!
          </div>
        </div>
      </div>
    </div>
  );
}
