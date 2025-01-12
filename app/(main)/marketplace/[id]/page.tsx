'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Star, Truck, Shield, Package, Award, ChevronRight, ChevronLeft, Check, Bell, ArrowLeft, Store, ExternalLink, Heart } from 'lucide-react';
import ProductDetailHeader from '@/components/marketplace/ProductDetailHeader';
import { useRouter } from 'next/navigation';

interface ProductImage {
  url: string;
  zoom_url?: string;
  alt?: string;
}

interface Seller {
  name?: string;
  rating?: number;
}

interface Specification {
  label?: string;
  value?: string;
}

interface Review {
  rating?: number;
  title?: string;
  comment?: string;
  date?: string;
  author?: string;
  verified?: boolean;
}

interface Stock {
  in_stock?: boolean;
  quantity?: number;
  quantity_sold?: number;
  min_sale_qty?: number;
  max_sale_qty?: number;
}

interface ProductDetail {
  name: string;
  brand?: string;
  category?: string;
  currency: string;
  description?: string;
  current_price: number;
  original_price?: number;
  discount?: number;
  url: string;
  image: string;
  images?: ProductImage[];
  source?: string;
  rating?: number;
  rating_count?: number;
  seller?: Seller;
  specifications?: Specification[];
  features?: string[];
  reviews?: Review[];
  stock?: Stock;
  is_free_shipping?: boolean;
  is_pay_on_delivery?: boolean;
  express_delivery?: boolean;
  is_official_store?: boolean;
  product_id: string;
}

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
  const [isSaved, setIsSaved] = useState(() => {
    if (typeof window !== 'undefined' && product) {
      const saved = localStorage.getItem('savedProducts');
      if (saved) {
        const savedProducts = JSON.parse(saved);
        return savedProducts.some((p: any) => p.product_id === product.product_id);
      }
    }
    return false;
  });

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
    if (product) {
      // Update saved state when product changes
      const saved = localStorage.getItem('savedProducts');
      if (saved) {
        const savedProducts = JSON.parse(saved);
        setIsSaved(savedProducts.some((p: any) => p.product_id === product.product_id));
      }
    }
  }, [product]);

  const handleTrackPrice = async () => {
    if (!targetPrice || isNaN(Number(targetPrice))) {
      setTrackingError('Please enter a valid price');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: params.id,
          targetPrice: Number(targetPrice),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to set price tracking');
      }

      setShowTrackingModal(false);
      setTargetPrice('');
      setTrackingError('');
      // You might want to show a success message here
    } catch (err) {
      setTrackingError('Failed to set price tracking. Please try again.');
    }
  };

  const toggleSave = () => {
    if (!product) return;

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
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

  const currentImage = product.images?.[currentImageIndex] || { url: product.image };

  return (
    <div className="min-h-screen bg-gray-50">
      <ProductDetailHeader productName={product?.name} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={currentImage.url || product.image}
                  alt={currentImage.alt || product.name}
                  fill
                  className="object-contain cursor-zoom-in"
                  onClick={() => currentImage.zoom_url && setShowZoomedImage(true)}
                />
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-lg"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-lg"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>
              
              {/* Thumbnail Images */}
              {product.images?.length > 1 && (
                <div className="grid grid-cols-6 gap-2">
                  {product.images?.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative aspect-square rounded-md overflow-hidden ${
                        currentImageIndex === index ? 'ring-2 ring-blue-500' : ''
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
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="ml-1 text-sm text-gray-600">{product.rating?.toFixed(1)}</span>
                  <span className="ml-1 text-sm text-gray-400">({product.rating_count} reviews)</span>
                </div>
                {product.seller?.name && (
                  <div className="text-sm text-gray-600">
                    Sold by: <span className="font-medium">{product.seller.name}</span>
                    {product.seller.rating && (
                      <span className="ml-2 text-sm text-gray-500">
                        (Seller rating: {product.seller.rating.toFixed(1)})
                      </span>
                    )}
                    {product.is_official_store && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        <Award className="w-3 h-3 mr-1" />
                        Official Store
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-900">
                    ₦{product.current_price.toFixed(2)}
                  </span>
                  {product.discount && product.discount > 0 && (
                    <>
                      <span className="text-lg text-gray-500 line-through">
                        ₦{product.original_price?.toFixed(2)}
                      </span>
                      <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                        {product.discount}% OFF
                      </span>
                    </>
                  )}
                  <div className="ml-auto flex items-center gap-3">
                    {product.source && (
                      <div className="flex items-center text-gray-600">
                        <Store className="w-4 h-4 mr-1" />
                        <span className="text-sm">{product.source}</span>
                      </div>
                    )}
                    {product.url && (
                      <a
                        href={product.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-emerald-600 hover:text-emerald-700"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        <span className="text-sm">Visit Website</span>
                      </a>
                    )}
                    <button
                      onClick={toggleSave}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors"
                    >
                      <Heart className={isSaved ? 'fill-emerald-600' : ''} />
                      {isSaved ? 'Saved' : 'Save to Wishlist'}
                    </button>
                    <button
                      onClick={() => setShowTrackingModal(true)}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors"
                    >
                      <Bell className="w-4 h-4" />
                      Track Price
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4 pt-4">
                  {product.is_free_shipping && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Truck className="w-4 h-4 mr-1" />
                      Free Shipping
                    </div>
                  )}
                  {product.is_pay_on_delivery && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Package className="w-4 h-4 mr-1" />
                      Pay on Delivery
                    </div>
                  )}
                  {product.express_delivery && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Shield className="w-4 h-4 mr-1" />
                      Express Delivery
                    </div>
                  )}
                </div>
              </div>

              {/* Stock Information */}
              <div className="space-y-2">
                <div className="text-sm text-gray-600">
                  {product.stock?.in_stock ? (
                    <>
                      <span className="text-green-600 font-medium">In Stock</span>
                      {product.stock.quantity && product.stock.quantity_sold && (
                        <span className="ml-2">
                          ({product.stock.quantity} available • {product.stock.quantity_sold} sold)
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-red-600 font-medium">Out of Stock</span>
                  )}
                </div>
              </div>

              {/* Specifications */}
              {product.specifications && product.specifications.length > 0 && (
                <div className="border-t pt-6">
                  <h2 className="text-lg font-semibold mb-4">Specifications</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {product.specifications.map((spec, index) => (
                      <div key={index} className="flex flex-col">
                        <span className="text-sm text-gray-500">{spec.label}</span>
                        <span className="text-gray-900">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Features */}
              {product.features && product.features.length > 0 && (
                <div className="border-t pt-6">
                  <h2 className="text-lg font-semibold mb-4">Key Features</h2>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Description */}
              {product.description && (
                <div className="border-t pt-6">
                  <h2 className="text-lg font-semibold mb-4">Description</h2>
                  <p className="text-sm text-gray-600 whitespace-pre-line">{product.description}</p>
                </div>
              )}

              {/* Reviews */}
              {product.reviews && product.reviews.length > 0 && (
                <div className="border-t pt-6">
                  <h2 className="text-lg font-semibold mb-4">Customer Reviews</h2>
                  <div className="space-y-6">
                    {product.reviews.map((review, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < (review.rating || 0)
                                      ? 'text-yellow-400 fill-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            {review.verified && (
                              <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">
                                Verified Purchase
                              </span>
                            )}
                          </div>
                          {review.date && (
                            <span className="text-sm text-gray-500">{review.date}</span>
                          )}
                        </div>
                        {review.title && (
                          <h3 className="font-medium text-gray-900">{review.title}</h3>
                        )}
                        {review.author && (
                          <p className="text-sm text-gray-500">By {review.author}</p>
                        )}
                        {review.comment && (
                          <p className="text-sm text-gray-600">{review.comment}</p>
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
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h2 className="text-xl font-semibold mb-4">Track Price</h2>
                <p className="text-sm text-gray-600 mb-4">
                  We'll notify you when the price drops below your target price.
                </p>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="targetPrice" className="block text-sm font-medium text-gray-700 mb-1">
                      Target Price
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₦</span>
                      <input
                        type="number"
                        id="targetPrice"
                        value={targetPrice}
                        onChange={(e) => {
                          setTargetPrice(e.target.value);
                          setTrackingError('');
                        }}
                        className="block w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="Enter your target price"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    {trackingError && (
                      <p className="mt-1 text-sm text-red-600">{trackingError}</p>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleTrackPrice}
                      className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors"
                    >
                      Set Alert
                    </button>
                    <button
                      onClick={() => {
                        setShowTrackingModal(false);
                        setTargetPrice('');
                        setTrackingError('');
                      }}
                      className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
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
            <div
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
              onClick={() => setShowZoomedImage(false)}
            >
              <div className="relative w-full h-full max-w-4xl max-h-4xl p-4">
                <Image
                  src={currentImage.zoom_url}
                  alt={currentImage.alt || product.name}
                  fill
                  className="object-contain"
                />
                <button
                  className="absolute top-4 right-4 text-white hover:text-gray-300"
                  onClick={() => setShowZoomedImage(false)}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
