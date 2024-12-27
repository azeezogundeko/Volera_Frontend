'use client';

import { Trash2, Bell, BellOff, ArrowUp, ArrowDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface TrackedItem {
  id: string;
  title: string;
  currentPrice: number;
  targetPrice: number;
  image: string;
  url: string;
  dateAdded: string;
  notificationsEnabled: boolean;
}

const Page = () => {
  const [trackedItems, setTrackedItems] = useState<TrackedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  useEffect(() => {
    const handleSidebarChange = (e: CustomEvent) => {
      setIsSidebarExpanded(e.detail.expanded);
    };

    window.addEventListener('sidebarStateChange' as any, handleSidebarChange);
    return () => {
      window.removeEventListener('sidebarStateChange' as any, handleSidebarChange);
    };
  }, []);

  // Simulate fetching tracked items
  useEffect(() => {
    const fetchTrackedItems = async () => {
      setLoading(true);
      try {
        // This would be replaced with an actual API call
        const dummyItems: TrackedItem[] = [
          {
            id: '1',
            title: 'Apple MacBook Pro 14"',
            currentPrice: 1599,
            targetPrice: 1499,
            image: 'https://source.unsplash.com/random/800x600?macbook',
            url: '#',
            dateAdded: new Date().toISOString(),
            notificationsEnabled: true,
          },
          {
            id: '2',
            title: 'Sony WH-1000XM4 Wireless Headphones',
            currentPrice: 299,
            targetPrice: 249,
            image: 'https://source.unsplash.com/random/800x600?headphones',
            url: '#',
            dateAdded: new Date().toISOString(),
            notificationsEnabled: true,
          },
          {
            id: '3',
            title: 'Samsung 49" Odyssey G9 Gaming Monitor',
            currentPrice: 1299,
            targetPrice: 999,
            image: 'https://source.unsplash.com/random/800x600?monitor',
            url: '#',
            dateAdded: new Date().toISOString(),
            notificationsEnabled: false,
          },
        ];
        setTrackedItems(dummyItems);
      } catch (error) {
        console.error('Error fetching tracked items:', error);
        toast.error('Failed to load tracked items');
      } finally {
        setLoading(false);
      }
    };

    fetchTrackedItems();
  }, []);

  const removeItem = async (id: string) => {
    try {
      // This would be replaced with an actual API call
      setTrackedItems(prev => prev.filter(item => item.id !== id));
      toast.success('Item removed from tracking');
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item');
    }
  };

  const toggleNotifications = async (id: string) => {
    try {
      setTrackedItems(prev =>
        prev.map(item =>
          item.id === id
            ? { ...item, notificationsEnabled: !item.notificationsEnabled }
            : item
        )
      );
      toast.success('Notification settings updated');
    } catch (error) {
      console.error('Error toggling notifications:', error);
      toast.error('Failed to update notification settings');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#111111]">
      {/* Header */}
      <header className={`fixed top-0 right-0 z-40 transition-all duration-300 ${
        isSidebarExpanded ? 'left-[280px]' : 'left-24'
      }`}>
        {/* Gradient Border */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gray-200 dark:via-[#333] to-transparent" />
        
        {/* Backdrop */}
        <div className="absolute inset-0 bg-white/90 dark:bg-[#111111]/90 backdrop-blur-xl -z-10" />

        <div className="max-w-[1200px] w-full mx-auto px-6">
          <div className="py-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-medium bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-white/70 text-transparent bg-clip-text">
                    Track
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-white/50 mt-1">
                    Monitor price changes for your favorite items
                  </p>
                </div>
                <div className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                  <span className="text-sm text-gray-500 dark:text-white/50">
                    {trackedItems.length} items
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-[1200px] w-full mx-auto px-6 pt-[100px] transition-all duration-300">
        {trackedItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-4">
              <Bell className="w-8 h-8 text-gray-400 dark:text-white/40" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white/90 mb-2">
              No items tracked yet
            </h3>
            <p className="text-sm text-gray-500 dark:text-white/50">
              Start tracking items to get notified when prices drop
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-gray-200 dark:border-[#222]">
            <table id="track-items-table" className="w-full text-sm table-fixed">
              <thead>
                <tr className="bg-gray-50 dark:bg-[#111111] border-b border-gray-200 dark:border-[#222]">
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 dark:text-white/50 uppercase tracking-wider w-[35%]">
                    Product
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 dark:text-white/50 uppercase tracking-wider w-[12.5%]">
                    Current Price
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 dark:text-white/50 uppercase tracking-wider w-[12.5%]">
                    Target Price
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 dark:text-white/50 uppercase tracking-wider w-[25%]">
                    Status
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 dark:text-white/50 uppercase tracking-wider w-[7.5%]">
                    Alerts
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 dark:text-white/50 uppercase tracking-wider w-[7.5%]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-[#111111] divide-y divide-gray-200 dark:divide-[#222]">
                {trackedItems.map((item) => (
                  <tr 
                    key={item.id}
                    className="hover:bg-gray-50 dark:hover:bg-[#111111] transition-colors"
                  >
                    <td className="px-4 py-4">
                      <Link href={`/track/${item.id}`} className="hover:opacity-80 transition-opacity">
                        <div className="text-sm font-medium text-gray-900 dark:text-white/90 truncate">
                          {item.title}
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900 dark:text-white/90">
                        ${item.currentPrice}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-emerald-500 font-medium">
                        ${item.targetPrice}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className={cn(
                        "flex items-center gap-1 text-sm",
                        item.currentPrice > item.targetPrice
                          ? "text-red-500"
                          : "text-emerald-500"
                      )}>
                        {item.currentPrice > item.targetPrice ? (
                          <>
                            <ArrowUp className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">${(item.currentPrice - item.targetPrice).toFixed(2)} above target</span>
                          </>
                        ) : (
                          <>
                            <ArrowDown className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">${(item.targetPrice - item.currentPrice).toFixed(2)} below target</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-center">
                        <button
                          onClick={() => toggleNotifications(item.id)}
                          className={cn(
                            "p-2 rounded-lg transition-colors",
                            item.notificationsEnabled
                              ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500"
                              : "bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-white/40"
                          )}
                        >
                          {item.notificationsEnabled ? (
                            <Bell className="w-5 h-5" />
                          ) : (
                            <BellOff className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-center">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-500 transition-colors hover:bg-red-100 dark:hover:bg-red-500/20"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
