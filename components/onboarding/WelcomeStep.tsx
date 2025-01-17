'use client';

import { motion } from 'framer-motion';
import { ShoppingBag, Sparkles, Target, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: Sparkles,
    title: 'Smart Shopping',
    description: 'Get personalized product recommendations based on your style.',
    color: 'bg-purple-500/10 text-purple-500',
  },
  {
    icon: Target,
    title: 'Deal Finder',
    description: 'Never miss the best deals on items you love.',
    color: 'bg-blue-500/10 text-blue-500',
  },
  {
    icon: Zap,
    title: 'Quick Compare',
    description: 'Compare prices and features instantly.',
    color: 'bg-yellow-500/10 text-yellow-500',
  },
];
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

interface WelcomeStepProps {
  onNext: () => void;
}

export default function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="h-full flex flex-col justify-center"
    >
      <div className="bg-gradient-to-r from-emerald-500/20 to-emerald-500/0 p-6 rounded-lg">
        <h1>Welcome to Our App!</h1>
        <p>Your journey starts here.</p>
      </div>
      {/* Features Grid */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <motion.div
            key={feature.title}
            variants={itemVariants}
            className={cn(
              'p-4 rounded-xl',
              'bg-gray-800/80 dark:bg-gray-900',
              'backdrop-blur-lg',
              'border border-gray-600',
              'hover:border-primary/20 dark:hover:border-primary/20',
              'transition-colors duration-300'
            )}
          >
            <div className={cn(
              'w-10 h-10 rounded-lg',
              'flex items-center justify-center',
              'mb-3',
              feature.color
            )}>
              <feature.icon className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-base font-semibold text-white mb-1">
              {feature.title}
            </h3>
            <p className="text-sm text-gray-300">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div> */}
    </motion.div>
  );
}
