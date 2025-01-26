// components/marketplace/ProductCard.tsx
'use client';

import Image from 'next/image';
import { Star, Scale, ChevronRight, Zap, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCompareProducts } from './compare-store';
// import { ProductResponse } from '@/types'; // Your existing product type

interface ProductResponse {
    name: string;
    current_price: number;
    original_price: number;
    brand: string;
    discount: number;
    rating: number;
    reviews_count: string;
    product_id: string;
    image: string;
    relevance_score: number;
    url: string;
    currency: string;
    source: string;
  }
  
interface ProductCardProps {
  product: ProductResponse;
  compact?: boolean;
}

export function ProductCard({ product, compact = false }: ProductCardProps) {
  const { addToCompare, compareProducts } = useCompareProducts();
  const isComparing = compareProducts.some((p: { product_id: string; }) => p.product_id === product.product_id);
  const maxCompareReached = compareProducts.length >= 4;

  // Rating display calculation
  const fullStars = Math.floor(product.rating);
  const hasHalfStar = product.rating % 1 >= 0.5;

  return (
    <div className={`group relative bg-white dark:bg-gray-900 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 ${compact ? 'w-64' : 'w-full'}`}>
      {/* Compare Button */}
      <div className="absolute top-2 right-2 z-10">
        <Button
          variant="ghost"
          size="sm"
          className={`rounded-full px-3 ${
            isComparing 
              ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400'
              : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
          } transition-colors shadow-sm`}
          onClick={() => !isComparing && addToCompare(product)}
          disabled={isComparing || maxCompareReached}
          aria-label={isComparing ? "Added to comparison" : "Add to comparison"}
        >
          <Scale className="w-4 h-4 mr-1.5" />
          {isComparing ? 'Added' : 'Compare'}
        </Button>
      </div>

      {/* Image Section */}
      <div className="relative aspect-square rounded-t-xl overflow-hidden">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <ShoppingBag className="w-8 h-8 text-gray-400 dark:text-gray-600" />
          </div>
        )}
        
        {/* Discount Badge */}
        {product.discount > 0 && (
          <div className="absolute top-2 left-2 bg-rose-500 text-white px-2 py-1 rounded-md text-xs font-medium">
            {product.discount}% OFF
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-4">
        {/* Brand and Source */}
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
            {product.brand}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
            {product.source}
          </span>
        </div>

        {/* Product Name */}
        <h3 className="font-medium mb-2 line-clamp-2 dark:text-white/90">
          {product.name}
        </h3>

        {/* Price Section */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-gray-900 dark:text-white/90">
            {product.currency}{product.current_price}
          </span>
          {product.original_price > product.current_price && (
            <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
              {product.currency}{product.original_price}
            </span>
          )}
        </div>

        {/* Rating Section */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < fullStars ? 'fill-current' : ''} ${
                  i === fullStars && hasHalfStar ? 'fill-half-star' : ''
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            ({product.reviews_count})
          </span>
        </div>

        {/* View Details Button */}
        {!compact && (
          <Button
            variant="outline"
            className="w-full group-hover:border-emerald-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors"
            asChild
          >
            <a href={product.url} target="_blank" rel="noopener noreferrer">
              View Details
              <ChevronRight className="w-4 h-4 ml-2" />
            </a>
          </Button>
        )}
      </div>

      {/* Hover Price Pulse Effect */}
      {product.discount > 0 && (
        <div className="absolute inset-0 rounded-xl pointer-events-none border-2 border-transparent group-hover:border-emerald-500/30 transition-all duration-300" />
      )}
    </div>
  );
}