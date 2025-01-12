'use client';

import React, { useState } from 'react';
import { Search, Camera, Mic, Users, Calendar, Tag, SlidersHorizontal, Sparkles, X, Store } from 'lucide-react';
import Image from 'next/image';
import process from 'process';

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

interface SearchBarProps {
  onSearch: (products: ProductResponse[]) => void;
  onSearchStart?: (query: string) => void;
  onImageSearch: (file: File) => void;
  onFilterChange?: (filters: any) => void;
  initialQuery?: string;
}

const SearchBar = ({ onSearch, onSearchStart, onImageSearch, onFilterChange, initialQuery = '' }: SearchBarProps) => {
  const [query, setQuery] = useState(initialQuery);
  const [isActive, setIsActive] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedWebsite, setSelectedWebsite] = useState<string>('all');

  const websites = [
    { id: 'all', name: 'All Sites', icon: <Store className="w-4 h-4" /> },
    { 
      id: 'jumia.com.ng', 
      name: 'Jumia', 
      icon: (
        <div className="w-4 h-4 relative flex items-center justify-center rounded bg-[#f68b1e]">
          <span className="text-[8px] font-bold text-white">J</span>
        </div>
      ) 
    },
    { 
      id: 'jiji.ng', 
      name: 'Jiji',
      icon: (
        <div className="w-4 h-4 relative flex items-center justify-center rounded bg-[#2bb34b]">
          <span className="text-[8px] font-bold text-white">Ji</span>
        </div>
      )
    },
    { 
      id: 'konga.com', 
      name: 'Konga',
      icon: (
        <div className="w-4 h-4 relative flex items-center justify-center rounded bg-[#ed017f]">
          <span className="text-[8px] font-bold text-white">K</span>
        </div>
      )
    }
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSearch(file);
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    if (onSearchStart) {
      onSearchStart(query);
    }

    try {
      const params = new URLSearchParams({
        query: query,
        site: selectedWebsite,
        max_results: '5',
        page: '1',
        limit: '50'
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/search?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch search results');
      }

      const data: ProductResponse[] = await response.json();
      onSearch(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while searching');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    if (newQuery === '') {
      onSearch([]);
      if (onSearchStart) {
        onSearchStart('');
      }
    }
  };

  const handleClearSearch = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuery('');
    onSearch([]);
    if (onSearchStart) {
      onSearchStart('');
    }
  };

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Main Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch bg-white dark:bg-[#141414] rounded-2xl sm:rounded-full border border-gray-200 dark:border-[#222] shadow-sm hover:shadow-md transition-shadow">
        {/* Where */}
        <button 
          onClick={() => setActiveFilter(activeFilter === 'where' ? null : 'where')}
          className={`flex-1 flex items-center px-4 sm:px-6 py-3 sm:py-3.5 rounded-t-2xl sm:rounded-l-full sm:rounded-tr-none hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${
            activeFilter === 'where' ? 'bg-gray-50 dark:bg-white/5' : ''
          }`}
        >
          <div className="text-left w-full">
            <div className="text-xs font-semibold mb-0.5">Where</div>
            <input
              type="text"
              placeholder="Search products..."
              value={query}
              onChange={handleQueryChange}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              onClick={(e) => e.stopPropagation()}
              className="w-full bg-transparent text-sm text-gray-900 dark:text-white/90 placeholder-gray-400 dark:placeholder-white/40 focus:outline-none"
            />
            {query && (
              <button
                onClick={() => {
                  setQuery('');
                  onSearch([]); // Clear the search results
                }}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </button>

        {/* Divider */}
        <div className="hidden sm:block w-px self-center h-8 bg-gray-200 dark:bg-[#333]" />

        {/* Website Filter */}
        <div className="relative min-w-[140px]">
          <select
            value={selectedWebsite}
            onChange={(e) => setSelectedWebsite(e.target.value)}
            className="w-full appearance-none bg-transparent border-0 py-1.5 pl-9 pr-8 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-0"
          >
            {websites.map((site) => (
              <option key={site.id} value={site.id}>
                {site.name}
              </option>
            ))}
          </select>
          <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none">
            {websites.find(site => site.id === selectedWebsite)?.icon}
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
            <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
          <div className="absolute -bottom-1 left-2 right-2 h-[1px] bg-gray-200 dark:bg-gray-700"></div>
        </div>

        {/* Smart Filter */}
        <button 
          onClick={() => setActiveFilter(activeFilter === 'smart' ? null : 'smart')}
          className={`px-4 sm:px-6 py-3 sm:py-3.5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-t border-gray-200 dark:border-[#222] sm:border-t-0 ${
            activeFilter === 'smart' ? 'bg-gray-50 dark:bg-white/5' : ''
          }`}
        >
          <div className="text-left flex items-center gap-2">
            <div>
              <div className="text-xs font-semibold mb-0.5">Smart Filter</div>
              <div className="text-sm text-gray-500 dark:text-white/50">AI-powered search</div>
            </div>
            <Sparkles className="w-4 h-4 text-emerald-500" />
          </div>
        </button>

        {/* Search Button */}
        <button 
          onClick={handleSearch}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-b-2xl sm:rounded-r-full sm:rounded-bl-none transition-colors disabled:opacity-50"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
          <span className="font-medium text-sm">Search</span>
        </button>
      </div>

      {/* Dropdowns */}
      {activeFilter && (
        <div className="absolute left-0 right-0 mt-2 p-3 sm:p-4 bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#222] rounded-2xl sm:rounded-3xl shadow-xl z-20">
          {activeFilter === 'where' && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <Camera className="w-4 h-4 text-gray-400" />
                <span className="text-xs sm:text-sm text-gray-500">Search with an image</span>
              </div>
              <div className="text-xs sm:text-sm font-medium mb-2">Popular searches</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                <button className="text-left px-3 py-2 text-xs sm:text-sm text-gray-600 dark:text-white/70 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors">
                  Gaming Laptops
                </button>
                <button className="text-left px-3 py-2 text-xs sm:text-sm text-gray-600 dark:text-white/70 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors">
                  Wireless Earbuds
                </button>
                <button className="text-left px-3 py-2 text-xs sm:text-sm text-gray-600 dark:text-white/70 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors">
                  Smart Watches
                </button>
                <button className="text-left px-3 py-2 text-xs sm:text-sm text-gray-600 dark:text-white/70 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors">
                  4K Monitors
                </button>
              </div>
            </div>
          )}

          {activeFilter === 'smart' && (
            <div className="space-y-3 sm:space-y-4">
              <input
                type="text"
                placeholder="Describe what you're looking for..."
                value={''}
                onChange={(e) => {}}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-gray-200 dark:border-[#222] bg-white dark:bg-[#111111] text-sm text-gray-900 dark:text-white/90 placeholder-gray-400 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
              <div className="text-xs sm:text-sm text-gray-500 dark:text-white/50">
                Example: &quot;Gaming laptop with good battery life under $1000&quot;
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="absolute top-full mt-2 w-full px-4 py-2 bg-red-100 text-red-600 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
