'use client';

import { Shield, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface PolicySection {
  title: string;
  content: string[];
}

const policySections: PolicySection[] = [
  {
    title: "Information We Collect",
    content: [
      "Personal information such as name, email address, and profile details when you create an account",
      "Usage data including your interactions with our services, features used, and time spent on the platform",
      "Device information such as IP address, browser type, and operating system",
      "Communication data from your interactions with our support team"
    ]
  },
  {
    title: "How We Use Your Information",
    content: [
      "To provide and maintain our services, including personalizing your experience",
      "To communicate with you about updates, security alerts, and support messages",
      "To detect and prevent fraud, abuse, and security incidents",
      "To analyze usage patterns and improve our platform's functionality"
    ]
  },
  {
    title: "Data Protection",
    content: [
      "We implement industry-standard security measures to protect your data",
      "All data is encrypted in transit and at rest using strong encryption protocols",
      "Regular security audits and assessments are conducted to ensure data safety",
      "Access to personal data is strictly limited to authorized personnel"
    ]
  },
  {
    title: "Your Rights",
    content: [
      "Access and download your personal data",
      "Request correction or deletion of your information",
      "Opt-out of marketing communications",
      "Lodge a complaint with your local data protection authority"
    ]
  },
  {
    title: "Cookie Policy",
    content: [
      "We use essential cookies to maintain basic platform functionality",
      "Analytics cookies help us understand how you use our services",
      "You can control cookie preferences through your browser settings",
      "Third-party cookies are carefully vetted for security and privacy"
    ]
  },
  {
    title: "Updates to Privacy Policy",
    content: [
      "We may update this policy to reflect changes in our practices",
      "You will be notified of any material changes via email",
      "Continued use of our services constitutes acceptance of the updated policy",
      "Previous versions of the policy are available upon request"
    ]
  }
];

export default function PrivacyPage() {
  const lastUpdated = "December 1, 2023";

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Header */}
      <div className="relative py-12 sm:py-16 md:py-24">
        <div className="text-center space-y-4 max-w-3xl mx-auto px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm font-medium mb-4 sm:mb-6">
            <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
            Privacy Policy
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent">
            Your Privacy Matters
          </h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
            Learn how we collect, use, and protect your personal information
          </p>
          <p className="text-sm text-gray-500">Last updated: {lastUpdated}</p>
        </div>
        
        {/* Background Effects */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-[96px] sm:blur-[128px] opacity-10 animate-blob" />
          <div className="absolute bottom-0 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-emerald-400 rounded-full mix-blend-multiply filter blur-[96px] sm:blur-[128px] opacity-5 animate-blob animation-delay-2000" />
        </div>
      </div>

      {/* Policy Content */}
      <div className="relative bg-[#0c0c0c] py-16 sm:py-20 md:py-24 border-t border-white/5">
        <div className="max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto px-4 sm:px-6">
          <div className="space-y-12">
            {policySections.map((section, index) => (
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
            Have Privacy Concerns?
          </h2>
          <p className="text-gray-400 mb-6 sm:mb-8 text-sm sm:text-base">
            If you have any questions about our privacy practices, we&apos;re here to help.
          </p>
          <Link
            href="/contact"
            className="relative inline-flex px-6 sm:px-8 py-3 sm:py-4 overflow-hidden group bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-xl transition-all duration-300"
          >
            <span className="relative z-10 flex items-center gap-2 text-sm sm:text-base font-medium">
              Contact Our Privacy Team
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/[0.07] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
          <div className="mt-4 text-gray-400 text-xs sm:text-sm flex items-center justify-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            Your data is protected by industry-leading security measures
          </div>
        </div>
      </div>
    </div>
  );
} 