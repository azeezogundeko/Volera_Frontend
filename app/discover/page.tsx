'use client';

import { Search, Star, ShoppingCart, Heart, Truck } from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import SearchBar from '@/components/discover/SearchBar';
import Filters, { FilterState } from '@/components/discover/Filters';
import { dummyDiscover } from '@/data/dummyDiscover';

interface Product {
  id: string;
  title: string;
  content: string;
  price: number;
  originalPrice: number;
  url: string;
  thumbnail: string;
  category?: string;
  brand?: string;
  rating?: number;
  reviews?: number;
  colors?: string[];
  sizes?: string[];
  specs?: string[];
  features?: string[];
  inStock: boolean;
  freeShipping: boolean;
  date?: string;
}

const Page = () => {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  useEffect(() => {
    const handleSidebarChange = (e: CustomEvent) => {
      setIsSidebarExpanded(e.detail.expanded);
    };

    window.addEventListener('sidebarStateChange' as any, handleSidebarChange);
    setProducts(dummyDiscover);
    setFilteredProducts(dummyDiscover);
    setLoading(false);

    return () => {
      window.removeEventListener('sidebarStateChange' as any, handleSidebarChange);
    };
  }, []);

  const handleSearch = (query: string) => {
    if (!products) return;

    if (!query.trim()) {
      setFilteredProducts(products);
      return;
    }

    const searchTerms = query.toLowerCase().split(' ');
    const filtered = products.filter((item) => {
      const searchText = `${item.title} ${item.content} ${item.category} ${item.brand}`
        .toLowerCase();
      return searchTerms.every((term) => searchText.includes(term));
    });

    setFilteredProducts(filtered);
  };

  const handleFilterChange = (filters: FilterState) => {
    if (!products) return;

    let filtered = [...products];

    if (filters.categories.length > 0) {
      filtered = filtered.filter((item) =>
        item.category ? filters.categories.includes(item.category) : false
      );
    }

    if (filters.dateRange !== 'all' && filtered.length > 0) {
      const now = new Date();
      const getDateRange = () => {
        switch (filters.dateRange) {
          case 'today':
            return new Date(now.setDate(now.getDate() - 1));
          case 'week':
            return new Date(now.setDate(now.getDate() - 7));
          case 'month':
            return new Date(now.setMonth(now.getMonth() - 1));
          case 'year':
            return new Date(now.setFullYear(now.getFullYear() - 1));
          default:
            return new Date(0);
        }
      };

      const dateRange = getDateRange();
      filtered = filtered.filter((item) =>
        item.date ? new Date(item.date) >= dateRange : true
      );
    }

    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'recent':
          return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
        case 'popular':
          return (b.reviews || 0) - (a.reviews || 0);
        case 'relevant':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  };

  const renderRating = (rating: number = 0) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            className={`${
              star <= rating
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300 fill-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return loading ? (
    <div className="flex flex-row items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  ) : (
    <div className="min-h-screen">
      <div className={`fixed top-0 transition-all duration-300 ${
        isSidebarExpanded ? 'left-[240px]' : 'left-[80px]'
      } right-0 bg-white/80 dark:bg-black/80 backdrop-blur-lg z-50 border-b border-light-200 dark:border-dark-200`}>
        <div className="p-6">
          <div className="flex flex-col gap-6 max-w-[1000px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 text-transparent bg-clip-text">
                  Shop
                </h1>
              </div>
              <div className="text-sm text-gray-500">
                {filteredProducts?.length} products found
              </div>
            </div>
            
            <div className="relative">
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>
        </div>
      </div>

      <div className={`fixed top-[160px] bottom-0 transition-all duration-300 ${
        isSidebarExpanded ? 'left-[240px]' : 'left-[80px]'
      } w-[240px] bg-white dark:bg-black border-r border-light-200 dark:border-dark-200 overflow-y-auto z-40`}>
        <div className="p-4">
          <Filters onFilterChange={handleFilterChange} />
        </div>
      </div>

      <main className={`pt-[160px] transition-all duration-300 ${
        isSidebarExpanded ? 'pl-[480px]' : 'pl-[320px]'
      } min-h-screen`}>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 auto-rows-fr">
            {filteredProducts?.map((item) => (
              <div
                key={item.id}
                className="group relative bg-white dark:bg-black rounded-2xl overflow-hidden border border-light-200 dark:border-dark-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 h-full"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-900">
                  <img
                    className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-700"
                    src={item.thumbnail}
                    alt={item.title}
                  />
                  {item.freeShipping && (
                    <div className="absolute top-4 left-4 px-3 py-1.5 bg-emerald-500 text-white text-xs font-medium rounded-full shadow-lg">
                      Free Shipping
                    </div>
                  )}
                  <button 
                    className="absolute top-4 right-4 p-2.5 bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transform group-hover:scale-110 transition-all duration-300 hover:bg-emerald-500 hover:text-white"
                    aria-label="Add to wishlist"
                  >
                    <Heart className="w-5 h-5" />
                  </button>
                  {!item.inStock && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                      <span className="px-4 py-2 bg-black/80 text-white text-sm font-medium rounded-full">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                      {item.brand}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{item.rating}</span>
                      <span className="text-xs text-gray-500">({item.reviews})</span>
                    </div>
                  </div>

                  <h2 className="text-base font-semibold mb-2 line-clamp-2 min-h-[2.5rem]">
                    {item.title}
                  </h2>

                  <div className="flex flex-col gap-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold">${item.price}</span>
                      {item.originalPrice > item.price && (
                        <span className="text-sm text-gray-500 line-through">
                          ${item.originalPrice}
                        </span>
                      )}
                      {item.originalPrice > item.price && (
                        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                          {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                        </span>
                      )}
                    </div>

                    <button
                      className={`w-full py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-all duration-300 ${
                        item.inStock
                          ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                      }`}
                      disabled={!item.inStock}
                    >
                      <ShoppingCart className={`w-5 h-5 ${item.inStock ? 'animate-bounce-subtle' : ''}`} />
                      {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Page;
