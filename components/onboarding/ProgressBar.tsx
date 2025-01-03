'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full space-y-4">
      {/* Step Numbers */}
      <div className="flex justify-between relative">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          
          return (
            <div key={index} className="relative z-10">
              <motion.div
                initial={false}
                animate={{
                  scale: isCurrent ? 1.2 : 1,
                  backgroundColor: isCompleted || isCurrent ? 'var(--primary-color)' : 'var(--bg-light)',
                }}
                className={cn(
                  'w-8 h-8 rounded-full',
                  'flex items-center justify-center',
                  'transition-colors duration-300',
                  isCompleted || isCurrent ? 'text-white' : 'text-black/50 dark:text-white/50',
                  'border-2',
                  isCompleted || isCurrent ? 'border-primary' : 'border-light-200 dark:border-dark-200'
                )}
              >
                {isCompleted ? (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  stepNumber
                )}
              </motion.div>
              
              {/* Step Label */}
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                <span className={cn(
                  'text-xs font-medium',
                  isCurrent ? 'text-primary' : 'text-black/50 dark:text-white/50'
                )}>
                  {stepNumber === 1 ? 'Welcome' : stepNumber === 2 ? 'Profile' : 'Preferences'}
                </span>
              </div>
            </div>
          );
        })}

        {/* Progress Line */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-light-200 dark:bg-dark-200 -translate-y-1/2 -z-10">
          <motion.div
            className="h-full bg-primary origin-left"
            initial={false}
            animate={{ scaleX: progress / 100 }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </div>
  );
}
