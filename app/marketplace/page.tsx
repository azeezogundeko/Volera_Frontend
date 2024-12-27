'use client';

import React, { useState } from 'react';
import SearchBar from '@/components/marketplace/SearchBar';
import ProductCard from '@/components/marketplace/ProductCard';
import { Store, Zap, Tag, TrendingUp, Star, Clock, Flame } from 'lucide-react';

// Dummy data for demonstration
const dummyProducts = [
  {
    id: 1,
    title: 'Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    image: '/images/products/headphones.jpg',
    price: 199.99,
    rating: 4.5,
    stores: [
      { name: 'Amazon', price: 199.99 },
      { name: 'Best Buy', price: 189.99 },
    ],
  },
  {
    id: 2,
    title: 'Sony WH-1000XM4 Wireless Noise-Canceling Headphones',
    description: 'Industry-leading noise canceling with Dual Noise Sensor technology. Next-level music with Edge-AI, co-developed with Sony Music Studios Tokyo.',
    image: 'https://example.com/headphones.jpg',
    price: 348,
    rating: 4.8,
    stores: [
      { name: 'Amazon', price: 348 },
      { name: 'Best Buy', price: 349.99 },
      { name: 'Target', price: 349.99 },
    ],
  },
  // ... more products
];

const MarketplacePage = () => {
  const [products] = useState(dummyProducts);

  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
  };

  const handleImageSearch = (file: File) => {
    console.log('Image search with:', file);
  };

  const handleFilterChange = (filters: any) => {
    console.log('Filters changed:', filters);
  };

  // Function to render a section of products
  const renderProductSection = (title: string, icon: React.ReactNode, products: any[], subtitle?: string) => (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {icon}
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white/90">{title}</h2>
          </div>
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-white/50">{subtitle}</p>
          )}
        </div>
        <button className="text-sm text-emerald-500 hover:text-emerald-600 font-medium">
          View all
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-[#111111]">
      <div className="max-w-[1200px] w-full mx-auto px-6 py-6">
        {/* Header */}
        <div className="flex flex-col gap-8 mb-12">
          {/* Title Section */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-white/70 text-transparent bg-clip-text">
                  Marketplace
                </h1>
                <div className="px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <span className="text-sm text-emerald-500">
                    {products.length.toLocaleString()} products
                  </span>
                </div>
              </div>
              <p className="text-base text-gray-500 dark:text-white/50">
                Discover and compare products across multiple stores
              </p>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Store className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white/90">
                    5+ Stores
                  </div>
                  <div className="text-xs text-gray-500 dark:text-white/50">
                    Best prices
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-purple-500" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white/90">
                    AI-Powered
                  </div>
                  <div className="text-xs text-gray-500 dark:text-white/50">
                    Smart search
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                  <Tag className="w-4 h-4 text-orange-500" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white/90">
                    Best Deals
                  </div>
                  <div className="text-xs text-gray-500 dark:text-white/50">
                    Daily updates
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search Section */}
          <div className="relative">
            {/* Content */}
            <div className="relative py-3">
              <SearchBar onSearch={handleSearch} onImageSearch={handleImageSearch} />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-12">
          {/* Trending Now */}
          {renderProductSection(
            'Trending Now',
            <TrendingUp className="w-6 h-6 text-orange-500" />,
            products,
            'Most popular products this week'
          )}

          {/* Recommended for You */}
          {renderProductSection(
            'Recommended for You',
            <Star className="w-6 h-6 text-purple-500" />,
            products,
            'Based on your preferences'
          )}

          {/* New Arrivals */}
          {renderProductSection(
            'New Arrivals',
            <Clock className="w-6 h-6 text-blue-500" />,
            products,
            'Latest products added to our marketplace'
          )}

          {/* Best Deals */}
          {renderProductSection(
            'Best Deals',
            <Flame className="w-6 h-6 text-red-500" />,
            products,
            'Greatest savings across all stores'
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketplacePage;
