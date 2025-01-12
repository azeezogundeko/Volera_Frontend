'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, MessageSquare, Trash2, Calendar, ExternalLink } from 'lucide-react';
import ProductCard from '@/components/marketplace/ProductCard';
import Link from 'next/link';

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
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('savedProducts');
    const savedChatsData = localStorage.getItem('savedChats');
    setSavedProducts(saved ? JSON.parse(saved) : []);
    setSavedChats(savedChatsData ? JSON.parse(savedChatsData) : []);
    setIsLoaded(true);
  }, []);

  const removeProduct = (productId: string) => {
    setSavedProducts(prev => {
      const updated = prev.filter(p => p.product_id !== productId);
      localStorage.setItem('savedProducts', JSON.stringify(updated));
      return updated;
    });
  };

  const removeChat = (chatId: string) => {
    setSavedChats(prev => {
      const updated = prev.filter(c => c.id !== chatId);
      localStorage.setItem('savedChats', JSON.stringify(updated));
      return updated;
    });
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <Heart className="w-7 h-7 text-emerald-600" />
              <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
            </div>
            <p className="text-gray-500 ml-10">Keep track of products and conversations you're interested in</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="mb-8 p-1 bg-white border border-gray-200 rounded-lg shadow-sm">
            <TabsTrigger 
              value="products" 
              className="flex items-center gap-2 px-6 py-2.5 data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700"
            >
              <Heart className="w-4 h-4" />
              Saved Products ({savedProducts.length})
            </TabsTrigger>
            <TabsTrigger 
              value="chats" 
              className="flex items-center gap-2 px-6 py-2.5 data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700"
            >
              <MessageSquare className="w-4 h-4" />
              Saved Chats ({savedChats.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="focus-visible:outline-none">
            {savedProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {savedProducts.map((product) => (
                  <div key={product.product_id} className="relative group animate-fadeIn">
                    <ProductCard product={product} />
                    <button
                      onClick={() => removeProduct(product.product_id)}
                      className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-12">
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No saved products yet</h3>
                  <p className="text-gray-500 mb-6">Start saving products you're interested in to track them here</p>
                  <Link
                    href="/marketplace"
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
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
                    className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 relative group animate-fadeIn hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          {chat.title}
                        </h3>
                        <p className="text-gray-600 mb-3 line-clamp-2">{chat.preview}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(chat.dateAdded).toLocaleDateString()}</span>
                          </div>
                          <a
                            href={chat.url}
                            className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700"
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span>View Chat</span>
                          </a>
                        </div>
                      </div>
                      <button
                        onClick={() => removeChat(chat.id)}
                        className="p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 rounded-full"
                        title="Remove chat"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-12">
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No saved chats yet</h3>
                  <p className="text-gray-500">Interesting conversations you save will appear here</p>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
