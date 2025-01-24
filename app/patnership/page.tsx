"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Handshake, Zap, BarChart, Puzzle, ShieldCheck, ArrowRight, Mail, Users, Rocket } from 'lucide-react';

export default function Partnership() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    website: '',
    message: ''
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Header - Same as home page */}
      <header className="fixed top-0 left-0 right-0 bg-[#0a0a0a]/80 backdrop-blur-lg border-b border-white/10 z-50">
        {/* ... (Same header content as home page) ... */}
      </header>

      {/* Hero Section */}
      <div className="relative pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Handshake className="w-4 h-4" />
              Strategic Partnerships
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent">
              Empower Your E-commerce Platform
              <br />
              with AI Shopping
            </h1>
            <p className="text-lg text-gray-400 mb-8 max-w-3xl mx-auto">
              Integrate Volera's AI shopping assistant directly into your platform and provide unparalleled value to your customers.
            </p>
          </div>
        </div>

        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-10 animate-blob animation-delay-2000" />
        </div>
      </div>

      {/* Benefits Section */}
      <div className="relative bg-[#0c0c0c] py-16 md:py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Partner with Volera?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Create mutual value and enhance your platform's capabilities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                title: 'Boost Conversion Rates',
                description: 'AI-powered product recommendations increase average order value',
                icon: BarChart,
                gradient: 'from-emerald-500/20 to-emerald-500/0'
              },
              {
                title: 'Seamless Integration',
                description: 'Easy API integration with comprehensive documentation',
                icon: Puzzle,
                gradient: 'from-emerald-400/20 to-emerald-400/0'
              },
              {
                title: 'Enhanced Customer Experience',
                description: 'Provide smart shopping assistants to your users',
                icon: Users,
                gradient: 'from-emerald-600/20 to-emerald-600/0'
              },
              {
                title: 'Competitive Edge',
                description: 'Offer cutting-edge AI features competitors lack',
                icon: Rocket,
                gradient: 'from-emerald-500/20 to-emerald-500/0'
              },
              {
                title: 'Revenue Sharing',
                description: 'Earn commissions on premium features usage',
                icon: Zap,
                gradient: 'from-emerald-400/20 to-emerald-400/0'
              },
              {
                title: 'Security & Compliance',
                description: 'GDPR-ready infrastructure with enterprise-grade security',
                icon: ShieldCheck,
                gradient: 'from-emerald-600/20 to-emerald-600/0'
              }
            ].map((benefit, index) => (
              <div 
                key={index}
                className="group relative bg-[#111111] hover:bg-[#141414] border border-white/5 rounded-2xl p-6 transition-all hover:border-emerald-500/20"
              >
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
                    <benefit.icon className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-gray-400 text-sm">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="relative bg-[#0a0a0a] py-16 md:py-24 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#111111]/40 backdrop-blur-xl rounded-2xl border border-white/10 p-8 md:p-12">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Mail className="w-4 h-4" />
                Partnership Inquiry
              </div>
              <h2 className="text-3xl font-bold mb-4">Let's Build Together</h2>
              <p className="text-gray-400">Fill out the form and our partnership team will contact you within 24 hours</p>
            </div>

            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Company Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-emerald-500/50 focus:ring-emerald-500/50 transition-all"
                  placeholder="Your company name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-emerald-500/50 transition-all"
                    placeholder="contact@company.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Website URL</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-emerald-500/50 transition-all"
                    placeholder="https://"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-emerald-500/50 transition-all"
                  placeholder="Tell us about your platform and partnership goals"
                />
              </div>

              <button
                type="submit"
                className="relative w-full px-8 py-4 overflow-hidden group bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-xl transition-all duration-300"
              >
                <span className="relative z-10 flex items-center justify-center gap-3 font-medium">
                  Send Partnership Request
                  <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Trust Badges Section */}
      <div className="relative bg-[#0c0c0c] py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-gray-400 text-sm">Trusted by leading e-commerce platforms</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-50">
            {['Platform1', 'Platform2', 'Platform3', 'Platform4'].map((platform, index) => (
              <div key={index} className="h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                <span className="text-gray-400 font-medium">{platform}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer - Same as home page */}
      <footer className="bg-[#0a0a0a] border-t border-white/5">
        {/* ... (Same footer content as home page) ... */}
      </footer>
    </div>
  );
}