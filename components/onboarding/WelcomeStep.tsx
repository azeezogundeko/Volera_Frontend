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

export default function WelcomeStep() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="h-full flex flex-col justify-center"
    >
      {/* Hero Section */}
      <motion.div
        variants={itemVariants}
        className="text-center mb-8"
      >
        <div className="inline-block">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl" />
            <div className="relative w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="w-10 h-10 text-primary" />
            </div>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-black/90 dark:text-white/90 mb-2">
          Welcome to Your Shopping Assistant! 🛍️
        </h1>
        <p className="text-base text-black/70 dark:text-white/70 max-w-lg mx-auto">
          Let's personalize your shopping experience to find the best deals and products for you.
        </p>
      </motion.div>

      {/* Features Grid */}
      <div className="grid grid-cols-3 gap-4">
        {features.map((feature) => (
          <motion.div
            key={feature.title}
            variants={itemVariants}
            className={cn(
              'p-4 rounded-xl',
              'bg-white/50 dark:bg-black/20',
              'backdrop-blur-lg',
              'border border-black/5 dark:border-white/5',
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
              <feature.icon className="w-5 h-5" />
            </div>

            <h3 className="text-base font-semibold text-black/90 dark:text-white/90 mb-1">
              {feature.title}
            </h3>
            <p className="text-sm text-black/70 dark:text-white/70">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
