'use client';

import { ArrowRight, Link } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Header */}
      <div className="relative py-24">
        <div className="text-center space-y-4 max-w-3xl mx-auto px-6">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Your privacy is important to us. This policy outlines how we collect, use, and protect your information.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative bg-[#0c0c0c] py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          <h2 className="text-3xl font-bold">Information We Collect</h2>
          <p className="text-gray-400">
            We may collect the following types of information:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li>Personal Information (e.g., name, email address)</li>
            <li>Usage Data (e.g., how you use our services)</li>
            <li>Cookies and Tracking Technologies</li>
          </ul>

          <h2 className="text-3xl font-bold">How We Use Your Information</h2>
          <p className="text-gray-400">
            We use the information we collect for the following purposes:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li>To provide and maintain our services</li>
            <li>To improve and personalize your experience</li>
            <li>To communicate with you</li>
            <li>To analyze usage and trends</li>
          </ul>

          <h2 className="text-3xl font-bold">Data Security</h2>
          <p className="text-gray-400">
            We take the security of your data seriously and implement appropriate measures to protect your information.
          </p>

          <h2 className="text-3xl font-bold">Your Rights</h2>
          <p className="text-gray-400">
            You have the right to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li>Access your personal data</li>
            <li>Request correction of your data</li>
            <li>Request deletion of your data</li>
            <li>Object to processing of your data</li>
          </ul>

          <h2 className="text-3xl font-bold">Changes to This Privacy Policy</h2>
          <p className="text-gray-400">
            We may update our privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative bg-[#0a0a0a] py-24 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent mb-6">
            Have Questions?
          </h2>
          <p className="text-gray-400 mb-8">
            If you have any questions about this privacy policy, feel free to contact us.
          </p>
          <Link
            href="/contact"
            className="relative inline-flex px-8 py-4 overflow-hidden group bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-xl transition-all duration-300"
          >
            <span className="relative z-10 flex items-center gap-2 font-medium">
              Contact Us
              <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/[0.07] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
          <div className="mt-4 text-gray-400 text-sm flex items-center justify-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            We value your privacy!
          </div>
        </div>
      </div>
    </div>
  );
}
