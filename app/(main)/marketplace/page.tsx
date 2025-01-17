'use client';

import React, { useState, useEffect } from 'react';
import SearchBar from '@/components/marketplace/SearchBar';
import ProductCard from '@/components/marketplace/ProductCard';
import { Store, Zap, Tag, TrendingUp, Star, Clock, Flame } from 'lucide-react';

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

const MarketplacePage = () => {
  const [products, setProducts] = useState<ProductResponse[]>(() => {
    // Try to get cached results on initial load
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('searchResults');
      return cached ? JSON.parse(cached) : [];
    }
    return [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [lastSearchQuery, setLastSearchQuery] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('lastSearchQuery') || '';
    }
    return '';
  });
  const [clearToggle, setClearToggle] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('searchResults');
      if (cached) {
        setProducts(JSON.parse(cached));
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (products.length > 0) {
        localStorage.setItem('searchResults', JSON.stringify(products));
      }
    }
  }, [products]);

  useEffect(() => {
    console.log('Products updated:', products); // Log products state whenever it changes
  }, [products]);

  const handleSearchStart = (query: string) => {
    setIsSearching(true);
    setProducts([]);
    if (typeof window !== 'undefined') {
      setLastSearchQuery(query);
      localStorage.setItem('lastSearchQuery', query);
    }
  };

  const handleSearchComplete = (searchResults: ProductResponse[]) => {
    setProducts(searchResults);
    setIsSearching(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('searchResults', JSON.stringify(searchResults));
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

// Debug state updates with useEffect
useEffect(() => {
    console.log('Products updated:', products);
}, [products]);

useEffect(() => {
    console.log('Clear toggle updated:', clearToggle);
}, [clearToggle]);

useEffect(() => {
  console.log('Rendering products:', products);
}, [products]);

  const handleImageSearch = (file: File) => {
    console.log('Image search with:', file);
  };

  const handleFilterChange = (filters: any) => {
    console.log('Filters changed:', filters);
  };

  // Function to render a section of products
  const renderProductSection = (title: string, icon: React.ReactNode, products: any[], subtitle?: string) => (
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

  return (
    <div className="min-h-screen bg-white dark:bg-[#111111]">
      <div className="max-w-[1200px] w-full mx-auto px-4 sm:px-6 py-4 sm:py-6">
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
                    {products.length.toLocaleString()} products
                  </span>
                </div>
              </div>
              <p className="text-sm sm:text-base text-gray-500 dark:text-white/50">
                Discover and compare products across multiple stores
              </p>
            </div>

            {/* Quick Stats */}
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
          </div>

          {/* Search Section */}
          <div className="relative">
            {/* Content */}
            <div className="relative py-3">
              <div className="flex flex-col flex-1 gap-6">
                <SearchBar 
                  onSearch={handleSearchComplete}
                  onSearchStart={handleSearchStart}
                  onImageSearch={handleImageSearch}
                  onFilterChange={handleFilterChange}
                  initialQuery={lastSearchQuery}
                />
                
                {lastSearchQuery && products.length > 0 && (
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-sm text-gray-600">
                      Showing results for "{lastSearchQuery}"
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
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                    <div className="text-center space-y-2">
                      <p className="text-lg font-medium text-gray-900">Searching across multiple stores...</p>
                      <p className="text-sm text-gray-500">This might take a moment as we gather results from various sources</p>
                    </div>
                  </div>
                ) : isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                  </div>
                ) : products.filter(product => product.current_price > 0).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products
                      .filter(product => product.current_price > 0)
                      .map((product, index) => (
                      <ProductCard key={`${product.product_id}-${index}`} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                    <p className="text-lg">No products found</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {/* <div className="space-y-12"> */}
          {/* Trending Now */}
          {/* {renderProductSection( */}
            {/* 'Trending Now', */}
            {/* <TrendingUp className="w-6 h-6 text-orange-500" />, */}
            {/* products, */}
            {/* 'Most popular products this week' */}
          {/* )} */}

          {/* Recommended for You */}
          {/* {renderProductSection( */}
            {/* 'Recommended for You', */}
            {/* <Star className="w-6 h-6 text-purple-500" />,
            products,
            'Based on your preferences'
          )} */}

          {/* New Arrivals */}
          {/* {renderProductSection( */}
            {/* 'New Arrivals',
            <Clock className="w-6 h-6 text-blue-500" />,
            products,
            'Latest products added to our marketplace'
          )} */}

          {/* Best Deals */}
          {/* {renderProductSection(
            'Best Deals',
            <Flame className="w-6 h-6 text-red-500" />,
            products,
            'Greatest savings across all stores'
          )} */}
        {/* </div> */}
      </div>
    </div>
  );
};

export default MarketplacePage;
