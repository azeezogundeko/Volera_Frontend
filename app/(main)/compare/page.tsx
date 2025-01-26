// app/compare/page.tsx
'use client';

import React from 'react';
import { ProductCard } from '@/components/compare/productCard';
import { Button } from '@/components/ui/button';
import { X, Scale, Star, Zap, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useCompareProducts } from '@/components/compare/compare-store'; // You'll need to create this store

export default function ComparePage() {
  const { compareProducts, removeFromCompare, clearCompare } = useCompareProducts();

  // Define comparable attributes
  const comparisonAttributes = [
    { id: 'price', label: 'Price', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'rating', label: 'Rating', icon: <Star className="w-4 h-4" /> },
    { id: 'reviews', label: 'Reviews', icon: <Scale className="w-4 h-4" /> },
    { id: 'discount', label: 'Discount', icon: <Zap className="w-4 h-4" /> },
  ];

  if (compareProducts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#111111]">
        <div className="text-center max-w-md p-8">
          <div className="mb-6 text-emerald-500 mx-auto">
            <Scale className="w-16 h-16" />
          </div>
          <h1 className="text-2xl font-bold mb-4 dark:text-white/90">Product Comparison</h1>
          <p className="text-gray-600 dark:text-white/70 mb-8">
            Select 2-4 products to compare their features, prices, and ratings side by side.
          </p>
          <Button asChild>
            <Link href="/marketplace">
              Browse Products
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#111111] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold dark:text-white/90">Product Comparison</h1>
            <p className="text-gray-600 dark:text-white/70 mt-2">
              Comparing {compareProducts.length} products
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={clearCompare}
            className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            Clear All
            <X className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto pb-4">
          <div className="grid grid-flow-col auto-cols-min gap-8">
            {/* Attributes Column */}
            <div className="grid grid-rows-[repeat(5,minmax(100px,auto))] gap-4 pt-14">
              {comparisonAttributes.map(attr => (
                <div
                  key={attr.id}
                  className="flex items-center gap-2 p-4 bg-white dark:bg-gray-900 rounded-lg h-[100px]"
                >
                  {attr.icon}
                  <span className="font-medium dark:text-white/90">{attr.label}</span>
                </div>
              ))}
              <div className="p-4 bg-white dark:bg-gray-900 rounded-lg h-[100px] flex items-center">
                <span className="font-medium dark:text-white/90">Store</span>
              </div>
            </div>

            {/* Products */}
            {compareProducts.map((product) => (
              <div
                key={product.product_id}
                className="grid grid-rows-[repeat(5,minmax(100px,auto))] gap-4"
              >
                {/* Product Card Header */}
                <div className="relative group">
                  <ProductCard product={product} compact />
                  <button
                    onClick={() => removeFromCompare(product.product_id)}
                    className="absolute -top-2 -right-2 bg-white dark:bg-gray-900 rounded-full p-1 shadow-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <X className="w-4 h-4 text-red-500" />
                  </button>
                </div>

                {/* Attribute Values */}
                {comparisonAttributes.map(attr => (
                  <div
                    key={attr.id}
                    className="p-4 bg-white dark:bg-gray-900 rounded-lg h-[100px] flex items-center justify-center"
                  >
                    <span className="font-medium dark:text-white/90">
                      {attr.id === 'price' && `${product.currency}${product.current_price}`}
                      {attr.id === 'rating' && product.rating}
                      {attr.id === 'reviews' && product.reviews_count}
                      {attr.id === 'discount' && `${product.discount}%`}
                    </span>
                  </div>
                ))}
                
                {/* Store */}
                <div className="p-4 bg-white dark:bg-gray-900 rounded-lg h-[100px] flex items-center justify-center">
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">
                    {product.source}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Metrics Summary */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl">
            <h3 className="font-semibold mb-4 dark:text-white/90">Best Price</h3>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {Math.min(...compareProducts.map((p: { current_price: any; }) => p.current_price))}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl">
            <h3 className="font-semibold mb-4 dark:text-white/90">Highest Rated</h3>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {Math.max(...compareProducts.map((p: { rating: any; }) => p.rating))}/5
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl">
            <h3 className="font-semibold mb-4 dark:text-white/90">Most Reviews</h3>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {Math.max(...compareProducts.map((p: { reviews_count: string; }) => parseInt(p.reviews_count)))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}