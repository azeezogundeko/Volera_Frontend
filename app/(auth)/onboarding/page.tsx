"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Loader2, Star } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import WelcomeStep from '@/components/onboarding/WelcomeStep';
import ProfileStep from '@/components/onboarding/ProfileStep';
import PreferencesStep from '@/components/onboarding/PreferencesStep';
import ProgressBar from '@/components/onboarding/ProgressBar';
import { useChat } from '@/hooks/useChat';
import Image from 'next/image';
import Link from 'next/link';

interface ProfileData {
  avatar?: File;
  gender: string;
  phone: string;
  address: string;
  city: string;
  country: string;
}

interface PreferencesData {
  interests: string[];
  price_range: string;
  shopping_frequency: string;
  preferred_categories: string[];
  notification_preferences: string[];
}

interface FormData {
  profile: Partial<ProfileData>;
  preferences: Partial<PreferencesData>;
}

const generateUniqueChatId = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8); // 6 random alphanumeric chars
  const userRandom = Math.random().toString(36).substring(2, 6); // 4 random alphanumeric chars
  return `${timestamp}-${random}-${userRandom}`;
};
const TOTAL_STEPS = 3;

export default function OnboardingPage() {
  const router = useRouter();
  const { createNewChat } = useChat();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    profile: {},
    preferences: {
      interests: [],
      preferred_categories: [],
      notification_preferences: [],
      price_range: '',
      shopping_frequency: ''
    },
  });

  const handleNext = async () => {
    if (currentStep < TOTAL_STEPS) {
      // Validate gender field in profile step
      if (currentStep === 2) {  // Profile step
        if (!formData.profile.gender) {
          toast.error('Please select your gender to continue');
          return;
        }
      }
      setCurrentStep(prev => prev + 1);
    } else {
      // Submit all data
      setIsSubmitting(true);
      const preferences = formData.preferences;
      const payload = {
        ...formData.profile,
        shopping_frequency: preferences.shopping_frequency || '',
        price_range: preferences.price_range || '',
        preferred_categories: preferences.preferred_categories || [],
        notification_preferences: preferences.notification_preferences || [],
        interests: preferences.interests || []
      }
      try {
        const formDataToSend = new FormData();
        Object.entries(payload).forEach(([key, value]) => {
          if (typeof value === 'string') {
            formDataToSend.append(key, value);
          } else if (value instanceof Blob) {
            formDataToSend.append(key, value);
          } else if (Array.isArray(value)) {
            // Convert arrays to JSON strings for proper transmission
            formDataToSend.append(key, JSON.stringify(value));
          } else if (value !== null && value !== undefined) {
            formDataToSend.append(key, String(value));
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
          toast.success('Profile setup completed successfully!');
          try {
            // Generate a random hex string for the chat ID
            const newChatId = generateUniqueChatId();
            router.push(`/c/${newChatId}`);
          } catch (error) {
            console.error('Error creating new chat:', error);
            toast.error('Failed to create new chat');
          }
        } else {
          router.push('/dashboard');
          // toast.error('Failed to create chat, sendMessage not available.');
        }
      } catch (error) {
        console.error('Error submitting onboarding data:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to complete profile setup');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleSkip = async () => {
    try {
      // Generate a random hex string for the chat ID
      const newChatId = generateUniqueChatId();
      router.push(`/c/${newChatId}`);
    } catch (error) {
      console.error('Error creating new chat:', error);
      toast.error('Failed to create new chat');
    }
  };


  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1a1a1a',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
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
        <button 
          onClick={handleSkip} 
          className="text-xs sm:text-sm text-gray-400 hover:text-gray-300 transition-colors"
          disabled={isSubmitting}
        >
          Skip for now
        </button>
        <button 
          onClick={handleNext} 
          disabled={isSubmitting}
          className="px-4 sm:px-6 py-2 bg-emerald-500 text-white text-sm rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting...
            </>
          ) : (
            'Continue'
          )}
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