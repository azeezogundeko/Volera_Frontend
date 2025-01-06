import React from 'react';

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
}

const OnboardingProgress: React.FC<OnboardingProgressProps> = ({
  currentStep,
  totalSteps,
}) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-screen-xl mx-auto px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all duration-300 ease-in-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <div className="text-sm font-medium text-gray-600 dark:text-gray-300 min-w-[3rem] text-center">
            {currentStep}/{totalSteps}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingProgress; 