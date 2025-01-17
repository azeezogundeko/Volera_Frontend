'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const stepLabels = ['Welcome', 'Profile', 'Preferences'];

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-[22px] left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: progress / 100 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {Array.from({ length: totalSteps }).map((_, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;
            
            return (
              <div key={index} className="flex flex-col items-center relative">
                {/* Step Circle */}
                <motion.div
                  initial={false}
                  animate={{
                    scale: isCurrent ? 1.1 : 1,
                    transition: { type: "spring", stiffness: 500, damping: 30 }
                  }}
                  className="relative"
                >
                  <motion.div
                    initial={false}
                    animate={{
                      backgroundColor: isCompleted ? '#10b981' : isCurrent ? '#10b981' : '#fff',
                      borderColor: isCompleted || isCurrent ? '#10b981' : '#e5e7eb',
                    }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      'w-11 h-11 rounded-full border-2',
                      'flex items-center justify-center',
                      'transition-shadow duration-200',
                      isCurrent && 'shadow-lg shadow-emerald-500/25',
                      isCompleted || isCurrent ? 'text-white' : 'text-gray-400'
                    )}
                  >
                    {isCompleted ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      >
                        <Check className="w-5 h-5" />
                      </motion.div>
                    ) : (
                      <span className={cn(
                        'text-sm font-semibold',
                        isCurrent ? 'text-white' : 'text-gray-500'
                      )}>
                        {stepNumber}
                      </span>
                    )}
                  </motion.div>
                </motion.div>

                {/* Step Label */}
                <motion.div
                  initial={false}
                  animate={{
                    y: isCurrent ? -4 : 0,
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="mt-4"
                >
                  <span className={cn(
                    'text-sm font-medium transition-colors duration-200',
                    isCurrent ? 'text-emerald-500' : isCompleted ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400'
                  )}>
                    {stepLabels[index]}
                  </span>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
