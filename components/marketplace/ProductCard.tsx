'use client';

import React, { useState, useEffect } from 'react';
import { Star, Heart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Product {
  name: string;
  current_price: number;
  original_price: number;
  brand: string;
  discount: number;
  rating: number;
  reviews_count: string;
  product_id: string;
  image: string;
  relevance_score?: number;
  url: string;
  currency: string;
  source: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('savedProducts');
    if (saved) {
      const savedProducts = JSON.parse(saved);
      setIsSaved(savedProducts.some((p: any) => p.product_id === product.product_id));
    }
    setIsLoaded(true);
  }, [product.product_id]);

  const toggleSave = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to product detail
    e.stopPropagation(); // Prevent event bubbling

    const saved = localStorage.getItem('savedProducts');
    let savedProducts = saved ? JSON.parse(saved) : [];

    if (isSaved) {
      savedProducts = savedProducts.filter((p: any) => p.product_id !== product.product_id);
    } else {
      savedProducts.push({
        ...product,
        dateAdded: new Date().toISOString()
      });
    }

    localStorage.setItem('savedProducts', JSON.stringify(savedProducts));
    setIsSaved(!isSaved);
  };

  return (
    <Link href={`/marketplace/${product.product_id}`}>
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
            alt={product.name}
            width={400}
            height={400}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2 mb-1">
            {product.name}
          </h3>
          
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.round(product.rating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">({product.reviews_count})</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {product.currency} {product.current_price.toFixed(2)}
            </span>
            {product.discount > 0 && (
              <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                {product.currency} {product.original_price.toFixed(2)}
              </span>
            )}
          </div>

          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">
              {product.source}
            </span>
            <div className="flex items-center gap-2">
              {product.relevance_score !== undefined && (
                <span className="text-xs text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 dark:text-indigo-400 px-2 py-1 rounded">
                  Relevance: {product.relevance_score.toFixed(4)}
                </span>
              )}
              {product.discount > 0 && (
                <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                  {product.discount}% OFF
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={toggleSave}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-emerald-50"
          title={isSaved ? "Remove from wishlist" : "Save to wishlist"}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-emerald-600 text-emerald-600' : 'text-emerald-600 hover:fill-emerald-100'}`} />
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
