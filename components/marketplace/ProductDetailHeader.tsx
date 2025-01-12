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
    <header className="bg-white shadow-sm sticky top-0 z-30">
      <div className="max-w-7xl mx-auto">
        <div className="border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <Link href="/marketplace" className="text-gray-600 hover:text-gray-900">
                Marketplace
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium truncate max-w-[300px]">
                {productName || 'Product Details'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ProductDetailHeader;
