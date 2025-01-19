'use client';

import { 
  MessageSquare, 
  TrendingUp, 
  Bell, 
  Package, 
  ArrowUp, 
  ArrowDown, 
  Upload, 
  Sparkles, 
  Search 
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  DashboardStats,
  PriceHistory,
  Chat,
  TrackedItem,
  TrendingProduct,
  getDashboardStats,
  getPriceHistory,
  getRecentChats,
  getTrackedItems,
  getTrendingProducts,
} from '@/lib/api';

export default function Home() {
  const [stats, setStats] = useState<DashboardStats>({
    activeChats: 0,
    trackedItems: 0,
    priceAlerts: 0,
  });
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]);
  const [recentChats, setRecentChats] = useState<Chat[]>([]);
  const [trackedItems, setTrackedItems] = useState<TrackedItem[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<TrendingProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const [
          statsData,
          historyData,
          chatsData,
          itemsData,
          productsData,
        ] = await Promise.all([
          getDashboardStats(),
          getPriceHistory(),
          getRecentChats(),
          getTrackedItems(),
          getTrendingProducts(),
        ]);

        setStats(statsData);
        setPriceHistory(historyData);
        setRecentChats(chatsData);
        setTrackedItems(itemsData);
        setTrendingProducts(productsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    const fetchRecentChats = async () => {
      try {
        const response = await fetch('/api/recent-chats'); 
        const data = await response.json();
        setRecentChats(data); 
      } catch (error) {
        console.error('Error fetching recent chats:', error);
      }
    };

    fetchRecentChats();
  }, []);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await fetch('/api/user');
        const data = await response.json();
        setUserName(data.name || 'User');
      } catch (error) {
        console.error('Error fetching user name:', error);
      }
    };

    fetchUserName();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-[#111111]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-medium bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-white/70 text-transparent bg-clip-text">
            Welcome back, {userName}! 👋
          </h1>
          <p className="text-sm text-gray-500 dark:text-white/50 mt-1">
            Overview of your tracking and chat activities
          </p>
        </div>

        {/* Pro Upgrade Banner */}
        <div className="mb-6 sm:mb-8 bg-[#E5F7E5] dark:bg-[#1a1a1a] rounded-xl p-4 border border-[#4CAF50]/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-[#4CAF50]/10 rounded-lg">
                <Sparkles className="w-5 h-5 text-[#4CAF50]" />
              </div>
              <div>
                <h2 className="text-base font-medium text-gray-900 dark:text-white/90">Try Pro</h2>
                <p className="text-sm text-gray-600 dark:text-white/70">
                  Unlock premium features
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-sm text-[#4CAF50] dark:text-[#4CAF50]">
                <Upload className="w-4 h-4" />
                <span>Image Upload</span>
                <span className="mx-1">•</span>
                <Search className="w-4 h-4" />
                <span>Pro Search</span>
              </div>
              <Link 
                href="/upgrade"
                className="group relative px-4 py-1.5 bg-[#4CAF50] hover:bg-[#45a049] text-white rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-lg hover:shadow-[#4CAF50]/20"
              >
                Upgrade
                <span className="absolute -top-8 right-0 w-max opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded pointer-events-none">
                  Get smarter AI & more!
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-white/10 p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
                <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-white/50">Active Chats</p>
                <p className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white/90">
                  {stats.activeChats}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-white/10 p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg">
                <Package className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-white/50">Tracked Items</p>
                <p className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white/90">
                  {stats.trackedItems}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-white/10 p-4 sm:p-6 sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-purple-50 dark:bg-purple-500/10 rounded-lg">
                <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-white/50">Price Alerts</p>
                <p className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white/90">
                  {stats.priceAlerts}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Price History */}
            <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-white/10 p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white/90 mb-4 sm:mb-6">
                Price History
              </h2>
              <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
                {priceHistory.map((data, index) => (
                  <div key={data.date} className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-white/50">
                      {new Date(data.date).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 dark:text-white/90">
                        ${data.price}
                      </span>
                      {index > 0 && (
                        <span className={`flex items-center gap-0.5 ${
                          data.price < priceHistory[index - 1].price 
                            ? 'text-emerald-500' 
                            : 'text-red-500'
                        }`}>
                          {data.price < priceHistory[index - 1].price ? (
                            <ArrowDown className="w-3 h-3" />
                          ) : (
                            <ArrowUp className="w-3 h-3" />
                          )}
                          ${Math.abs(data.price - priceHistory[index - 1].price)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Chats */}
            <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-white/10 p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white/90 mb-4 sm:mb-6">
                Recent Chats
              </h2>
              {Array.isArray(recentChats) && recentChats.length > 0 ? (
                recentChats.map((chat) => (
                  <Link
                    key={chat.id}
                    href={`/chat/${chat.id}`}
                    className="block bg-gray-50 dark:bg-white/5 rounded-lg p-3 sm:p-4 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-0 mb-1 sm:mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white/90 text-sm sm:text-base">
                        {chat.title}
                      </h3>
                      <span className="text-xs text-gray-500 dark:text-white/50">
                        {chat.timestamp}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-white/50 truncate">
                      {chat.lastMessage}
                    </p>
                  </Link>
                ))
              ) : (
                <div>No recent chats available.</div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6 sm:space-y-8">
            {/* Tracked Items */}
            <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-white/10 p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white/90 mb-4 sm:mb-6">
                Tracked Items
              </h2>
              <div className="space-y-3 sm:space-y-4">
                {trackedItems.map((item) => (
                  <Link
                    key={item.id}
                    href={`/track/${item.id}`}
                    className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 dark:bg-white/5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                  >
                    <div className="relative w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 dark:text-white/90 text-sm sm:text-base truncate">
                        {item.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                        <span className="text-xs sm:text-sm text-emerald-500 font-medium">
                          ${item.currentPrice}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-white/50">
                          Target: ${item.targetPrice}
                        </span>
                        <p>
                          Price Change: {item.priceChange !== undefined ? item.priceChange : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Trending Products */}
            <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-white/10 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white/90">
                  Trending Products
                </h2>
                <div className="p-1.5 sm:p-2 bg-orange-50 dark:bg-orange-500/10 rounded-lg">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {trendingProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 dark:bg-white/5 rounded-lg"
                  >
                    <div className="relative w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 dark:text-white/90 text-sm sm:text-base truncate">
                        {product.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs sm:text-sm text-emerald-500 font-medium">
                          ${product.price}
                        </span>
                        <span className={`text-xs flex items-center gap-0.5 ${
                          product.trend === 'up' ? 'text-emerald-500' : 'text-red-500'
                        }`}>
                          {product.trend === 'up' ? (
                            <ArrowUp className="w-3 h-3" />
                          ) : (
                            <ArrowDown className="w-3 h-3" />
                          )}
                          {product.trendValue}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
