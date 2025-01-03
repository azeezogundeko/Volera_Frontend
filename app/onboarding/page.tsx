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
    <div className="min-h-screen bg-gradient-to-br from-light-100 to-light-200 dark:from-dark-100 dark:to-dark-200">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
      
      {/* Content */}
      <div className="relative min-h-screen flex">
        {/* Left Panel - Decorative */}
        <div className="hidden lg:block w-1/3 bg-primary/10 backdrop-blur-xl">
          <div className="h-full flex flex-col justify-between p-8">
            <div>
              <Image
                src="/logo.png"
                alt="Logo"
                width={120}
                height={40}
                className="mb-8"
              />
              <h1 className="text-4xl font-bold text-primary mb-4">
                Welcome to Perplexica
              </h1>
              <p className="text-black/70 dark:text-white/70">
                Your personal AI assistant for intelligent conversations
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary">1</span>
                </div>
                <div>
                  <h3 className="font-medium text-black/90 dark:text-white/90">
                    Set Up Profile
                  </h3>
                  <p className="text-sm text-black/60 dark:text-white/60">
                    Personalize your experience
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary">2</span>
                </div>
                <div>
                  <h3 className="font-medium text-black/90 dark:text-white/90">
                    Choose Interests
                  </h3>
                  <p className="text-sm text-black/60 dark:text-white/60">
                    Tell us what you like
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary">3</span>
                </div>
                <div>
                  <h3 className="font-medium text-black/90 dark:text-white/90">
                    Start Chatting
                  </h3>
                  <p className="text-sm text-black/60 dark:text-white/60">
                    Begin your AI journey
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Main Content */}
        <div className="flex-1 flex flex-col">
          <div className="max-w-2xl w-full mx-auto px-4 py-8 flex flex-col flex-1">
            <div className="mb-8">
              <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />
            </div>

            <div className="flex-1 flex flex-col">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex-1"
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

            <div className="flex justify-between items-center mt-8">
              <button
                onClick={handleSkip}
                className={cn(
                  'px-6 py-2 rounded-lg',
                  'text-black/50 dark:text-white/50',
                  'hover:text-black/70 dark:hover:text-white/70',
                  'transition-colors'
                )}
              >
                Skip for now
              </button>

              <button
                onClick={handleNext}
                className={cn(
                  'px-8 py-3 rounded-lg',
                  'bg-primary text-white',
                  'hover:bg-primary/90',
                  'transition-colors',
                  'shadow-lg shadow-primary/20'
                )}
              >
                {currentStep === TOTAL_STEPS ? 'Complete Setup' : 'Continue'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
