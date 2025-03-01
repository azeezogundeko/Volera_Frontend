'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Star, Truck, Shield, Package, Award, ChevronRight, ChevronLeft, Check, Bell, ArrowLeft, Store, ExternalLink, Heart, MessageCircle } from 'lucide-react';
import ProductDetailHeader from '@/components/marketplace/ProductDetailHeader';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LoadingPage from '@/components/LoadingPage';
import {Button} from '@/components/ui/button';
import {ProductDetailSidebar} from '@/components/marketplace/productDetailSidebar';
import { ProductDetail } from '../../../utils/types';
import toast, { Toaster } from 'react-hot-toast';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showZoomedImage, setShowZoomedImage] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [targetPrice, setTargetPrice] = useState<string>('');
  const [trackingError, setTrackingError] = useState<string>('');
  const [isSaved, setIsSaved] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/detail/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product details');
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [params.id]);

  useEffect(() => {
    const checkIfSaved = async () => {
      if (product) {
        try {
          if (typeof window !== 'undefined') {
            const token = localStorage.getItem('auth_token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/check-saved`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify( params.id ),
            });

            if (response.ok) {
              const data = await response.json();
              setIsSaved(data.is_saved);
            } else {
              console.error('Failed to check if product is saved');
            }
          }
        } catch (error) {
          console.error('Error checking if product is saved:', error);
        }
      }
    };

    checkIfSaved();
  }, [product, params.id]);

  const handleTrackPrice = async () => {
    if (!targetPrice || isNaN(Number(targetPrice))) {
      setTrackingError('Please enter a valid price');
      return;
    }

    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth_token');
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/track`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          productId: String(params.id),
          targetPrice: Number(targetPrice),
          product: product
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to set price tracking');
      }

      setShowTrackingModal(false);
      setTargetPrice('');
      setTrackingError('');
      
      // Show success toast
      toast.success('Price tracking set! We\'ll notify you when the price drops.', {
        duration: 5000,
        position: 'top-center',
        style: {
          background: 'rgb(34 197 94)',
          color: '#fff',
          padding: '16px',
        },
      });
    } catch (err) {
      setTrackingError('Failed to set price tracking. Please try again.');
    }
  };

  const toggleSave = async () => {
    try {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          toast.error('Please login to save products to wishlist');
          return;
        }

        if (product) {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/save_product`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(product),
          });

          if (response.ok) {
            const data = await response.json();
            setIsSaved(data.is_saved);
            toast.success('Added to wishlist', {
              duration: 3000,
              position: 'top-center',
              style: {
                background: 'rgb(34 197 94)',
                color: '#fff',
                padding: '16px',
              },
            });
          } else {
            const errorData = await response.json();
            toast.error(errorData.message || 'Failed to update wishlist');
          }
        }
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast.error('Failed to update wishlist. Please try again.');
    }
  };


  if (!mounted || loading) {
    return <LoadingPage />;
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-gray-600">{error || 'Product not found'}</p>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % (product.images?.length || 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + (product.images?.length || 1)) % (product.images?.length || 1));
  };

  const images = product?.images || [];
  const currentImage = images[currentImageIndex] || { url: product.image };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
      <Toaster />
      {loading ? (
        <LoadingPage />
      ) : error ? (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      ) : product ? (
        <div className="flex flex-col lg:flex-row w-full">
          <div className="flex-1 p-4 lg:p-8">
            <ProductDetailHeader productName={product?.name} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
                  {/* Product Images */}
                  <div className="space-y-4">
                    <div className="relative aspect-square bg-light-100 dark:bg-dark-100 rounded-lg overflow-hidden">
                      <Image
                        src={currentImage.url || product.image}
                        alt={currentImage.alt || product.name}
                        fill
                        className="object-contain cursor-zoom-in"
                        onClick={() => currentImage.zoom_url && setShowZoomedImage(true)}
                      />
                      {images.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-light-50/80 dark:bg-dark-50/80 rounded-full shadow-lg"
                          >
                            <ChevronLeft className="w-6 h-6 text-gray-900 dark:text-gray-100" />
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-light-50/80 dark:bg-dark-50/80 rounded-full shadow-lg"
                          >
                            <ChevronRight className="w-6 h-6 text-gray-900 dark:text-gray-100" />
                          </button>
                        </>
                      )}
                    </div>
                    
                    {/* Thumbnail Images */}
                    {images.length > 1 && (
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                        {images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`relative aspect-square rounded-md overflow-hidden ${
                              currentImageIndex === index ? 'ring-2 ring-emerald-500 dark:ring-emerald-400' : ''
                            }`}
                          >
                            <Image
                              src={image.url || ''}
                              alt={image.alt || `Product view ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="space-y-4 sm:space-y-6">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{product.name}</h1>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <div className="flex items-center">
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        <span className="ml-1 text-sm text-gray-600 dark:text-gray-300">{product.rating?.toFixed(1)}</span>
                        <span className="ml-1 text-sm text-gray-400 dark:text-gray-500">({product.rating_count} reviews)</span>
                      </div>
                      {product.seller?.name && (
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          Sold by: <span className="font-medium">{product.seller.name}</span>
                          {product.seller.rating && (
                            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                              (Seller rating: {product.seller.rating.toFixed(1)})
                            </span>
                          )}
                          {product.is_official_store && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                              <Award className="w-3 h-3 mr-1" />
                              Official Store
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-baseline gap-2">
                        <span className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                          ₦{new Intl.NumberFormat().format(product.current_price)}
                        </span>
                        {product.discount && product.discount > 0 && (
                          <>
                            <span className="text-base sm:text-lg text-gray-500 dark:text-gray-400 line-through">
                              ₦{product.original_price ? new Intl.NumberFormat().format(product.original_price) : 'N/A'}
                            </span>
                            <span className="text-sm font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900 px-2 py-1 rounded">
                              {product.discount}% OFF
                            </span>
                          </>
                        )}
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-4">
                        {product.source && (
                          <div className="flex items-center text-gray-600 dark:text-gray-300">
                            <Store className="w-4 h-4 mr-1" />
                            <span className="text-sm">{product.source}</span>
                          </div>
                        )}
                        {product.url && (
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                            <a
                              href={`https://${product.url.replace(/^https?:\/\//, '').replace(/^\/+/, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
                            >
                              <ExternalLink className="w-4 h-4 mr-1" />
                              <span className="text-sm">View on {product.source}</span>
                            </a>
                          </div>
                        )}
                        {/* <Link
                          href={`/library?product=${encodeURIComponent(product.name)}&productId=${product.product_id}`}
                          className="flex items-center text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
                        >
                          <MessageCircle className="w-4 h-4 mr-1" />
                          <span className="text-sm">Research & Reviews</span>
                        </Link> */}
                        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                          <button
                            onClick={toggleSave}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-md transition-colors"
                          >
                            <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
                            {isSaved ? 'Saved' : 'Save'}
                          </button>
                          <button
                            onClick={() => {
                              setShowTrackingModal(true);
                            }}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-md transition-colors"
                          >
                            <Bell className="w-4 h-4" />
                            Track Price
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Stock Information */}
                    <div className="space-y-2">
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {product.stock?.in_stock ? (
                          <>
                            <span className="text-green-600 dark:text-green-400 font-medium">In Stock</span>
                            {product.stock.quantity && product.stock.quantity_sold && (
                              <span className="ml-2">
                                ({product.stock.quantity} available • {product.stock.quantity_sold} sold)
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-red-600 dark:text-red-400 font-medium">Out of Stock</span>
                        )}
                      </div>
                    </div>

                    {/* Specifications */}
                    {product.specifications && product.specifications.length > 0 && (
                      <div className="border-t pt-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Specifications</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {product.specifications.map((spec: { label: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; value: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; }, index: React.Key | null | undefined) => (
                            <div key={index} className="flex flex-col">
                              <span className="text-sm text-gray-500 dark:text-gray-400">{spec.label}</span>
                              <span className="text-gray-900 dark:text-gray-100">{spec.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Features */}
                    {product.features && product.features.length > 0 && (
                      <div className="border-t pt-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Key Features</h2>
                        <ul className="space-y-2">
                          {product.features.map((feature, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                              <Check className="w-4 h-4 text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Description */}
                    {product.description && (
                      <div className="border-t pt-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Description</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line">{product.description}</p>
                      </div>
                    )}

                    {/* Reviews */}
                    {product.reviews && product.reviews.length > 0 && (
                      <div className="border-t pt-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Customer Reviews</h2>
                        <div className="space-y-6">
                          {product.reviews.map((review, index) => (
                            <div key={index} className="border-b pb-6 last:border-b-0 last:pb-0">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-4 h-4 ${
                                          i < (review.rating || 0)
                                            ? 'text-yellow-400 dark:text-yellow-300 fill-yellow-400 dark:fill-yellow-300'
                                            : 'text-gray-300 dark:text-gray-500'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  {review.verified && (
                                    <span className="text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900 px-2 py-0.5 rounded">
                                      Verified Purchase
                                    </span>
                                  )}
                                </div>
                                {review.date && (
                                  <span className="text-sm text-gray-500 dark:text-gray-400">{review.date}</span>
                                )}
                              </div>
                              {review.title && (
                                <h3 className="font-medium text-gray-900 dark:text-gray-100">{review.title}</h3>
                              )}
                              {review.author && (
                                <p className="text-sm text-gray-500 dark:text-gray-400">By {review.author}</p>
                              )}
                              {review.comment && (
                                <p className="text-sm text-gray-600 dark:text-gray-300">{review.comment}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Price Tracking Modal */}
                {showTrackingModal && (
                  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                    <div className="bg-white dark:bg-dark-50 rounded-lg p-6 max-w-md w-full mx-4">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Track Price</h2>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                        We&apos;ll notify you when the price drops below your target price.
                      </p>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="targetPrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Target Price
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">₦</span>
                            <input
                              type="number"
                              id="targetPrice"
                              value={targetPrice}
                              onChange={(e) => {
                                const value = e.target.value;
                                // Allow user to decrease or clear the input
                                if (value === '' || Number(value) <= product.current_price) {
                                  setTargetPrice(value);
                                }
                              }}
                              className="block w-full pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-emerald-500 dark:focus:border-emerald-400 bg-white dark:bg-dark-100 text-gray-900 dark:text-gray-100"
                              placeholder="Enter your target price"
                              min="0"
                              step="0.01"
                            />
                          </div>
                          {trackingError && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{trackingError}</p>
                          )}
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={handleTrackPrice}
                            className="flex-1 bg-emerald-600 dark:bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-colors"
                          >
                            Set Alert
                          </button>
                          <button
                            onClick={() => {
                              setShowTrackingModal(false);
                              setTargetPrice('');
                              setTrackingError('');
                            }}
                            className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Zoomed Image Modal */}
                {showZoomedImage && currentImage.zoom_url && (
                  <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
                    <div className="relative w-full h-full">
                      <Image
                        src={currentImage.zoom_url}
                        alt={currentImage.alt || product.name}
                        fill
                        className="object-contain"
                      />
                      <button
                        className="absolute top-4 right-4 text-white dark:text-gray-300 hover:text-gray-300 dark:hover:text-gray-100"
                        onClick={() => setShowZoomedImage(false)}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </main>

            {/* Chat Button - Only visible on mobile */}
            <div className="fixed lg:hidden right-4 bottom-4 z-40">
              <Button
                onClick={() => setIsSidebarOpen(true)}
                className="h-12 w-12 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg"
              >
                <MessageCircle className="h-6 w-6" />
              </Button>
            </div>
          </div>

          {/* Product Detail Sidebar */}
          <div className="hidden lg:block w-[350px] shrink-0">
            <ProductDetailSidebar
              product= { product }
              isOpen={true}
              onClose={() => setIsSidebarOpen(false)}
            />
          </div>

          {/* Mobile Sidebar */}
          <div className="lg:hidden">
            <ProductDetailSidebar
              product= {product}
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
