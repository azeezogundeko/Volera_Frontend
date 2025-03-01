'use client';

import { Scale, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/header';
import Footer from '@/components/footer';

interface TermsSection {
  title: string;
  content: string[];
}

const termsSections: TermsSection[] = [
  {
    title: "Acceptance of Terms",
    content: [
      "By accessing or using Perplexica, you agree to be bound by these Terms of Service",
      "If you disagree with any part of the terms, you may not access our services",
      "We reserve the right to modify these terms at any time, with notice to users",
      "Your continued use of our platform following any changes constitutes acceptance of those changes"
    ]
  },
  {
    title: "User Accounts",
    content: [
      "You must be at least 13 years old to create an account",
      "You are responsible for maintaining the security of your account credentials",
      "You must provide accurate and complete information when creating an account",
      "We reserve the right to suspend or terminate accounts that violate our terms"
    ]
  },
  {
    title: "Service Usage",
    content: [
      "Our services must be used in accordance with all applicable laws and regulations",
      "You agree not to use our platform for any illegal or unauthorized purposes",
      "You may not attempt to probe, scan, or test the vulnerability of our systems",
      "We reserve the right to modify or discontinue any part of our service without notice"
    ]
  },
  {
    title: "Intellectual Property",
    content: [
      "All content and materials available through our service are protected by intellectual property rights",
      "You may not copy, modify, distribute, or create derivative works without our permission",
      "You retain ownership of any content you submit to our platform",
      "By submitting content, you grant us a license to use it for service-related purposes"
    ]
  },
  {
    title: "Payment Terms",
    content: [
      "Subscription fees are billed in advance on a recurring basis",
      "All fees are non-refundable except where required by law",
      "We may change our fees upon notice to our users",
      "Failed payments may result in service interruption"
    ]
  },
  {
    title: "Limitation of Liability",
    content: [
      "Our services are provided 'as is' without any warranties",
      "We are not liable for any indirect, incidental, or consequential damages",
      "Our total liability shall not exceed the amounts paid by you for the service",
      "Some jurisdictions do not allow the exclusion of certain warranties or limitations"
    ]
  },
  {
    title: "Dispute Resolution",
    content: [
      "Any disputes shall be resolved through binding arbitration",
      "The arbitration will be conducted in English",
      "You waive your right to participate in class action lawsuits",
      "The laws of your jurisdiction will govern these terms"
    ]
  },
  {
    title: "Termination",
    content: [
      "We may terminate or suspend access to our service immediately without notice",
      "All provisions of the Terms which should survive termination shall survive",
      "Upon termination, your right to use the service will immediately cease",
      "You may terminate your account at any time by following the instructions in your account settings"
    ]
  }
];

export default function TermsPage() {
  const lastUpdated = "December 1, 2023";

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      <Header />
      {/* Header */}
      <div className="relative py-12 sm:py-16 md:py-24">
        <div className="text-center space-y-4 max-w-3xl mx-auto px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm font-medium mb-4 sm:mb-6">
            <Scale className="w-3 h-3 sm:w-4 sm:h-4" />
            Terms of Service
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent">
            Terms & Conditions
          </h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
            Please read these terms carefully before using our services
          </p>
          <p className="text-sm text-gray-500">Last updated: {lastUpdated}</p>
        </div>
        
        {/* Background Effects */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-[96px] sm:blur-[128px] opacity-10 animate-blob" />
          <div className="absolute bottom-0 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-emerald-400 rounded-full mix-blend-multiply filter blur-[96px] sm:blur-[128px] opacity-5 animate-blob animation-delay-2000" />
        </div>
      </div>

      {/* Terms Content */}
      <div className="relative bg-[#0c0c0c] py-16 sm:py-20 md:py-24 border-t border-white/5">
        <div className="max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto px-4 sm:px-6">
          <div className="space-y-12">
            {termsSections.map((section, index) => (
              <div key={index} className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent">
                  {section.title}
                </h2>
                <ul className="space-y-3">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-3 text-gray-400 text-sm sm:text-base">
                      <div className="mt-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative bg-[#0a0a0a] py-16 sm:py-20 md:py-24 border-t border-white/5">
        <div className="max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent mb-4 sm:mb-6">
            Have Questions About Our Terms?
          </h2>
          <p className="text-gray-400 mb-6 sm:mb-8 text-sm sm:text-base">
            If you need clarification about our terms of service, our team is ready to help.
          </p>
          <Link
            href="/contact"
            className="relative inline-flex px-6 sm:px-8 py-3 sm:py-4 overflow-hidden group bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-xl transition-all duration-300"
          >
            <span className="relative z-10 flex items-center gap-2 text-sm sm:text-base font-medium">
              Contact Legal Team
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/[0.07] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
          <div className="mt-4 text-gray-400 text-xs sm:text-sm flex items-center justify-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            These terms protect both you and our service
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 