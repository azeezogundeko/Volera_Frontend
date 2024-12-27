'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, X, SlidersHorizontal, Sparkles } from 'lucide-react';

interface FiltersProps {
  onFilterChange: (filters: any) => void;
}

const Filters = ({ onFilterChange }: FiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [naturalLanguageFilter, setNaturalLanguageFilter] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [selectedStores, setSelectedStores] = useState<string[]>([]);

  const categories = [
    { name: 'Electronics', count: 1234 },
    { name: 'Clothing', count: 856 },
    { name: 'Home & Garden', count: 654 },
    { name: 'Sports', count: 432 },
    { name: 'Books', count: 765 },
    { name: 'Toys', count: 321 },
  ];

  const priceRanges = [
    { label: 'Under $25', value: '0-25', count: 234 },
    { label: '$25 - $50', value: '25-50', count: 567 },
    { label: '$50 - $100', value: '50-100', count: 789 },
    { label: '$100 - $200', value: '100-200', count: 432 },
    { label: 'Over $200', value: '200+', count: 321 },
  ];

  const stores = [
    { name: 'Amazon', count: 1543 },
    { name: 'Best Buy', count: 876 },
    { name: 'Walmart', count: 654 },
    { name: 'Target', count: 432 },
    { name: 'eBay', count: 987 },
  ];

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleStoreChange = (store: string) => {
    setSelectedStores(prev =>
      prev.includes(store)
        ? prev.filter(s => s !== store)
        : [...prev, store]
    );
  };

  return (
    <div className="bg-white dark:bg-[#141414] rounded-xl border border-gray-200 dark:border-[#222] overflow-hidden">
      {/* Natural Language Filter */}
      <div className="p-4">
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-medium text-gray-900 dark:text-white/90">
              Smart Filter
            </span>
          </div>
          <input
            type="text"
            placeholder="e.g., 'affordable gaming laptop under $800'"
            value={naturalLanguageFilter}
            onChange={(e) => setNaturalLanguageFilter(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-[#222] bg-white dark:bg-[#111111] text-gray-900 dark:text-white/90 placeholder-gray-400 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
          {naturalLanguageFilter && (
            <button
              onClick={() => setNaturalLanguageFilter('')}
              className="absolute right-2 top-[34px] -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-white/5"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Toggle */}
      <div className="px-4 py-3 border-t border-gray-100 dark:border-[#222]">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between text-gray-900 dark:text-white/90 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg px-3 py-2 transition-colors"
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-emerald-500" />
            <span className="font-medium">Advanced Filters</span>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Filter Options */}
      {isExpanded && (
        <div className="p-4 space-y-6 border-t border-gray-100 dark:border-[#222]">
          {/* Categories */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white/90 mb-3 flex items-center justify-between">
              Categories
              {selectedCategories.length > 0 && (
                <span className="text-xs text-emerald-500">
                  {selectedCategories.length} selected
                </span>
              )}
            </h3>
            <div className="space-y-2">
              {categories.map(({ name, count }) => (
                <label
                  key={name}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer group transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(name)}
                      onChange={() => handleCategoryChange(name)}
                      className="rounded border-gray-300 dark:border-[#333] text-emerald-500 focus:ring-emerald-500/20"
                    />
                    <span className="text-sm text-gray-600 dark:text-white/60 group-hover:text-gray-900 dark:group-hover:text-white/90 transition-colors">
                      {name}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400 dark:text-white/40">
                    {count.toLocaleString()}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white/90 mb-3">
              Price Range
            </h3>
            <div className="space-y-2">
              {priceRanges.map(({ label, value, count }) => (
                <label
                  key={value}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer group transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="priceRange"
                      value={value}
                      checked={selectedPriceRange === value}
                      onChange={(e) => setSelectedPriceRange(e.target.value)}
                      className="border-gray-300 dark:border-[#333] text-emerald-500 focus:ring-emerald-500/20"
                    />
                    <span className="text-sm text-gray-600 dark:text-white/60 group-hover:text-gray-900 dark:group-hover:text-white/90 transition-colors">
                      {label}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400 dark:text-white/40">
                    {count.toLocaleString()}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Stores */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white/90 mb-3 flex items-center justify-between">
              Stores
              {selectedStores.length > 0 && (
                <span className="text-xs text-emerald-500">
                  {selectedStores.length} selected
                </span>
              )}
            </h3>
            <div className="space-y-2">
              {stores.map(({ name, count }) => (
                <label
                  key={name}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer group transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedStores.includes(name)}
                      onChange={() => handleStoreChange(name)}
                      className="rounded border-gray-300 dark:border-[#333] text-emerald-500 focus:ring-emerald-500/20"
                    />
                    <span className="text-sm text-gray-600 dark:text-white/60 group-hover:text-gray-900 dark:group-hover:text-white/90 transition-colors">
                      {name}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400 dark:text-white/40">
                    {count.toLocaleString()}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Apply Filters Button */}
          <button
            onClick={() => onFilterChange({
              categories: selectedCategories,
              priceRange: selectedPriceRange,
              stores: selectedStores,
              naturalLanguage: naturalLanguageFilter
            })}
            className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors"
          >
            Apply Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Filters;
