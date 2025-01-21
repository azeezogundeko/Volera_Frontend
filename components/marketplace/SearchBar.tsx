'use client';

import React, { useState, useRef } from 'react';
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

const SearchBar = ({ onSearch, onSearchStart, onImageSearch, initialQuery = '' }: SearchBarProps) => {
  const [query, setQuery] = useState(initialQuery);
  const [isActive, setIsActive] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedWebsite, setSelectedWebsite] = useState<string>('all');
  const [isListening, setIsListening] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const websites = [
    { 
      id: 'all', 
      name: 'All Marketplaces',
      bgColor: '#4B5563',
      shortName: 'All'
    },
    { 
      id: 'jumia.com.ng', 
      name: 'Jumia',
      bgColor: '#f68b1e',
      shortName: 'J'
    },
    { 
      id: 'jiji.ng', 
      name: 'Jiji',
      bgColor: '#2bb34b',
      shortName: 'Ji'
    },
    { 
      id: 'konga.com', 
      name: 'Konga',
      bgColor: '#ed017f',
      shortName: 'K'
    }
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedImage(file);
        setShowImagePreview(true);
        setUploadedImages([...uploadedImages, file]);
        onImageSearch(file);
      } else {
        setError('Please select an image file');
      }
    }
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setUploadedImages(prevImages => prevImages.filter(image => image !== selectedImage)); // Remove the selected image from the uploadedImages array
    setSelectedImage(null);
    setShowImagePreview(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true; // Enable interim results

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript); // Update query with interim results
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      setError('Speech recognition is not supported in your browser');
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

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    if (onSearchStart) {
      onSearchStart(query);
    }

    try {
      const formData = new FormData();
      formData.append('query', query);
      formData.append('site', selectedWebsite);
      formData.append('max_results', '5');
      formData.append('page', '1');
      formData.append('limit', '50');
      console.log('Uploaded Images:', uploadedImages);
      uploadedImages.forEach(image => {
        formData.append('images', image);
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/search`, {
        method: 'POST',
        body: formData,
      });
      
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

  return (
    <div className="relative w-full max-w-4xl mx-auto px-4 sm:px-6">
      {/* Main Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch bg-white dark:bg-[#141414] rounded-2xl border border-gray-200 dark:border-[#222] shadow-sm hover:shadow-md transition-shadow">
        {/* Search Input */}
        <div className="flex-1 flex items-center gap-3 p-3 sm:p-4">
          <Sparkles className="hidden sm:block w-5 h-5 text-emerald-500 flex-shrink-0" />
          <div className="flex-1">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search products..."
                value={query}
                onChange={handleQueryChange}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full bg-transparent text-sm sm:text-base text-gray-900 dark:text-white/90 placeholder-gray-400 dark:placeholder-white/40 focus:outline-none pr-20"
              />
              <div className="absolute right-0 flex items-center gap-1 sm:gap-2">
                <button
                  onClick={triggerImageUpload}
                  className="p-1 sm:p-1.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors text-gray-400 dark:text-white/40"
                  title="Search with image"
                >
                  <Camera className="w-4 h-4" />
                </button>
                <button
                  onClick={startListening}
                  className={`p-1 sm:p-1.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors ${
                    isListening ? 'text-emerald-500' : 'text-gray-400 dark:text-white/40'
                  }`}
                  title="Search with voice"
                >
                  <Mic className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="mt-0.5 text-[10px] sm:text-xs text-gray-400 dark:text-white/30">
              AI-powered search: Try "Gaming laptop with good battery life under $1000"
            </div>
          </div>
          {query && (
            <button
              onClick={handleClearSearch}
              className="p-1 sm:p-1.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-gray-400 dark:text-white/40" />
            </button>
          )}
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />

        {/* Website Selector and Search Button Container */}
        <div className="flex border-t sm:border-t-0 sm:border-l border-gray-200 dark:border-[#222]">
          {/* Website Selector */}
          <div className="relative flex-1 sm:flex-none sm:min-w-[180px]">
            <div className="h-full">
              <select
                value={selectedWebsite}
                onChange={(e) => setSelectedWebsite(e.target.value)}
                className="h-full w-full appearance-none bg-transparent px-3 sm:px-4 py-3 text-sm text-gray-700 dark:text-white/90 focus:outline-none focus:ring-0 border-0 cursor-pointer"
              >
                {websites.map(site => (
                  <option key={site.id} value={site.id} className="bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white/90">
                    {site.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400 dark:text-white/40" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            
            {/* Website Icons */}
            <div className="hidden sm:flex absolute left-4 -bottom-3 -space-x-1.5">
              {selectedWebsite === 'all' ? (
                websites.slice(1).map((site) => (
                  <div
                    key={site.id}
                    className="w-6 h-6 rounded-full border-2 border-white dark:border-[#141414] shadow-sm flex items-center justify-center"
                    style={{ backgroundColor: site.bgColor }}
                  >
                    <span className="text-[10px] font-bold text-white">
                      {site.shortName}
                    </span>
                  </div>
                ))
              ) : (
                <div
                  className="w-6 h-6 rounded-full border-2 border-white dark:border-[#141414] shadow-sm flex items-center justify-center"
                  style={{ 
                    backgroundColor: websites.find(site => site.id === selectedWebsite)?.bgColor 
                  }}
                >
                  <span className="text-[10px] font-bold text-white">
                    {websites.find(site => site.id === selectedWebsite)?.shortName}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            disabled={isLoading || !query.trim()}
            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white sm:rounded-r-2xl transition-colors disabled:opacity-50 disabled:hover:bg-emerald-500"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span className="hidden sm:inline font-medium">Search</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Image Preview */}
      {showImagePreview && selectedImage && (
        <div className="absolute top-full mt-2 left-4 right-4 bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#222] rounded-lg p-3 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-white/90">Selected Image</span>
            <button
              onClick={removeImage}
              className="p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-gray-400 dark:text-white/40" />
            </button>
          </div>
          <div className="relative w-20 h-20 rounded-lg overflow-hidden">
            <Image
              src={URL.createObjectURL(selectedImage)}
              alt="Selected image"
              fill
              className="object-cover"
            />
          </div>
        </div>
      )}

      {error && (
        <div className="absolute top-full mt-2 left-4 right-4 px-4 py-2 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-200 text-sm rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
