'use client';

import { Trash2, Bell, BellOff, ArrowUp, ArrowDown, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import AddItemModal from '@/components/AddItemModal';
import { getAllTrackedItems } from '@/lib/api';
import LoadingPage from '@/components/LoadingPage';
import { useApi } from '@/lib/hooks/useApi';

interface ProductResponse {
  name: string;
  current_price: number;
  original_price: number;
  brand: string;
  discount: number;
  rating: number;
  reviews_count: number;
  product_id: string;
  image: string;
  relevance_score: number;
  url: string;
  currency: string;
  source: string;
}

interface TrackedItem {
  id: string;
  targetPrice: number;
  currentPrice: number;
  product: ProductResponse;
  dateAdded: string;
  notificationsEnabled: boolean;
}

export default function TrackPage() {
  const { fetchWithAuth } = useApi();
  const [trackedItems, setTrackedItems] = useState<TrackedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [trackingData, setTrackingData] = useState(null);

  useEffect(() => {
    setMounted(true);
    const fetchTrackedItems = async () => {
      try {
        setLoading(true);
        const items = await getAllTrackedItems();
        setTrackedItems(items);
      } catch (error) {
        console.error('Error fetching tracked items:', error);
        toast.error('Failed to load tracked items. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    const fetchTrackingData = async () => {
      try {
        const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/tracking/data`);
        const data = await response.json();
        setTrackingData(data);
      } catch (error) {
        console.error('Failed to fetch tracking data:', error);
      }
    };

    fetchTrackedItems();
    fetchTrackingData();
  }, []);

  const removeItem = async (id: string) => {
    try {
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

  if (!mounted || loading) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
      {/* Header */}
      <div className="bg-white dark:bg-[#141414] border-b border-gray-200 dark:border-[#222]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <Bell className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white/90">Track Prices</h1>
            </div>
            <p className="text-gray-500 dark:text-gray-400 ml-10">Monitor price changes and get alerts for your saved items</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-[#141414] rounded-lg border border-gray-200 dark:border-[#222] shadow-sm overflow-hidden">
          {trackedItems.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-[#222]">
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Product</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Current Price</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Target Price</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-[#222]">
                  {trackedItems.map((item) => (
                    <tr key={item.id} className="group hover:bg-gray-50 dark:hover:bg-[#1a1a1a]">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-[#1a1a1a] overflow-hidden flex-shrink-0">
                            <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <Link 
                              href={`/track/${item.id}`}
                              className="text-sm font-medium text-gray-900 dark:text-white/90 hover:text-emerald-600 dark:hover:text-emerald-400"
                            >
                              {item.product.name}
                            </Link>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{item.product.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-900 dark:text-white/90">
                          {item.product.currency}{item.currentPrice}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                          {item.product.currency}{item.targetPrice}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className={cn(
                          "flex items-center gap-1 text-sm",
                          item.currentPrice > item.targetPrice
                            ? "text-red-500"
                            : "text-emerald-500"
                        )}>
                          {item.currentPrice > item.targetPrice ? (
                            <>
                              <ArrowUp className="w-4 h-4" />
                              <span>{item.product.currency}{(item.currentPrice - item.targetPrice).toFixed(2)} above</span>
                            </>
                          ) : (
                            <>
                              <ArrowDown className="w-4 h-4" />
                              <span>{item.product.currency}{(item.targetPrice - item.currentPrice).toFixed(2)} below</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => toggleNotifications(item.id)}
                            className={cn(
                              "p-2 rounded-lg transition-colors",
                              item.notificationsEnabled
                                ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500"
                                : "bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-500"
                            )}
                            title="Toggle notifications"
                          >
                            {item.notificationsEnabled ? (
                              <Bell className="w-4 h-4" />
                            ) : (
                              <BellOff className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center p-12">
              <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white/90 mb-2">No tracked items yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Start tracking items to get price drop notifications</p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 transition-colors"
              >
                Add Item
              </button>
              <AddItemModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}