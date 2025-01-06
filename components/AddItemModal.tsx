'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import SearchResults from './SearchResults';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Dummy search results data
const dummySearchResults = [
  {
    id: '1',
    title: 'Apple MacBook Pro 14" (2023)',
    price: 1599.99,
    image: 'https://source.unsplash.com/random/800x600?macbook',
    source: 'Amazon',
    url: 'https://www.amazon.com/MacBook-Pro-14',
    specifications: [
      { label: 'Processor', value: 'M2 Pro' },
      { label: 'RAM', value: '16GB' },
      { label: 'Storage', value: '512GB SSD' },
      { label: 'Display', value: '14.2" Liquid Retina XDR' }
    ],
    features: [
      'ProMotion technology with adaptive refresh rates up to 120Hz',
      'Up to 18 hours of battery life',
      'Studio-quality three-mic array',
      'Six-speaker sound system'
    ]
  },
  {
    id: '2',
    title: 'Apple MacBook Pro 14" (2022)',
    price: 1399.99,
    image: 'https://source.unsplash.com/random/800x600?laptop',
    source: 'Best Buy',
    url: 'https://www.bestbuy.com/MacBook-Pro-14',
    specifications: [
      { label: 'Processor', value: 'M1 Pro' },
      { label: 'RAM', value: '16GB' },
      { label: 'Storage', value: '512GB SSD' },
      { label: 'Display', value: '14.2" Liquid Retina XDR' }
    ],
    features: [
      'ProMotion technology with adaptive refresh rates up to 120Hz',
      'Up to 17 hours of battery life',
      'Studio-quality three-mic array',
      'Six-speaker sound system'
    ]
  }
];

const AddItemModal = ({ isOpen, onClose }: AddItemModalProps) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<typeof dummySearchResults>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      toast.error('Please enter a search query');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use dummy data for now
      setSearchResults(dummySearchResults);
      setHasSearched(true);
    } catch (error) {
      console.error('Error searching products:', error);
      toast.error('Failed to search products');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setQuery('');
    setSearchResults([]);
    setHasSearched(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-[#111111] rounded-lg w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="p-4 sm:p-6 flex-shrink-0 border-b border-gray-200 dark:border-white/10">
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 text-gray-500 hover:text-gray-700 dark:text-white/50 dark:hover:text-white/70 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white/90 mb-4">
            Add New Item to Track
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="query"
                className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-2"
              >
                Search Query
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="query"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter product name or URL"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#222] text-gray-900 dark:text-white/90 placeholder-gray-400 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Searching...' : 'Search Products'}
            </button>
          </form>
        </div>

        {/* Search Results */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : hasSearched ? (
              searchResults.length > 0 ? (
                <SearchResults results={searchResults} onClose={handleClose} />
              ) : (
                <div className="text-center py-12 text-gray-500 dark:text-white/50">
                  No results found for "{query}"
                </div>
              )
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddItemModal; 