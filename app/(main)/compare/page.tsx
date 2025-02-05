'use client';

import { useState, useEffect, useRef, Key } from 'react';
import { Plus, X, ArrowLeft, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ProductDetail } from '../../utils/types'; 
import ChatSidebar from '@/components/chat/ChatSidebar';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import process from 'process';
import { useApi } from '@/lib/hooks/useApi';

interface Specification {
  label: string;
  value: string | number;
}

export default function ComparePage() {
  const { fetchWithAuth } = useApi();
  const [products, setProducts] = useState<ProductDetail[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const prevProductsRef = useRef<ProductDetail[]>([]);
  
  useEffect(() => {
    const fetchCompareData = async () => {
      try {
        const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/compare/data`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch compare data:', error);
      }
    };

    fetchCompareData();
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsChatVisible(false);
    const handleInteraction = () => setIsChatVisible(true);

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleInteraction);

    const timer = setTimeout(() => {
      setIsChatVisible(false);
    }, 3000); // Hide after 3 seconds

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleInteraction);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('auth_token');
        const productDetailsPromises = products.map(product => 
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/detail/${product.product_id}`,
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          ).then(res => res.json())
        );
        const fullProductDetails = await Promise.all(productDetailsPromises);
        console.log(fullProductDetails);

        if (JSON.stringify(fullProductDetails) !== JSON.stringify(products)) {
          setProducts(fullProductDetails);
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (products.length > 0 && JSON.stringify(prevProductsRef.current) !== JSON.stringify(products)) {
      fetchProductDetails();
      prevProductsRef.current = products; // Update ref to current products
    }
  }, [products]);

  const removeProduct = (productId: string) => {
    const updatedProducts = products.filter(p => p.product_id !== productId);
    setProducts(updatedProducts);
    localStorage.setItem('compareProducts', JSON.stringify(updatedProducts));
  };

  const addProduct = () => {
    router.push('/marketplace');
  };

  // Get all unique specification keys
  return (
    <div className="min-h-screen bg-white dark:bg-[#141414] overflow-x-hidden">
      {/* Header */}
      <header className="top-0 left-0 right-0 z-30 bg-white dark:bg-[#141414] border-b border-gray-200 dark:border-[#222] py-4">
        <div className="max-w-[90rem] mx-auto px-2 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Adjusted left side div with min-w-0 and increased space-x */}
            <div className="flex items-center space-x-1 sm:space-x-5 min-w-0 ml-4">
              <button
                onClick={() => router.back()}
                className="p-1 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <h1 className="text-sm sm:text-xl font-semibold text-gray-900 dark:text-gray-100 truncate">
                Compare Products
              </h1>
            </div>
            {/* Rest of the header code remains unchanged */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {products.length < 4 && (
                <button
                  onClick={addProduct}
                  className="flex items-center space-x-1 sm:space-x-2 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white rounded-lg transition-colors text-xs sm:text-sm font-medium"
                >
                  <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Add</span>
                </button>
              )}
              <button
                onClick={() => setIsChatOpen(!isChatOpen)}
                className="p-1 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors hidden lg:inline-block"
              >
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content with padding for fixed header */}
      <div className="pt-10 sm:pt-16">
        <div className="flex max-w-[90rem] mx-auto relative">
          {/* Main Content */}
          <main className="flex-1 px-2 sm:px-6 lg:pr-[22rem] lg:pl-8 py-3 sm:py-8">
            {/* Loading State */}
            {isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-8">
                {[1, 2, 3].map((index) => (
                  <div key={index} className="bg-white dark:bg-[#141414] rounded-xl border border-gray-200 dark:border-[#222] shadow-sm overflow-hidden">
                    {/* Image Skeleton */}
                    <div className="relative h-48 sm:h-44 lg:h-48 w-full bg-gray-100 dark:bg-[#1a1a1a] animate-pulse"></div>
                    
                    {/* Content Skeleton */}
                    <div className="p-2.5 sm:p-4">
                      <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                        {/* Store Logo Skeleton */}
                        <div className="h-5 w-5 sm:h-6 sm:w-6 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                        {/* Rating Skeleton */}
                        <div className="w-12 h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                      </div>
                      {/* Title Skeleton */}
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded mb-2 animate-pulse"></div>
                      <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-800 rounded mb-2 animate-pulse"></div>
                      {/* Price Skeleton */}
                      <div className="h-6 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Product Cards */}
            {!isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-8">
                {products.map((product) => (
                  <div
                    key={product.product_id}
                    onClick={() => router.push(`/marketplace/${product.product_id}`)}
                    className="cursor-pointer"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white dark:bg-[#141414] rounded-xl border border-gray-200 dark:border-[#222] shadow-sm overflow-hidden"
                    >
                      <div className="relative">
                        <button
                          onClick={() => removeProduct(product.product_id)}
                          className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 p-1 sm:p-1.5 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors z-10"
                        >
                          <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                        <div className="relative h-48 sm:h-44 lg:h-48 w-full bg-gray-100 dark:bg-[#1a1a1a]">
                        <Image
                            src={product.images && product.images.length > 0 ? product.images[0].url : '/placeholder-product.png'}
                            alt={product.name || 'Product Image'}
                            fill
                            className="object-contain rounded-t-lg p-3 sm:p-4"
                            onError={(e) => {
                              const img = e.target as HTMLImageElement;
                              img.src = '/placeholder-product.png';
                            }}
                          />
                        </div>
                      </div>
                      <div className="p-2.5 sm:p-4">
                        <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                          <div className="relative h-5 w-5 sm:h-6 sm:w-6">
                            {product.seller?.name && (
                              <Image
                                src="/placeholder-store-logo.png"
                                alt={product.seller.name}
                                fill
                                className="object-contain rounded"
                                onError={(e) => {
                                  const img = e.target as HTMLImageElement;
                                  img.src = '/placeholder-store-logo.png';
                                }}
                              />
                            )}
                          </div>
                          <div className="flex items-center">
                            <span className="text-yellow-400">★</span>
                            <span className="ml-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                              {product.rating ? product.rating.toFixed(1) : '-'}
                            </span>
                          </div>
                        </div>
                        <h3 className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100 mb-1.5 sm:mb-2 line-clamp-2 min-h-[2.5em] sm:min-h-[2.75em]">
                          {product.name}
                        </h3>
                        <p className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {product.currency}{product.current_price?.toLocaleString() || '-'}
                        </p>
                        {/* <ul>
                          {product.specifications?.map((spec: Specification, index: Key | null | undefined) => (
                            <li key={index}>
                              <strong>{spec.label}:</strong> {spec.value}
                            </li>
                          ))}
                        </ul> */}
                      </div>
                    </motion.div>
                  </div>
                ))}
              </div>
            )}

            {/* Comparison Table */}
            {products.length > 0 && (
              <div className="mt-6 sm:mt-12">
                <h2 className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-6">
                  Product Comparison
                </h2>
                <div className="overflow-x-auto -mx-2 sm:mx-0 pb-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
                  <div className="inline-block min-w-full align-middle">
                    <table className="w-full border-collapse">
                      <tbody className="divide-y divide-gray-200 dark:divide-[#222]">
                        {/* Basic Information */}
                        <tr className="border-b border-gray-200 dark:border-[#222]">
                          <td className="py-2 sm:py-4 px-2 sm:px-4 text-[11px] sm:text-sm font-medium text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-[#1a1a1a] sticky left-0 min-w-[90px] sm:min-w-[120px]">
                            Brand
                          </td>
                          {products.map((product) => (
                            <td key={product.product_id} className="py-2 sm:py-4 px-2 sm:px-4 text-[11px] sm:text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-[#141414]">
                              {product.brand || '-'}
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b border-gray-200 dark:border-[#222]">
                          <td className="py-2 sm:py-4 px-2 sm:px-4 text-[11px] sm:text-sm font-medium text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-[#1a1a1a] sticky left-0 min-w-[90px] sm:min-w-[120px]">
                            Category
                          </td>
                          {products.map((product) => (
                            <td key={product.product_id} className="py-2 sm:py-4 px-2 sm:px-4 text-[11px] sm:text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-[#141414]">
                              {product.category || '-'}
                            </td>
                          ))}
                        </tr>

                        {/* Price & Rating */}
                        <tr className="border-b border-gray-200 dark:border-[#222]">
                          <td className="py-2 sm:py-4 px-2 sm:px-4 text-[11px] sm:text-sm font-medium text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-[#1a1a1a] sticky left-0 min-w-[90px] sm:min-w-[120px]">
                            Price
                          </td>
                          {products.map((product) => (
                            <td key={product.product_id} className="py-2 sm:py-4 px-2 sm:px-4 text-[11px] sm:text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-[#141414]">
                              <div className="space-y-1">
                                <div className="font-medium">{`${product.currency}${product.current_price.toLocaleString()}`}</div>
                                {product.discount && (
                                  <div className="text-[11px] text-green-600 dark:text-green-400">
                                    {product.discount}% OFF
                                  </div>
                                )}
                              </div>
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b border-gray-200 dark:border-[#222]">
                          <td className="py-2 sm:py-4 px-2 sm:px-4 text-[11px] sm:text-sm font-medium text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-[#1a1a1a] sticky left-0 min-w-[90px] sm:min-w-[120px]">
                            Rating
                          </td>
                          {products.map((product) => (
                            <td key={product.product_id} className="py-2 sm:py-4 px-2 sm:px-4 text-[11px] sm:text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-[#141414]">
                              <div className="flex items-center space-x-1">
                                <span className="text-yellow-400">★</span>
                                <span>{product.rating ? product.rating.toFixed(1) : '-'}</span>
                                {product.rating_count && (
                                  <span className="text-gray-400">({product.rating_count})</span>
                                )}
                              </div>
                            </td>
                          ))}
                        </tr>

                        {/* Seller & Shipping */}
                        <tr className="border-b border-gray-200 dark:border-[#222]">
                          <td className="py-2 sm:py-4 px-2 sm:px-4 text-[11px] sm:text-sm font-medium text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-[#1a1a1a] sticky left-0 min-w-[90px] sm:min-w-[120px]">
                            Seller
                          </td>
                          {products.map((product) => (
                            <td key={product.product_id} className="py-2 sm:py-4 px-2 sm:px-4 text-[11px] sm:text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-[#141414]">
                              <div className="flex items-center space-x-2">
                                <div className="relative h-5 w-5 sm:h-6 sm:w-6">
                                  {product.seller?.name && (
                                    <Image
                                      src="/placeholder-store-logo.png"
                                      alt={product.seller.name}
                                      fill
                                      className="object-contain rounded"
                                      onError={(e) => {
                                        const img = e.target as HTMLImageElement;
                                        img.src = '/placeholder-store-logo.png';
                                      }}
                                    />
                                  )}
                                </div>
                                <span>{product.seller?.name || '-'}</span>
                                {product.is_official_store && (
                                  <span className="text-[11px] text-blue-600 dark:text-blue-400">(Official Store)</span>
                                )}
                              </div>
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b border-gray-200 dark:border-[#222]">
                          <td className="py-2 sm:py-4 px-2 sm:px-4 text-[11px] sm:text-sm font-medium text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-[#1a1a1a] sticky left-0 min-w-[90px] sm:min-w-[120px]">
                            Shipping
                          </td>
                          {products.map((product) => (
                            <td key={product.product_id} className="py-2 sm:py-4 px-2 sm:px-4 text-[11px] sm:text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-[#141414]">
                              <div className="space-y-1">
                                {product.is_free_shipping && (
                                  <div className="text-green-600 dark:text-green-400">Free Shipping</div>
                                )}
                                {product.express_delivery && (
                                  <div>Express Delivery Available</div>
                                )}
                              </div>
                            </td>
                          ))}
                        </tr>

                        {/* Key Features */}
                        <tr className="border-b border-gray-200 dark:border-[#222]">
                          <td className="py-2 sm:py-4 px-2 sm:px-4 text-[11px] sm:text-sm font-medium text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-[#1a1a1a] sticky left-0 min-w-[90px] sm:min-w-[120px]">
                            Key Features
                          </td>
                          {products.map((product) => (
                            <td key={product.product_id} className="py-2 sm:py-4 px-2 sm:px-4 text-[11px] sm:text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-[#141414]">
                              {product.features?.length ? (
                                <ul className="list-disc list-inside space-y-1">
                                  {product.features.map((feature, index) => (
                                    <li key={index}>{feature}</li>
                                  ))}
                                </ul>
                              ) : (
                                '-'
                              )}
                            </td>
                          ))}
                        </tr>

                        {/* Important Specifications */}
                        <tr className="border-b border-gray-200 dark:border-[#222]">
                          <td className="py-2 sm:py-4 px-2 sm:px-4 text-[11px] sm:text-sm font-medium text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-[#1a1a1a] sticky left-0 min-w-[90px] sm:min-w-[120px]">
                            Specifications
                          </td>
                          {products.map((product) => (
                            <td key={product.product_id} className="py-2 sm:py-4 px-2 sm:px-4 text-[11px] sm:text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-[#141414]">
                              <ul>
                                {product.specifications?.map((spec: Specification, index: Key | null | undefined) => (
                                  <li key={index}>
                                    <strong>{spec.label}:</strong> {spec.value}
                                  </li>
                                ))}
                              </ul>
                            </td>
                          ))}
                        </tr>

                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Empty State */}
            {products.length === 0 && (
              <div className="text-center py-8 sm:py-12">
                <div className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400 dark:text-gray-600">
                  <Plus className="h-full w-full" />
                </div>
                <h3 className="mt-2 text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100">
                  No products to compare
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  Add products from the marketplace to start comparing
                </p>
                <div className="mt-4 sm:mt-6">
                  <Link
                    href="/marketplace"
                    className="inline-flex items-center px-3.5 sm:px-4 py-1.5 sm:py-2 border border-transparent text-xs sm:text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 transition-colors"
                  >
                    Go to Marketplace
                  </Link>
                </div>
              </div>
            )}
          </main>

          {/* Chat Sidebar */}
          <div className={cn(
            "w-full sm:w-80 border-l border-gray-200 dark:border-[#222] bg-white dark:bg-[#141414]",
            "fixed right-0 top-0 h-screen z-40",
            !isChatOpen && "translate-x-full lg:translate-x-0",
            "transition-transform duration-300 ease-in-out"
          )}>
            <ChatSidebar isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} products={products} />
          </div>

          {/* Mobile Chat Button */}
          <div className={cn(
            "fixed lg:hidden right-4 bottom-4 z-40",
            isChatVisible && !isChatOpen ? "block" : "hidden"
          )}>
            <Button
              onClick={() => setIsChatOpen(true)}
              size="icon"
              variant="default"
              className="h-12 w-12 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg"
            >
              <MessageCircle className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
