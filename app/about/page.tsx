'use client';

import { Star, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Header */}
      <div className="relative py-24">
        <div className="text-center space-y-4 max-w-3xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Star className="w-4 h-4" />
            About Us
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent">
            Our Mission and Vision
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Learn more about our journey and what drives us to help you shop smarter.
          </p>
        </div>
        
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-10 animate-blob" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-5 animate-blob animation-delay-2000" />
        </div>
      </div>

      {/* About Content Section */}
      <div className="relative bg-[#0c0c0c] py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <h2 className="text-3xl font-bold">Who We Are</h2>
          <p className="text-gray-400">
            Volera is a dedicated team of tech enthusiasts and shopping experts committed to revolutionizing the online shopping experience. Our goal is to empower consumers with the tools they need to make informed purchasing decisions.
          </p>
          <Image
            src="/about/team.jpg"
            alt="Our Team"
            width={600}
            height={400}
            className="rounded-2xl"
          />

          <h2 className="text-3xl font-bold">Our Values</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li>Innovation: We strive to stay ahead of the curve with cutting-edge technology.</li>
            <li>Integrity: We value transparency and honesty in all our interactions.</li>
            <li>Customer-Centric: Our users are at the heart of everything we do.</li>
            <li>Collaboration: We believe in the power of teamwork and shared knowledge.</li>
          </ul>

          <h2 className="text-3xl font-bold">Join Us on Our Journey</h2>
          <p className="text-gray-400">
            We invite you to be a part of our community. Whether you're a shopper looking for the best deals or a partner wanting to collaborate, we welcome you to reach out and connect with us.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            Get in Touch
            <Users className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
