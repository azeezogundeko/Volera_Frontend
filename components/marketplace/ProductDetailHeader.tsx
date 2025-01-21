'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ProductDetailHeaderProps {
  productName?: string;
}

const ProductDetailHeader = ({ productName }: ProductDetailHeaderProps) => {
  const router = useRouter();

  return (
    <header className="bg-light-50 dark:bg-dark-50 shadow-sm dark:shadow-gray-900/10 sticky top-0 z-30 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="border-b border-gray-200 dark:border-gray-800">
          <div className="px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
            <div className="flex items-center">
              {/* Left side with back button - Hidden on mobile */}
              <div className="hidden sm:flex items-center space-x-4">
                <button
                  onClick={() => router.back()}
                  className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                  aria-label="Go back"
                >
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
                </button>
                <Link 
                  href="/marketplace" 
                  className="text-sm sm:text-base text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                >
                  Marketplace
                </Link>
                <span className="text-gray-400 dark:text-gray-600">/</span>
              </div>

              {/* Mobile back button - Positioned to not interfere with sidebar */}
              <div className="sm:hidden flex items-center">
                <button
                  onClick={() => router.back()}
                  className="ml-12 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                  aria-label="Go back"
                >
                  <ArrowLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              {/* Product name - Centered on mobile */}
              <div className="flex-1 sm:flex-none">
                <h1 className="text-sm sm:text-base text-gray-900 dark:text-gray-100 font-medium truncate max-w-[150px] sm:max-w-[300px] mx-auto sm:mx-0 text-center sm:text-left">
                  {productName || 'Product Details'}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ProductDetailHeader;
