'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import SearchBar from '@/components/marketplace/SearchBar';
import ProductCard from '@/components/marketplace/ProductCard';
import { MarketplaceSidebar } from '@/components/marketplace/rightSidebar';
import { Store, Zap, Tag, TrendingUp, Star, Clock, Flame, MessageCircle, XCircle, Filter } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useApi } from '@/lib/hooks/useApi';

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

export default function MarketplacePage() {
  const [isClient, setIsClient] = useState(false);
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [lastSearchQuery, setLastSearchQuery] = useState<string>('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [clearToggle, setClearToggle] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [searchParams, setSearchParams] = useState({});
  const [notificationVisible, setNotificationVisible] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [comparisonProducts, setComparisonProducts] = useState<ProductResponse[]>([]);
  const [remainingProducts, setRemainingProducts] = useState<ProductResponse[]>([]);
  const { fetchWithAuth } = useApi();

  useEffect(() => {
    // Ensure this only runs on the client
    if (typeof window !== 'undefined') {
      setIsClient(true);
      setMounted(true);

      // Initialize lastSearchQuery from localStorage
      const savedQuery = localStorage.getItem('lastSearchQuery') || '';
      setLastSearchQuery(savedQuery);
      
      // Try to get cached results
      const cached = localStorage.getItem('searchResults');
      if (cached) {
        try {
          const parsedProducts = JSON.parse(cached);
          setProducts(parsedProducts);
        } catch (e) {
          console.error('Error parsing cached search results:', e);
        }
      }

      // Check dark mode preference
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDarkMode);

      // Handle notification timeout
      const timer = setTimeout(() => {
        setNotificationVisible(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, []);

  // Persist products to localStorage
  useEffect(() => {
    if (isClient && products.length > 0) {
      localStorage.setItem('searchResults', JSON.stringify(products));
    }
  }, [products, isClient]);

  // Handle notification timeout
  useEffect(() => {
    if (mounted) {
      const timer = setTimeout(() => {
        setNotificationVisible(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [mounted]);

  // Handle product categorization
  useEffect(() => {
    if (isClient && products.length > 0) {
      const sources = new Set<string>();
      const comparisons: ProductResponse[] = [];
      const remaining: ProductResponse[] = [];

      products
        .filter(product => product.current_price > 0)
        .forEach(product => {
          if (!sources.has(product.source) && comparisons.length < 4) {
            comparisons.push(product);
            sources.add(product.source);
          } else {
            remaining.push(product);
          }
        });

      setComparisonProducts(comparisons);
      setRemainingProducts(remaining);
    }
  }, [products, isClient]);

  useEffect(() => {
    if (filters.filteredProducts && Array.isArray(filters.filteredProducts)) {
      console.log('Processing filtered products from filters:', filters.filteredProducts);
      
      // Update products based on filtered products
      setProducts(prevProducts => {
        // Check if products are actually different
        const areProductsEqual = prevProducts.length === filters.filteredProducts.length && 
          prevProducts.every((product, index) => 
            product.product_id === filters.filteredProducts[index].product_id
          );
        
        if (areProductsEqual) {
          console.log('Products are the same, skipping update');
          return prevProducts;
        }
        
        // Remove filteredProducts from filters to keep state clean
        const { filteredProducts, ...restFilters } = filters;
        setFilters(restFilters);
        
        return filters.filteredProducts;
      });
    }
  }, [filters]);

  const handleSearchStart = (query: string) => {
    setIsSearching(true);
    setSearchError(null);
    setProducts([]);
    if (typeof window !== 'undefined') {
      setLastSearchQuery(query);
      localStorage.setItem('lastSearchQuery', query);
    }
    setIsSearching(false);
  };

  const handleSearchComplete = (products: ProductResponse[] | null, error?: string): void => {
    if (error) {
      setSearchError(error);
      setProducts([]);
    } else if (products) {
      localStorage.setItem('searchResults', JSON.stringify(products));
      setProducts(products);
    }
    setIsSearching(false);
  };

  const handleFiltersUpdate = (newFilters: Record<string, any>) => {
    console.log('Received filters update:', newFilters);
    
    // Safely update filters without causing re-render issues
    setFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters
    }));
    
    setIsMobileFiltersOpen(false);
    
    // If we received filtered products from the WebSocket response, they will be processed in the useEffect
    if (newFilters.filteredProducts && Array.isArray(newFilters.filteredProducts)) {
      console.log('Filtered products received, will be processed in useEffect');
    } else {
      // Otherwise, apply filters to current products
      console.log('Applying filters to existing products:', newFilters);
      let filteredProducts = [...products];
      
      if (newFilters.maxPrice) {
        filteredProducts = filteredProducts.filter(p => p.current_price <= newFilters.maxPrice);
      }
      
      if (newFilters.minRating) {
        filteredProducts = filteredProducts.filter(p => p.rating >= newFilters.minRating);
      }
      
      // Update products with filtered results
      setProducts(filteredProducts);
    }
  };

  const clearSearchResults = () => {
    console.log('Before clearing:', products); 
    console.log('Local Storage before clearing:', localStorage.getItem('searchResults')); 
  
    setProducts([]); // Clear products
    if (typeof window !== 'undefined') {
      setLastSearchQuery('');
      localStorage.removeItem('searchResults');
      localStorage.removeItem('lastSearchQuery');
      localStorage.removeItem('savedProducts');
    }
    
    setClearToggle(prev => !prev); // Trigger re-render

    console.log('After clearing:', products); 
    console.log('Local Storage after clearing:', localStorage.getItem('searchResults')); 
  };

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loading) {
      return;
    }
    setPage(prev => prev + 1);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loading]);

  const handleImageSearch = (file: File) => {
    console.log('Image search with:', file);
  };

  const renderProductSection = (title: string, icon: React.ReactNode, products: any[], subtitle?: string) => mounted && (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {icon}
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white/90">{title}</h2>
          </div>
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-white/50">{subtitle}</p>
          )}
        </div>
        <button className="text-sm text-emerald-500 hover:text-emerald-600 font-medium">
          View all
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.slice(0, 4).map((product, index) => (
          <ProductCard key={`${product.product_id}-${index}`} product={product} />
        ))}
      </div>
    </section>
  );

  // const fetchData = async () => {
  //   try {
  //     const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/marketplace/products`);
  //     const data = await response.json();
  //     // Handle the data...
  //   } catch (error) {
  //     // Error handling is already done by useApi
  //     console.error('Failed to fetch marketplace data:', error);
  //   }
  // };

  // useEffect(() => {
  //   fetchData();
  // }, []);

  // Only render client-side content
  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#111111] relative">
      <div className="max-w-full w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:pr-[400px] transition-all duration-300">
        {/* Header */}
        <div className="flex flex-col gap-6 sm:gap-8 mb-8 sm:mb-12">
          {/* Title Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
            <div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                <h1 className="text-2xl sm:text-3xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-white/70 text-transparent bg-clip-text">
                  Marketplace
                </h1>
                <div className="px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <span className="text-xs sm:text-sm text-emerald-500">
                    {mounted ? `${products.length.toLocaleString()} products` : ''}
                  </span>
                </div>
              </div>
              <p className="text-sm sm:text-base text-gray-500 dark:text-white/50">
                Discover and compare products across multiple stores
              </p>
            </div>

            {/* Quick Stats */}
            {mounted && (
              <div className="grid grid-cols-3 sm:flex items-center gap-3 sm:gap-6 mt-4 sm:mt-0">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Store className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white/90">
                      5+ Stores
                    </div>
                    <div className="text-[10px] sm:text-xs text-gray-500 dark:text-white/50">
                      Best prices
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-500" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white/90">
                      AI-Powered
                    </div>
                    <div className="text-[10px] sm:text-xs text-gray-500 dark:text-white/50">
                      Smart search
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                    <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white/90">
                      Best Deals
                    </div>
                    <div className="text-[10px] sm:text-xs text-gray-500 dark:text-white/50">
                      Daily updates
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Search Section */}
          <div className="relative">
            {/* Content */}
            <div className="relative py-3">
              <div className="flex flex-col flex-1 gap-6">
                {notificationVisible && (
                  <div className="bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4 shadow-sm transition-all">
                    <div className="flex items-center gap-2">
                      <div className="flex-shrink-0">
                        <MessageCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <p className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">
                        For state-of-the-art product search, try the Product Hunt Agent on chat assistant.
                      </p>
                    </div>
                  </div>
                )}
                
                <SearchBar 
                  onSearch={handleSearchComplete}
                  onSearchStart={handleSearchStart}
                  onImageSearch={handleImageSearch}
                  initialQuery={lastSearchQuery}
                />
                
                {mounted && lastSearchQuery && products.length > 0 && (
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-sm text-gray-600">
                      Showing results for &#34;{lastSearchQuery}&#34;
                    </p>
                    <button
                      onClick={clearSearchResults}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Clear results
                    </button>
                  </div>
                )}

                {isSearching ? (
                  <div className="flex flex-col justify-center items-center h-64 space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 dark:border-emerald-400"></div>
                    <div className="text-center space-y-2">
                      <p className="text-lg font-medium text-gray-900 dark:text-white/90">Searching across multiple stores...</p>
                      <p className="text-sm text-gray-500 dark:text-white/50">This might take a moment as we gather results from various sources</p>
                    </div>
                  </div>
                ) : searchError ? (
                  <div className="flex flex-col justify-center items-center h-64 space-y-4">
                    <div className="rounded-full h-12 w-12 bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                      <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="text-center space-y-2">
                      <p className="text-lg font-medium text-gray-900 dark:text-white/90">Search Error</p>
                      <p className="text-sm text-gray-500 dark:text-white/50">{searchError}</p>
                      <button
                        onClick={() => setSearchError(null)}
                        className="mt-4 text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium"
                      >
                        Try Again
                      </button>
                    </div>
                  </div>
                ) : isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                  </div>
                ) : products.filter(product => product.current_price > 0).length > 0 ? (
                  <div className="space-y-8">
                    {/* Comparison Row */}
                    {comparisonProducts.length > 1 && (
                      <div className="bg-white dark:bg-[#1a1a1a] rounded-xl p-6 shadow-sm border border-gray-100 dark:border-white/10">
                        <div className="flex items-center gap-2 mb-4">
                          <TrendingUp className="w-5 h-5 text-emerald-500" />
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white/90">
                            Price Comparison Across Stores
                          </h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                          {comparisonProducts.map((product) => (
                            <ProductCard 
                              key={`comparison-${product.product_id}`} 
                              product={product}
                              // className="border-2 border-emerald-500/20 hover:border-emerald-500/40 bg-emerald-50/50 dark:bg-emerald-900/10"
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Remaining Products */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Tag className="w-5 h-5 text-gray-500" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white/90">
                          All Products
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {remainingProducts.map((product) => (
                          <ProductCard 
                            key={`regular-${product.product_id}`} 
                            product={product} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                    <p className="text-lg">No products found</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                  </div>
                )}
                {/* {loading && <div>Loading...</div>} */}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content*/}
      </div>
      
      {/* Right Sidebar - Only visible on lg screens and above */}
      <div className="hidden lg:block">
        <MarketplaceSidebar 
          onFiltersUpdate={handleFiltersUpdate}
          currentFilters={filters} 
          currentProducts={products}
        />
      </div>

      {/* Mobile Filter Button - Only visible below lg screens */}
      {mounted && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 flex justify-end bg-gradient-to-t from-black/10 to-transparent pointer-events-none">
          <button
            onClick={() => setIsMobileFiltersOpen(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full p-3 shadow-lg transition-transform hover:scale-105 active:scale-95 pointer-events-auto"
            aria-label="Open filters"
          >
            <Filter className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Mobile Filters Dialog - Only visible below lg screens */}
      <AnimatePresence>
        {mounted && isMobileFiltersOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
              onClick={() => setIsMobileFiltersOpen(false)}
            />
            
            {/* Sidebar */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 20 }}
              className="fixed inset-y-0 right-0 w-[350px] z-50 lg:hidden"
            >
              <MarketplaceSidebar 
                onFiltersUpdate={handleFiltersUpdate}
                currentFilters={filters} 
                currentProducts={products}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};