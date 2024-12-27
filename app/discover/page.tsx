'use client';

import { Search, Star, ShoppingCart, Heart, Truck } from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import SearchBar from '@/components/discover/SearchBar';
import Filters, { FilterState } from '@/components/discover/Filters';
import { dummyDiscover } from '@/data/dummyDiscover';
import { X, SlidersHorizontal, Bookmark } from 'lucide-react';

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

interface SharedSearch {
  id: string;
  query: string;
  description: string;
  timestamp: string;
  user: {
    name: string;
    avatar: string;
  };
  likes: number;
  saves: number;
  tags: string[];
  image: string;
}

const dummySharedSearches: SharedSearch[] = [
  {
    id: '1',
    query: 'Encyclopedia Britannica is now an AI Company',
    description: 'Encyclopedia Britannica, the iconic knowledge repository, has undergone a remarkable transformation from traditional print publisher to cutting-edge AI company. As reported by TechCrunch, this shift marks a significant milestone in the evolution of educational technology.',
    timestamp: '2 hours ago',
    user: {
      name: 'elymc',
      avatar: 'E'
    },
    likes: 423,
    saves: 189,
    tags: ['ai', 'education', 'technology'],
    image: 'https://source.unsplash.com/random/1200x800?encyclopedia'
  },
  {
    id: '2',
    query: "OpenAI's Humanoid Robot Plans",
    description: 'According to reports from TechCrunch, OpenAI has unveiled ambitious plans for developing advanced humanoid robots, combining their expertise in artificial intelligence with cutting-edge robotics technology.',
    timestamp: '4 hours ago',
    user: {
      name: 'katemccart',
      avatar: 'K'
    },
    likes: 352,
    saves: 241,
    tags: ['robotics', 'ai', 'technology'],
    image: 'https://source.unsplash.com/random/800x600?robot'
  },
  {
    id: '3',
    query: "Home Alone's Wealthy Mystery",
    description: 'The iconic McCallister family home in "Home Alone" has sparked renewed interest as financial analysts break down the true value of the property and the family\'s mysterious wealth in the beloved holiday classic.',
    timestamp: '6 hours ago',
    user: {
      name: 'velvetecho',
      avatar: 'V'
    },
    likes: 892,
    saves: 567,
    tags: ['movies', 'real-estate', 'entertainment'],
    image: 'https://source.unsplash.com/random/800x600?mansion'
  },
  {
    id: '4',
    query: 'Trans-Neptunian Objects',
    description: 'The James Webb Space Telescope\'s recent observations have revealed fascinating new details about mysterious objects in the outer reaches of our solar system, beyond Neptune\'s orbit.',
    timestamp: '8 hours ago',
    user: {
      name: 'elymc',
      avatar: 'E'
    },
    likes: 756,
    saves: 432,
    tags: ['space', 'astronomy', 'science'],
    image: 'https://source.unsplash.com/random/800x600?planet'
  },
  {
    id: '5',
    query: 'The Rise of Mechanical Keyboards',
    description: 'Exploring the growing popularity of custom mechanical keyboards, from boutique switches to group buys, and how this niche hobby has evolved into a thriving community of enthusiasts.',
    timestamp: '12 hours ago',
    user: {
      name: 'techphile',
      avatar: 'T'
    },
    likes: 234,
    saves: 156,
    tags: ['technology', 'hardware', 'hobby'],
    image: 'https://source.unsplash.com/random/800x600?keyboard'
  },
  {
    id: '6',
    query: 'Future of Urban Agriculture',
    description: 'Vertical farming startups are revolutionizing urban agriculture with AI-powered systems and hydroponics, promising sustainable food production in cities around the world.',
    timestamp: '1 day ago',
    user: {
      name: 'greenfuture',
      avatar: 'G'
    },
    likes: 445,
    saves: 289,
    tags: ['sustainability', 'agriculture', 'technology'],
    image: 'https://source.unsplash.com/random/800x600?vertical-farming'
  },
  {
    id: '7',
    query: 'The Psychology of Procrastination',
    description: 'New research reveals surprising insights into why we procrastinate and how our brains process task avoidance, offering potential solutions for better productivity.',
    timestamp: '1 day ago',
    user: {
      name: 'mindmatters',
      avatar: 'M'
    },
    likes: 678,
    saves: 445,
    tags: ['psychology', 'productivity', 'science'],
    image: 'https://source.unsplash.com/random/800x600?time'
  }
];

