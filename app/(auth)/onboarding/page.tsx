'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import WelcomeStep from '@/components/onboarding/WelcomeStep';
import ProfileStep from '@/components/onboarding/ProfileStep';
import PreferencesStep from '@/components/onboarding/PreferencesStep';
import ProgressBar from '@/components/onboarding/ProgressBar';
import { cn } from '@/lib/utils';
import Image from 'next/image';

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
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/onboarding`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          router.push('/');
        } else {
          throw new Error('Failed to save onboarding data');
        }
      } catch (error) {
        console.error('Onboarding error:', error);
      }
    }
  };

  const handleSkip = () => {
    router.push('/');
  };

  const handleProfileSave = (data: any) => {
    setFormData(prev => ({
      ...prev,
      profile: data,
    }));
  };

  const handlePreferencesSave = (data: any) => {
    setFormData(prev => ({
      ...prev,
      preferences: data,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-100 to-light-200 dark:from-dark-100 dark:to-dark-200 flex items-center justify-center p-2 sm:p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
      
      {/* Content Card */}
      <div className="relative w-full max-w-[95%] sm:max-w-[90%] md:max-w-2xl lg:max-w-4xl bg-white dark:bg-[#1a1a1a] rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8">
        <div className="flex flex-col items-center text-center">
          {/* Welcome Text */}
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-black dark:text-white mb-2 sm:mb-3">
            Welcome to Your Shopping Assistant! 🛍️
          </h1>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-black/70 dark:text-white/70 mb-6 sm:mb-8 max-w-2xl">
            Let's personalize your shopping experience to find the best deals and products for you.
          </p>

          {/* Progress Bar */}
          <div className="w-full mb-6 sm:mb-8">
            <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />
          </div>

          {/* Step Content */}
          <div className="w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full"
              >
                {currentStep === 1 && <WelcomeStep />}
                {currentStep === 2 && (
                  <ProfileStep
                    onSave={handleProfileSave}
                    initialData={formData.profile}
                  />
                )}
                {currentStep === 3 && (
                  <PreferencesStep
                    onSave={handlePreferencesSave}
                    initialData={formData.preferences}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center w-full mt-6 sm:mt-8">
            <button
              onClick={handleSkip}
              className="text-xs sm:text-sm text-black/50 dark:text-white/50 hover:text-black/70 dark:hover:text-white/70 transition-colors"
            >
              Skip for now
            </button>

            <button
              onClick={handleNext}
              className="px-4 sm:px-6 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
