'use client';

import React, { useState } from 'react';
import { Star, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Store {
  name: string;
  price: number;
}

interface Product {
  id: number;
  title: string;
  description: string;
  image: string;
  price: number;
  rating: number;
  stores: Store[];
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const lowestPrice = Math.min(...product.stores.map(store => store.price));

  return (
    <div
      className={`relative group bg-white dark:bg-[#141414] rounded-xl border border-gray-200 dark:border-[#222] overflow-hidden transition-all duration-300 ${
        isHovered ? 'shadow-lg' : 'hover:shadow-md'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-[#1a1a1a]">
        <Image
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title and Rating */}
        <div className="mb-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-medium text-gray-900 dark:text-white/90 line-clamp-2">
              {product.title}
            </h3>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm text-gray-600 dark:text-white/60">
                {product.rating}
              </span>
            </div>
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-3">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              ${lowestPrice.toFixed(2)}
            </span>
            {product.stores.length > 1 && (
              <span className="text-sm text-gray-500 dark:text-white/50">
                + {product.stores.length - 1} more stores
              </span>
            )}
          </div>
        </div>

        {/* Store List */}
        <div className="space-y-2">
          {product.stores.slice(0, isHovered ? undefined : 1).map((store) => (
            <div
              key={store.name}
              className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-white/5"
            >
              <span className="text-sm font-medium text-gray-900 dark:text-white/90">
                {store.name}
              </span>
              <span className="text-sm text-gray-600 dark:text-white/60">
                ${store.price.toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* View Details Button */}
        <Link href={`/marketplace/${product.id}`}>
          <button className="w-full mt-4 px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium text-emerald-500 hover:text-emerald-600 rounded-lg border border-emerald-500/20 hover:border-emerald-500/30 bg-emerald-50/50 hover:bg-emerald-50 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 transition-colors">
            View Details
            <ChevronRight className="w-4 h-4" />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