const Page = () => {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState('For You');
  const [sharedSearches, setSharedSearches] = useState(dummySharedSearches);

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

  const handleSave = (searchId: string) => {
    setSharedSearches(prev => 
      prev.map(search => 
        search.id === searchId 
          ? { ...search, saves: search.saves + 1 }
          : search
      )
    );
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
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-4 border-gray-200 dark:border-[#333] border-t-emerald-500 rounded-full animate-spin" />
    </div>
  ) : (
    <div className="min-h-screen bg-white dark:bg-[#111111]">
      <div className="max-w-[1200px] w-full mx-auto px-6 py-6">
        {/* Header */}
        <div className="flex flex-col gap-6 mb-8 max-w-3xl mx-auto">
          {/* Title and Search Row */}
          <div className="flex items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-white/70 text-transparent bg-clip-text">
                Explore
              </h1>
              <div className="flex items-center gap-2 mt-1.5">
                <p className="text-sm text-gray-500 dark:text-white/50">
                  Browse and search through articles
                </p>
                <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-white/20" />
                <span className="text-sm text-gray-500 dark:text-white/50">
                  {sharedSearches.length} articles
                </span>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="w-[280px]">
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-gray-100 dark:border-white/10 pb-1">
            {['For You', 'Top', 'Tech & Science', 'Finance', 'Arts & Culture', 'Sports'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-[#17B1B1]/10 text-[#17B1B1] shadow-[0_0_10px_rgba(23,177,177,0.1)]'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-white/60 dark:hover:text-white/90 dark:hover:bg-white/5'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto">
          {/* Featured Article */}
          <div className="max-w-3xl mx-auto">
            {sharedSearches.slice(0, 1).map((search) => (
              <div
                key={search.id}
                className="group relative bg-white dark:bg-[#141414] rounded-xl overflow-hidden border border-gray-200 dark:border-[#222] hover:border-gray-300 dark:hover:border-[#333] transition-colors duration-300 mb-6 shadow-sm hover:shadow-md"
              >
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                      <span className="text-xs font-medium text-white">
                        {search.user.avatar}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-900 dark:text-white/90">
                        {search.user.name}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-white/50">
                        {search.timestamp}
                      </span>
                    </div>
                    <button 
                      className="ml-auto text-gray-400 hover:text-gray-900 dark:text-white/40 dark:hover:text-white/90 transition-colors"
                      aria-label="Bookmark"
                    >
                      <Bookmark className="w-5 h-5" />
                    </button>
                  </div>

                  <h2 className="text-xl font-medium text-gray-900 dark:text-white/90 mb-3">
                    {search.query}
                  </h2>
                  <p className="text-base text-gray-600 dark:text-white/60 mb-4">
                    {search.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Grid of Articles */}
          <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {sharedSearches.slice(1).map((search) => (
              <div
                key={search.id}
                className="group relative bg-white dark:bg-[#141414] rounded-xl overflow-hidden border border-gray-200 dark:border-[#222] hover:border-gray-300 dark:hover:border-[#333] transition-colors duration-300 shadow-sm hover:shadow-md"
              >
                <div className="aspect-[16/10] relative overflow-hidden">
                  <img
                    src={search.image}
                    alt={search.query}
                    className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-base font-medium text-gray-900 dark:text-white/90 mb-2 line-clamp-2">
                    {search.query}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-white/60 line-clamp-2 mb-3">
                    {search.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                        <span className="text-xs font-medium text-white">
                          {search.user.avatar}
                        </span>
                      </div>
                      <span className="text-xs text-gray-600 dark:text-white/60">
                        {search.user.name}
                      </span>
                    </div>
                    <button 
                      onClick={() => handleSave(search.id)}
                      className="text-gray-400 hover:text-gray-900 dark:text-white/40 dark:hover:text-white/90 transition-colors"
                      aria-label="Save search"
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
