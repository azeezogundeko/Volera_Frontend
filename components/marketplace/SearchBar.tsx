'use client';

import React, { useState } from 'react';
import { Search, Camera, Mic, Users, Calendar, Tag, SlidersHorizontal, Sparkles, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string, website?: string) => void;
  onImageSearch: (file: File) => void;
}

const SearchBar = ({ onSearch, onImageSearch }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [selectedWebsite, setSelectedWebsite] = useState<string | null>(null);
  const [naturalLanguageFilter, setNaturalLanguageFilter] = useState('');

  const websites = [
    { name: 'Amazon', logo: '/images/stores/amazon.png' },
    { name: 'Best Buy', logo: '/images/stores/bestbuy.png' },
    { name: 'Target', logo: '/images/stores/target.png' },
    { name: 'Walmart', logo: '/images/stores/walmart.png' },
    { name: 'eBay', logo: '/images/stores/ebay.png' },
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSearch(file);
    }
  };

  const handleSearch = () => {
    onSearch(query, selectedWebsite || undefined);
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Main Search Bar */}
      <div className="flex items-stretch bg-white dark:bg-[#141414] rounded-full border border-gray-200 dark:border-[#222] shadow-sm hover:shadow-md transition-shadow">
        {/* Where */}
        <button 
          onClick={() => setActiveFilter(activeFilter === 'where' ? null : 'where')}
          className={`flex-1 flex items-center px-6 py-3.5 rounded-l-full hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${
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
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              onClick={(e) => e.stopPropagation()}
              className="w-full bg-transparent text-sm text-gray-900 dark:text-white/90 placeholder-gray-400 dark:placeholder-white/40 focus:outline-none"
            />
          </div>
        </button>

        {/* Divider */}
        <div className="w-px self-center h-8 bg-gray-200 dark:bg-[#333]" />

        {/* Website Filter */}
        <button 
          onClick={() => setActiveFilter(activeFilter === 'website' ? null : 'website')}
          className={`px-6 py-3.5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${
            activeFilter === 'website' ? 'bg-gray-50 dark:bg-white/5' : ''
          }`}
        >
          <div className="text-left">
            <div className="text-xs font-semibold mb-0.5">Website</div>
            <div className="text-sm text-gray-500 dark:text-white/50">
              {selectedWebsite || 'All websites'}
            </div>
          </div>
        </button>

        {/* Divider */}
        <div className="w-px self-center h-8 bg-gray-200 dark:bg-[#333]" />

        {/* Smart Filter */}
        <button 
          onClick={() => setActiveFilter(activeFilter === 'smart' ? null : 'smart')}
          className={`px-6 py-3.5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${
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
          className="flex items-center gap-2 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-r-full transition-colors"
        >
          <Search className="w-4 h-4" />
          <span className="font-medium">Search</span>
        </button>
      </div>

      {/* Dropdowns */}
      {activeFilter && (
        <div className="absolute left-0 right-0 mt-2 p-4 bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#222] rounded-3xl shadow-xl z-20">
          {activeFilter === 'where' && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-4">
                <Camera className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">Search with an image</span>
              </div>
              <div className="text-sm font-medium mb-2">Popular searches</div>
              <div className="grid grid-cols-2 gap-2">
                <button className="text-left px-3 py-2 text-sm text-gray-600 dark:text-white/70 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors">
                  Gaming Laptops
                </button>
                <button className="text-left px-3 py-2 text-sm text-gray-600 dark:text-white/70 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors">
                  Wireless Earbuds
                </button>
                <button className="text-left px-3 py-2 text-sm text-gray-600 dark:text-white/70 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors">
                  Smart Watches
                </button>
                <button className="text-left px-3 py-2 text-sm text-gray-600 dark:text-white/70 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors">
                  4K Monitors
                </button>
              </div>
            </div>
          )}

          {activeFilter === 'website' && (
            <div className="space-y-4">
              <div className="text-sm font-medium mb-2">Select Website</div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setSelectedWebsite(null);
                    setActiveFilter(null);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    !selectedWebsite
                      ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'text-gray-600 dark:text-white/70 hover:bg-gray-50 dark:hover:bg-white/5'
                  }`}
                >
                  All Websites
                </button>
                {websites.map((website) => (
                  <button
                    key={website.name}
                    onClick={() => {
                      setSelectedWebsite(website.name);
                      setActiveFilter(null);
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      selectedWebsite === website.name
                        ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'text-gray-600 dark:text-white/70 hover:bg-gray-50 dark:hover:bg-white/5'
                    }`}
                  >
                    <img
                      src={website.logo}
                      alt={website.name}
                      className="w-4 h-4 object-contain"
                    />
                    {website.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeFilter === 'smart' && (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Describe what you're looking for..."
                value={naturalLanguageFilter}
                onChange={(e) => setNaturalLanguageFilter(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-[#222] bg-white dark:bg-[#111111] text-gray-900 dark:text-white/90 placeholder-gray-400 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
              <div className="text-sm text-gray-500 dark:text-white/50">
                Example: "Gaming laptop with good battery life under $1000"
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
