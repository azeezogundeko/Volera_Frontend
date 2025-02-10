'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';
import Link from 'next/link';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How do I get started with Perplexica?",
    answer: "Getting started is easy! Simply sign up for an account, complete your profile, and you can begin exploring our features immediately. We offer a guided tutorial for new users to help you understand all the key features."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and various local payment methods depending on your region. All payments are processed securely through our payment partners."
  },
  {
    question: "Can I cancel my subscription at any time?",
    answer: "Yes, you can cancel your subscription at any time through your account settings. Once cancelled, you'll continue to have access to your subscription benefits until the end of your current billing period."
  },
  {
    question: "How secure is my data?",
    answer: "We take data security very seriously. All data is encrypted both in transit and at rest using industry-standard encryption protocols. We regularly perform security audits and comply with global data protection regulations."
  },
  {
    question: "Do you offer refunds?",
    answer: "Yes, we offer a 30-day money-back guarantee on all new subscriptions. If you're not satisfied with our service, contact our support team within 30 days of your purchase for a full refund."
  },
  {
    question: "How can I contact customer support?",
    answer: "Our customer support team is available 24/7. You can reach us through our contact form, email support@perplexica.com, or use the live chat feature in your dashboard. We typically respond within 24 hours."
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Header */}
      <div className="relative py-12 sm:py-16 md:py-24">
        <div className="text-center space-y-4 max-w-3xl mx-auto px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm font-medium mb-4 sm:mb-6">
            <HelpCircle className="w-3 h-3 sm:w-4 sm:h-4" />
            FAQ
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
            Find answers to common questions about our services
          </p>
        </div>
        
        {/* Background Effects */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-[96px] sm:blur-[128px] opacity-10 animate-blob" />
          <div className="absolute bottom-0 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-emerald-400 rounded-full mix-blend-multiply filter blur-[96px] sm:blur-[128px] opacity-5 animate-blob animation-delay-2000" />
        </div>
      </div>

      {/* FAQ Section */}
      <div className="relative bg-[#0c0c0c] py-16 sm:py-20 md:py-24 border-t border-white/5">
        <div className="max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto px-4 sm:px-6">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-[#111111] border border-white/10 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-4 sm:px-6 py-4 flex items-center justify-between text-left"
                >
                  <span className="text-sm sm:text-base font-medium">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-emerald-400 transform transition-transform duration-200 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openIndex === index && (
                  <div className="px-4 sm:px-6 pb-4 text-sm sm:text-base text-gray-400">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative bg-[#0a0a0a] py-16 sm:py-20 md:py-24 border-t border-white/5">
        <div className="max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent mb-4 sm:mb-6">
            Still Have Questions?
          </h2>
          <p className="text-gray-400 mb-6 sm:mb-8 text-sm sm:text-base">
            Can&apos;t find what you&apos;re looking for? Reach out to our support team.
          </p>
          <Link
            href="/contact"
            className="relative inline-flex px-6 sm:px-8 py-3 sm:py-4 overflow-hidden group bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-xl transition-all duration-300"
          >
            <span className="relative z-10 flex items-center gap-2 text-sm sm:text-base font-medium">
              Contact Support
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/[0.07] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
          <div className="mt-4 text-gray-400 text-xs sm:text-sm flex items-center justify-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            We&apos;re here to help!
          </div>
        </div>
      </div>
    </div>
  );
} 