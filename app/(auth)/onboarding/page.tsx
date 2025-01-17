"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Star } from 'lucide-react';
import WelcomeStep from '@/components/onboarding/WelcomeStep';
import ProfileStep from '@/components/onboarding/ProfileStep';
import PreferencesStep from '@/components/onboarding/PreferencesStep';
import ProgressBar from '@/components/onboarding/ProgressBar';
import Image from 'next/image';
import Link from 'next/link';

const TOTAL_STEPS = 3;

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    profile: {},
    preferences: {},
  });

  const handleNext = async () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Submit all data
      const payload = {
        ...formData.preferences, ...formData.profile
      }
      try {
        const formDataToSend = new FormData();
        Object.entries(payload).forEach(([key, value]) => {
          if (typeof value === 'string' || value instanceof Blob) {
            formDataToSend.append(key, value);
          } else {
            console.error(`Invalid type for value: ${value}`);
          }
        });

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/onboarding`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          },
          body: formDataToSend,
        });

        if (response.ok) {
          router.push('/');
        }
      } catch (error) {
        console.error('Error submitting onboarding data:', error);
      }
    }
  };

  const handleSkip = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Header */}
      <div className="relative py-24">
        <div className="text-center space-y-4 max-w-3xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Star className="w-4 h-4" />
            Onboarding
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent">
            Welcome to Volera!
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Follow these simple steps to get started with your smart shopping journey.
          </p>
        </div>
      </div>

      {/* Revamped Progress Bar */}
      <div className="w-full max-w-3xl mx-auto mb-6">
        <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />
      </div>

      {/* Steps Section */}
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        {currentStep === 1 && <WelcomeStep onNext={handleNext} />}
        {currentStep === 2 && <ProfileStep onNext={handleNext} setFormData={setFormData} formData={formData} />}
        {currentStep === 3 && <PreferencesStep onNext={handleNext} setFormData={setFormData} formData={formData} />}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center w-full max-w-3xl mx-auto px-6 mb-6">
        <button onClick={handleSkip} className="text-xs sm:text-sm text-gray-400 hover:text-gray-300 transition-colors">
          Skip for now
        </button>
        <button onClick={handleNext} className="px-4 sm:px-6 py-2 bg-emerald-500 text-white text-sm rounded-lg hover:bg-emerald-600 transition-colors">
          Continue
        </button>
      </div>

      {/* CTA Section
      <div className="relative bg-[#0c0c0c] py-24 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent mb-6">
            Ready to Start Shopping Smarter?
          </h2>
          <p className="text-gray-400 mb-8">
            Join thousands of smart shoppers who are already saving time and money with Volera.
          </p>
          <Link
            href="/auth/signup"
            className="relative inline-flex px-8 py-4 overflow-hidden group bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-xl transition-all duration-300"
          >
            <span className="relative z-10 flex items-center gap-2 font-medium">
              Get Started Free
              <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/[0.07] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
          <div className="mt-4 text-gray-400 text-sm flex items-center justify-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            No credit card required
          </div>
        </div>
      </div> */}
    </div>
  );
}