'use client';

import { useState } from 'react';
import { TrendingUp, Flame, Star, ArrowUpRight, ChevronRight, DollarSign, ImageIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// Mock data - replace with real API data later
const trendingProducts = [
  {
    id: 1,
    name: 'Sony WH-1000XM5',
    category: 'Electronics',
    price: 399.99,
    trend: '+125%',
    image: 'https://placehold.co/400x400/png',
    rating: 4.8,
    reviews: 1250,
  },
  {
    id: 2,
    name: 'Nike Air Max 2024',
    category: 'Fashion',
    price: 189.99,
    trend: '+85%',
    image: 'https://placehold.co/400x400/png',
    rating: 4.6,
    reviews: 890,
  },
  {
    id: 3,
    name: 'MacBook Pro M3',
    category: 'Electronics',
    price: 1499.99,
    trend: '+65%',
    image: 'https://placehold.co/400x400/png',
    rating: 4.9,
    reviews: 750,
  },
  {
    id: 4,
    name: 'Samsung OLED TV',
    category: 'Electronics',
    price: 1299.99,
    trend: '+45%',
    image: 'https://placehold.co/400x400/png',
    rating: 4.7,
    reviews: 520,
  },
];

const trendingCategories = [
  {
    name: 'Electronics',
    trend: '+45%',
    icon: '🔌',
    color: 'bg-blue-500/10 text-blue-500',
  },
  {
    name: 'Fashion',
    trend: '+38%',
    icon: '👕',
    color: 'bg-pink-500/10 text-pink-500',
  },
  {
    name: 'Home & Living',
    trend: '+32%',
    icon: '🏠',
    color: 'bg-green-500/10 text-green-500',
  },
  {
    name: 'Beauty',
    trend: '+28%',
    icon: '✨',
    color: 'bg-purple-500/10 text-purple-500',
  },
  {
    name: 'Sports',
    trend: '+25%',
    icon: '⚽',
    color: 'bg-orange-500/10 text-orange-500',
  },
  {
    name: 'Books',
    trend: '+22%',
    icon: '📚',
    color: 'bg-yellow-500/10 text-yellow-500',
  },
];

const timeFrames = ['Today', 'This Week', 'This Month'] as const;
type TimeFrame = typeof timeFrames[number];

export default function TrendingPage() {
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<TimeFrame>('Today');
  const [imageError, setImageError] = useState<Record<number, boolean>>({});

  const handleImageError = (productId: number) => {
    setImageError(prev => ({ ...prev, [productId]: true }));
  };

  return (
    <div className="min-h-screen p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
          <TrendingUp className="w-8 h-8 text-emerald-500" />
          Trending Now
        </h1>
        <p className="text-black/60 dark:text-white/60">
          Discover what's popular and trending across all categories
        </p>
      </div>

      {/* Time Frame Selector */}
      <div className="flex gap-2">
        {timeFrames.map((timeFrame) => (
          <button
            key={timeFrame}
            onClick={() => setSelectedTimeFrame(timeFrame)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all',
              selectedTimeFrame === timeFrame
                ? 'bg-emerald-500 text-white'
                : 'bg-light-100 dark:bg-dark-100 text-black/70 dark:text-white/70 hover:bg-light-200 dark:hover:bg-dark-200'
            )}
          >
            {timeFrame}
          </button>
        ))}
      </div>

      {/* Trending Categories */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            Trending Categories
          </h2>
          <Link 
            href="/categories" 
            className="text-sm text-emerald-500 hover:text-emerald-600 flex items-center gap-1"
          >
            View All
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {trendingCategories.map((category) => (
            <div
              key={category.name}
              className="bg-light-100 dark:bg-dark-100 rounded-xl p-4 hover:scale-105 transition-transform cursor-pointer"
            >
              <div className="flex flex-col items-center text-center space-y-2">
                <div className={cn('w-12 h-12 rounded-full flex items-center justify-center text-2xl', category.color)}>
                  {category.icon}
                </div>
                <h3 className="font-medium">{category.name}</h3>
                <p className="text-emerald-500 text-sm font-medium">
                  {category.trend}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Products */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Trending Products
          </h2>
          <Link 
            href="/discover" 
            className="text-sm text-emerald-500 hover:text-emerald-600 flex items-center gap-1"
          >
            View All
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {trendingProducts.map((product) => (
            <div
              key={product.id}
              className="bg-light-100 dark:bg-dark-100 rounded-xl overflow-hidden hover:scale-[1.02] transition-transform"
            >
              <div className="relative aspect-square bg-light-200 dark:bg-dark-200">
                {imageError[product.id] ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  </div>
                ) : (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    onError={() => handleImageError(product.id)}
                  />
                )}
                <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs font-medium px-2 py-1 rounded-lg">
                  {product.trend}
                </div>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-medium line-clamp-1">{product.name}</h3>
                    <p className="text-sm text-black/60 dark:text-white/60">
                      {product.category}
                    </p>
                  </div>
                  <div className="flex items-center text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-medium ml-1">{product.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold flex items-center">
                    <DollarSign className="w-4 h-4" />
                    {product.price}
                  </p>
                  <Link
                    href={`/product/${product.id}`}
                    className="text-emerald-500 hover:text-emerald-600"
                  >
                    <ArrowUpRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 