'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Heart, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface ProductDetails extends SavedProduct {
  description?: string;
  features?: string[];
  specifications?: Record<string, string>;
}

interface SavedProduct {
  product_id: string;
  name: string;
  current_price: number;
  original_price: number;
  brand: string;
  discount: number;
  rating: number;
  reviews_count: string;
  image: string;
  url: string;
  currency: string;
  source: string;
  dateAdded: string;
}

export default function ProductDetailsPage({ params }: { params: { productId: string } }) {
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        let token;
        if (typeof window !== 'undefined') {
          token = localStorage.getItem('auth_token');
        }
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/${params.productId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetails();
  }, [params.productId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-[#141414] rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white/90 mb-4">Product Not Found</h2>
            <Link href="/wishlist" className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Wishlist
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] p-8">
      <div className="max-w-4xl mx-auto">
        <Link 
          href="/wishlist" 
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Wishlist
        </Link>

        <div className="bg-white dark:bg-[#141414] rounded-lg shadow-sm border border-gray-200 dark:border-[#222] overflow-hidden">
          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Product Image */}
              <div className="w-full md:w-1/3">
                <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-[#1a1a1a]">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Product Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white/90">{product.name}</h1>
                  <a
                    href={product.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="hidden sm:inline">View on {product.source}</span>
                  </a>
                </div>

                <div className="mt-4 space-y-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white/90">
                      {product.currency}{product.current_price}
                    </span>
                    {product.discount > 0 && (
                      <>
                        <span className="text-lg text-gray-500 dark:text-gray-400 line-through">
                          {product.currency}{product.original_price}
                        </span>
                        <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                          {product.discount}% OFF
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-${i < Math.floor(product.rating) ? 'yellow' : 'gray'}-400`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      ({product.reviews_count} reviews)
                    </span>
                  </div>

                  {product.description && (
                    <p className="text-gray-600 dark:text-gray-300">
                      {product.description}
                    </p>
                  )}

                  {product.features && product.features.length > 0 && (
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white/90 mb-2">Key Features</h3>
                      <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                        {product.features.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {product.specifications && Object.keys(product.specifications).length > 0 && (
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white/90 mb-2">Specifications</h3>
                      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                        {Object.entries(product.specifications).map(([key, value]) => (
                          <div key={key} className="flex gap-2">
                            <dt className="text-gray-600 dark:text-gray-400">{key}:</dt>
                            <dd className="text-gray-900 dark:text-white/90">{value}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
