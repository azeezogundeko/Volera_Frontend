'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, MessageSquare, Trash2, Calendar, ExternalLink } from 'lucide-react';
import ProductCard from '@/components/marketplace/ProductCard';
import Link from 'next/link';
import Image from 'next/image';
import process from 'process';
import LoadingPage from '@/components/LoadingPage';

interface SavedProduct {
  product_id: string;
  name: string;
  current_price: number;
  original_price: number;
  brand: string;
  discount: number;
  rating: number;
  reviews_count: string;
  image: string;
  url: string;
  currency: string;
  source: string;
  dateAdded: string;
}

interface SavedChat {
  id: string;
  title: string;
  preview: string;
  dateAdded: string;
  url: string;
}

export default function WishlistPage() {
  const [savedProducts, setSavedProducts] = useState<SavedProduct[]>([]);
  const [savedChats, setSavedChats] = useState<SavedChat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const params = new URLSearchParams();
        params.set('limit', '10');
        let token;
        if (typeof window !== 'undefined') {
          token = localStorage.getItem('auth_token'); // Retrieve the token
        }
        const productsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/saved_products?${params.toString()}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const chatsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chats/saved_chats?${params.toString()}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const productsData = await productsResponse.json();
        const chatsData = await chatsResponse.json();
    
        setSavedProducts(productsData);
        setSavedChats(chatsData.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (!mounted || isLoading) {
    return <LoadingPage />;
  }

  const removeProduct = async (productId: string) => {
    let token;
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('auth_token'); 
    }
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/unsave_product/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        setSavedProducts(prev => {
          const updated = prev.filter(p => p.product_id !== productId);
          return updated;
        });
      } else {
        console.error('Failed to remove product');
      }
    } catch (error) {
      console.error('Error removing product:', error);
    }
  };

  const removeChat = async (chatId: string) => {
    let token;
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('auth_token'); 
    }
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chats/unstar_chat/${chatId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        setSavedChats(prev => {
          const updated = prev.filter(c => c.id !== chatId);
          return updated;
        });
      } else {
        console.error('Failed to remove chat');
      }
    } catch (error) {
      console.error('Error removing chat:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
      {/* Header */}
      <div className="bg-white dark:bg-[#141414] border-b border-gray-200 dark:border-[#222]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <Heart className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white/90">My Wishlist</h1>
            </div>
            <p className="text-gray-500 dark:text-gray-400 ml-10">Keep track of products and conversations you&apos;re interested in</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="mb-8 p-1 bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#222] rounded-lg shadow-sm">
            <TabsTrigger 
              value="products" 
              className="flex items-center gap-2 px-6 py-2.5 data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 dark:data-[state=active]:bg-emerald-500/10 dark:data-[state=active]:text-emerald-400"
            >
              <Heart className="w-4 h-4" />
              Saved Products ({savedProducts.length})
            </TabsTrigger>
            <TabsTrigger 
              value="chats" 
              className="flex items-center gap-2 px-6 py-2.5 data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 dark:data-[state=active]:bg-emerald-500/10 dark:data-[state=active]:text-emerald-400"
            >
              <MessageSquare className="w-4 h-4" />
              Starred Chats ({savedChats.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="focus-visible:outline-none">
            {savedProducts.length > 0 ? (
              <div className="bg-white dark:bg-[#141414] rounded-lg border border-gray-200 dark:border-[#222] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-[#222]">
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Product</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Price</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Source</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Date Added</th>
                        <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-[#222]">
                      {savedProducts.map((product) => (
                        <tr key={product.product_id} className="group hover:bg-gray-50 dark:hover:bg-[#1a1a1a]">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-[#1a1a1a] overflow-hidden flex-shrink-0">
                                <Image src={product.image} alt={product.name} width={400} height={400} />
                              </div>
                              <div>
                                <Link 
                                  href={`/marketplace/${product.product_id}`}
                                  className="text-sm font-medium text-gray-900 dark:text-white/90 hover:text-emerald-600 dark:hover:text-emerald-400"
                                >
                                  {product.name}
                                </Link>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{product.brand}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-gray-900 dark:text-white/90">
                                {product.currency}{product.current_price}
                              </span>
                              {product.discount > 0 && (
                                <span className="text-xs text-emerald-600 dark:text-emerald-400">
                                  {product.discount}% OFF
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-600 dark:text-gray-300">{product.source}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                              {new Date(product.dateAdded).toLocaleDateString()}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <a
                                href={product.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                                title="View on site"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                              <button
                                onClick={() => removeProduct(product.product_id)}
                                className="p-2 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                                title="Remove from wishlist"
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
              </div>
            ) : (
              <div className="bg-white dark:bg-[#141414] rounded-lg border border-gray-200 dark:border-[#222] shadow-sm p-12">
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white/90 mb-2">No saved products yet</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">Start saving products you&apos;re interested in to track them here</p>
                  <Link
                    href="/marketplace"
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 transition-colors"
                  >
                    Browse Marketplace
                  </Link>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="chats" className="focus-visible:outline-none">
            {savedChats.length > 0 ? (
              <div className="space-y-4">
                {savedChats.map((chat) => (
                  <div
                    key={chat.id}
                    className="bg-white dark:bg-[#141414] rounded-lg border border-gray-200 dark:border-[#222] shadow-sm p-6 relative group animate-fadeIn hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white/90 mb-2">
                          {chat.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{chat.preview}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(chat.dateAdded).toLocaleDateString()}</span>
                          </div>
                          <a
                            href={chat.url}
                            className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span>View Chat</span>
                          </a>
                        </div>
                      </div>
                      <button
                        onClick={() => removeChat(chat.id)}
                        className="p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full"
                        title="Remove chat"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-[#141414] rounded-lg border border-gray-200 dark:border-[#222] shadow-sm p-12">
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white/90 mb-2">No saved chats yet</h3>
                  <p className="text-gray-500 dark:text-gray-400">Interesting conversations you save will appear here</p>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}