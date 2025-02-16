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
  Search,
  AlertCircle,
  Ban,
  AlertTriangle,
  Store
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import {
  DashboardStats,
  BillingInfo,
  Chat,
  ChatResponse,
  TrackedItem,
  PriceHistory,
  TrendingProduct,
  getDashboardStats,
  getBillingInfo,
  getRecentChats,
  getTrackedItems,
  getTrendingProducts,
} from '@/lib/api';
import cn from 'classnames';

interface User {
  first_name: string;
  last_name: string;
  email: string;
  // Add other properties as needed
}
let token: string | null;
let user: User = { first_name: '', last_name: '', email: '' }; // Initialize with default values

if (typeof window !== 'undefined') {
  token = localStorage.getItem('auth_token');
  user = JSON.parse(localStorage.getItem('user') || '{}') as User; // Cast to User type
}


export default function Home() {
  const [stats, setStats] = useState<DashboardStats>({
    activeChats: 0,
    trackedItems: 0,
    priceAlerts: 0,
  });
  const [billingInfo, setBillingInfo] = useState<BillingInfo>({
    currentPlan: '',
    totalCredits: 0,
    usedCredits: 0,
    remainingCredits: 0,
    creditHistory: [],
  });
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]);
  const [recentChats, setRecentChats] = useState<Chat[]>([]);
  const [trackedItems, setTrackedItems] = useState<TrackedItem[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<TrendingProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const [
          statsData,
          billingData,
          // historyData,
          chatsData,
          itemsData,
          productsData,
        ] = await Promise.all([
          getDashboardStats(),
          getBillingInfo(),
          // getPriceHistory(),
          getRecentChats(),
          getTrackedItems(),
          getTrendingProducts(),
        ]);

        setStats(statsData);
        setBillingInfo(billingData);
        // setPriceHistory(historyData);
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

  // useEffect(() => {
  //   const fetchRecentChats = async () => {
  //     try {
  //       const response = await fetch('/api/recent-chats'); 
  //       const data = await response.json();
  //       // Ensure data is an array before setting state
  //       setRecentChats(Array.isArray(data) ? data : []); 
  //     } catch (error) {
  //       console.error('Error fetching recent chats:', error);
  //       setRecentChats([]);
  //     }
  //   };

  //   fetchRecentChats();
  // }, []);

  // useEffect(() => {
  //   const fetchUserName = async () => {
  //     try {
  //       const response = await fetch('/api/user');
  //       const data = await response.json();
  //       setUserName(data.name || 'User');
  //     } catch (error) {
  //       console.error('Error fetching user name:', error);
  //     }
  //   };

  //   fetchUserName();
  // }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-[#111111]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          {isLoading ? (
            <>
              <div className="h-8 w-64 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse mb-2"></div>
              <div className="h-4 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
            </>
          ) : (
            <>
              <h1 className="text-xl sm:text-2xl font-medium bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-white/70 text-transparent bg-clip-text">
                Welcome back, {user.first_name}! 👋
              </h1>
              <p className="text-sm text-gray-500 dark:text-white/50 mt-1">
                Overview of your tracking and chat activities
              </p>
            </>
          )}
        </div>

        {/* Credits Status Banner */}
        {!isLoading && billingInfo.remainingCredits < 500 && (
          <div className={cn(
            "mb-6 sm:mb-8 rounded-xl p-4 border transition-colors",
            billingInfo.remainingCredits <= 0 
              ? "bg-red-600/10 dark:bg-red-600/10 border-red-600/20"
              : "bg-amber-500/10 dark:bg-amber-500/10 border-amber-500/20"
          )}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className={cn(
                  "p-2 rounded-lg",
                  billingInfo.remainingCredits <= 0 
                    ? "bg-red-600/10" 
                    : "bg-amber-500/10"
                )}>
                  {billingInfo.remainingCredits <= 0 ? (
                    <Ban className="w-5 h-5 text-red-600" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-500" />
                  )}
                </div>
                <div>
                  <h2 className="text-base font-medium text-gray-900 dark:text-white/90">
                    {billingInfo.remainingCredits <= 0 
                      ? "Out of Credits!" 
                      : "Credits Running Low!"}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-white/70">
                    {billingInfo.remainingCredits <= 0
                      ? "Your account has no remaining credits"
                      : `Only ${billingInfo.remainingCredits} credits left`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Link 
                  href="/settings/billing"
                  className={cn(
                    "group relative w-full sm:w-auto px-4 py-1.5 hover:shadow-lg transition-all duration-200 rounded-lg text-sm font-medium text-white",
                    billingInfo.remainingCredits <= 0
                      ? "bg-red-600 hover:bg-red-700 hover:shadow-red-600/20"
                      : "bg-amber-600 hover:bg-amber-700 hover:shadow-amber-600/20"
                  )}
                >
                  {billingInfo.remainingCredits <= 0 ? "Buy Credits" : "Top Up Now"}
                  <span className="absolute -top-8 right-0 w-max opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded pointer-events-none">
                    {billingInfo.remainingCredits <= 0
                      ? "Purchase credits to continue using services"
                      : "Add more credits to maintain access"}
                  </span>
                </Link>
              </div>
            </div>
          </div>
        )}
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {isLoading ? (
            <>
              {[1, 2, 3].map((index) => (
                <div key={index} className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-white/10 p-4 sm:p-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-2"></div>
                      <div className="h-6 w-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
              <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-white/10 p-4 sm:p-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="p-2 sm:p-3 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
                    <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-white/50">Credits Left</p>
                    <p className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white/90">
                      {billingInfo.remainingCredits}
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
            </>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Credit Usage */}
            <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-white/10 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white/90">
                  Credit Usage
                </h2>
                <div className="text-sm text-gray-500 dark:text-white/60">
                  {billingInfo.usedCredits.toLocaleString()} / {billingInfo.totalCredits.toLocaleString()}
                </div>
              </div>

              <div className="space-y-4">
                {/* Progress Bar */}
                <div className="relative w-full h-4 bg-gray-100 dark:bg-[#222] rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "absolute left-0 top-0 h-full transition-all duration-500",
                      billingInfo.remainingCredits <= 0 
                        ? "bg-red-500" 
                        : billingInfo.remainingCredits < 500 
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                    )}
                    style={{ 
                      width: `${Math.min((billingInfo.usedCredits / billingInfo.totalCredits) * 100, 100)}%` 
                    }}
                  />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-white/60 mb-1">Used Credits</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white/90">
                      {billingInfo.usedCredits.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-white/60 mb-1">Remaining</p>
                    <p className={cn(
                      "text-lg font-semibold",
                      billingInfo.remainingCredits <= 0 
                        ? "text-red-500" 
                        : billingInfo.remainingCredits < 500 
                          ? "text-amber-500"
                          : "text-emerald-500"
                    )}>
                      {billingInfo.remainingCredits.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tracked Items */}
            <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-white/10 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white/90">
                  Tracked Items
                </h2>
              </div>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((index) => (
                    <div key={index} className="flex items-center gap-4 p-3 rounded-lg border border-gray-200 dark:border-white/10">
                      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                      <div className="flex-1">
                        <div className="h-4 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-2"></div>
                        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {trackedItems.map((item) => (
                    <Link
                      key={item.id}
                      href={`/track/${item.id}`}
                      className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 dark:bg-white/5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                    >
                      <div className="relative w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 dark:text-white/90 text-sm sm:text-base truncate">
                          {item.product.name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                          <span className="text-xs sm:text-sm text-emerald-500 font-medium">
                            ${item.currentPrice}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-white/50">
                            Target: ${item.targetPrice}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6 sm:space-y-8">
            {/* Recent Chats */}
            <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-white/10 p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white/90 mb-4">
                Recent Chats
              </h2>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((index) => (
                    <div key={index} className="flex items-center gap-3 p-2">
                      <div className="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse"></div>
                      <div className="flex-1">
                        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-1"></div>
                        <div className="h-3 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : Array.isArray(recentChats) && recentChats.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {recentChats.map((chat) => (
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
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <MessageSquare className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600 mb-3" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">No recent chats available</p>
                </div>
              )}
            </div>

            {/* Trending Products */}
            <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-white/10 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white/90">
                  Trending Products
                </h2>
                <Link 
                  href="/marketplace" 
                  className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium"
                >
                  View all
                </Link>
              </div>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((index) => (
                    <div key={index} className="flex flex-col bg-gray-50 dark:bg-white/5 rounded-xl animate-pulse">
                      <div className="w-full h-32 bg-gray-200 dark:bg-gray-800 rounded-t-xl"></div>
                      <div className="p-3">
                        <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-800 rounded mb-2"></div>
                        <div className="h-4 w-1/4 bg-gray-200 dark:bg-gray-800 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {trendingProducts.map((product) => (
                    <Link
                      key={product.id}
                      href={`/marketplace/${product.id}`}
                      className="group block bg-gray-50 dark:bg-white/5 rounded-xl overflow-hidden transition-all duration-200 hover:shadow-lg dark:hover:shadow-emerald-500/10"
                    >
                      <div className="relative aspect-[4/3] w-full overflow-hidden">
                        <Image
                          src={product.image}
                          alt={product.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                        {product.trend && (
                          <div className={cn(
                            "absolute top-2 right-2 px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1",
                            product.trend === 'up' 
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                              : "bg-red-500/10 text-red-600 dark:text-red-400"
                          )}>
                            {product.trend === 'up' ? (
                              <ArrowUp className="w-3 h-3" />
                            ) : (
                              <ArrowDown className="w-3 h-3" />
                            )}
                            {product.trendValue}
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium text-gray-900 dark:text-white/90 text-sm truncate mb-1">
                          {product.title}
                        </h3>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold">
                            ₦{new Intl.NumberFormat().format(product.price)}
                          </span>
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <Store className="w-3 h-3 mr-1" />
                            {product.source}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
