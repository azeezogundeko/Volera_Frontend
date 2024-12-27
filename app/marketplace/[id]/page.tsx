'use client';

import React, { useState } from 'react';
import { 
  Star, 
  Store, 
  ExternalLink, 
  ChevronLeft, 
  Heart,
  Share2,
  BarChart2,
  Bell,
  Info,
  ZoomIn
} from 'lucide-react';
import Link from 'next/link';
import ImageModal from '@/components/marketplace/ImageModal';
import PriceWatchModal from '@/components/marketplace/PriceWatchModal';
import ReviewSection from '@/components/marketplace/ReviewSection';

// This would typically come from an API
const dummyProduct = {
  id: 1,
  title: 'Sony WH-1000XM4 Wireless Noise-Canceling Headphones',
  description: 'Industry-leading noise canceling with Dual Noise Sensor technology. Next-level music with Edge-AI, co-developed with Sony Music Studios Tokyo.',
  image: '/images/products/headphones.jpg',
  price: 348,
  rating: 4.8,
  stores: [
    { name: 'Amazon', price: 348.00, link: '#' },
    { name: 'Best Buy', price: 349.99, link: '#' },
    { name: 'Target', price: 349.99, link: '#' },
  ],
  specifications: {
    'Battery Life': 'Up to 30 hours',
    'Bluetooth': '5.0',
    'Weight': '254g',
    'Color': 'Black',
    'Noise Cancellation': 'Active',
    'Microphone': 'Built-in',
    'Connectivity': 'Wireless',
    'Charging Time': '3 hours',
  },
  features: [
    'Industry-leading noise cancellation',
    'Exceptional sound quality',
    'Long battery life',
    'Multi-device pairing',
    'Touch sensor controls',
    'Speak-to-chat technology',
    'Wearing detection',
    'Adaptive sound control'
  ],
  priceHistory: [
    { date: '2023-12-01', price: 349.99 },
    { date: '2023-12-15', price: 348.00 },
    { date: '2024-01-01', price: 349.99 },
    { date: '2024-01-15', price: 348.00 },
  ],
  reviews: [
    {
      id: 1,
      user: {
        name: 'John Smith',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
      },
      rating: 5,
      date: '2024-01-15',
      content: 'These headphones are amazing! The noise cancellation is top-notch, and the sound quality is incredible. Battery life is exactly as advertised, and the build quality feels premium. Definitely worth the investment.',
      helpful: 45,
      verified: true,
      source: {
        name: 'Amazon',
        logo: '/images/stores/amazon.png',
        url: '#'
      }
    },
    {
      id: 2,
      user: {
        name: 'Sarah Johnson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      },
      rating: 4,
      date: '2024-01-10',
      content: 'Great headphones overall. The sound quality is excellent, and they\'re very comfortable for long listening sessions. The only minor issue is that the touch controls can be a bit sensitive sometimes.',
      helpful: 32,
      verified: true,
      source: {
        name: 'Best Buy',
        logo: '/images/stores/bestbuy.png',
        url: '#'
      },
      replies: [
        {
          id: 21,
          user: {
            name: 'Sony Support',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sony',
          },
          rating: 5,
          date: '2024-01-11',
          content: 'Thank you for your feedback! The touch control sensitivity can be adjusted in the Sony Headphones app. Please reach out to our support team if you need assistance.',
          helpful: 15,
          source: {
            name: 'Best Buy',
            logo: '/images/stores/bestbuy.png',
            url: '#'
          }
        },
      ],
    },
    {
      id: 3,
      user: {
        name: 'Michael Chen',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
      },
      rating: 5,
      date: '2024-01-05',
      content: 'Perfect for both work and travel. The noise cancellation helps me focus during work calls, and the multi-device pairing is seamless. The speak-to-chat feature is particularly useful.',
      helpful: 28,
      verified: true,
      source: {
        name: 'Target',
        logo: '/images/stores/target.png',
        url: '#'
      }
    },
    {
      id: 4,
      user: {
        name: 'Emily Wilson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
      },
      rating: 3,
      date: '2024-01-01',
      content: 'Good sound quality but the app could be better. Sometimes it disconnects randomly and needs to be re-paired. Battery life is good though.',
      helpful: 20,
      verified: true,
      source: {
        name: 'Amazon',
        logo: '/images/stores/amazon.png',
        url: '#'
      },
      replies: [
        {
          id: 41,
          user: {
            name: 'Sony Support',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sony',
          },
          rating: 5,
          date: '2024-01-02',
          content: 'We\'re sorry to hear about the connectivity issues. Please ensure you have the latest firmware installed. Our support team can help troubleshoot these issues.',
          helpful: 8,
          source: {
            name: 'Amazon',
            logo: '/images/stores/amazon.png',
            url: '#'
          }
        },
      ],
    },
  ],
};

export default function ProductPage({ params }: { params: { id: string } }) {
  const [activeImage, setActiveImage] = useState(0);
  const [isWatchingPrice, setIsWatchingPrice] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isPriceWatchModalOpen, setIsPriceWatchModalOpen] = useState(false);

  // In a real app, we would fetch the product data based on the ID
  const product = dummyProduct;

  const images = [
    product.image,
    '/images/products/headphones-2.jpg',
    '/images/products/headphones-3.jpg',
  ];

  const handlePriceWatchSubmit = (data: {
    targetPrice: number;
    selectedStores: string[];
    notifyEmail: boolean;
    notifyPush: boolean;
  }) => {
    console.log('Price watch data:', data);
    setIsWatchingPrice(true);
    // Here you would typically send this data to your backend
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#111111]">
      {/* Image Modal */}
      <ImageModal
        images={images}
        activeIndex={activeImage}
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
      />

      {/* Price Watch Modal */}
      <PriceWatchModal
        isOpen={isPriceWatchModalOpen}
        onClose={() => setIsPriceWatchModalOpen(false)}
        stores={product.stores}
        onSubmit={handlePriceWatchSubmit}
      />

      <div className="max-w-[1200px] w-full mx-auto px-6 py-6">
        {/* Back Button */}
        <Link 
          href="/marketplace"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white/90 mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Marketplace
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Images */}
          <div className="space-y-6">
            {/* Main Image */}
            <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-[#1a1a1a] group">
              <img
                src={images[activeImage]}
                alt={product.title}
                className="w-full h-full object-cover cursor-zoom-in"
                onClick={() => setIsImageModalOpen(true)}
              />
              <button
                onClick={() => setIsImageModalOpen(true)}
                className="absolute bottom-4 right-4 p-2 bg-black/50 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-3 gap-4">
              {images.map((image, index) => (
                <button
                  key={index}
                  className={`aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-[#1a1a1a] ${
                    activeImage === index ? 'ring-2 ring-emerald-500' : ''
                  }`}
                  onClick={() => setActiveImage(index)}
                >
                  <img
                    src={image}
                    alt={`${product.title} - View ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                {product.title}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="text-gray-600 dark:text-white/60">
                    {product.rating}
                  </span>
                </div>
                <span className="text-sm text-gray-500 dark:text-white/50">
                  ID: {product.id}
                </span>
              </div>
            </div>

            {/* Price and Actions */}
            <div className="space-y-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-semibold text-gray-900 dark:text-white">
                  ${Math.min(...product.stores.map(store => store.price)).toFixed(2)}
                </span>
                <span className="text-sm text-gray-500 dark:text-white/50">
                  from {product.stores.length} stores
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-white/90">
                  <Heart className="w-5 h-5" />
                  Save
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-white/90">
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
                <button 
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    isWatchingPrice 
                      ? 'bg-emerald-500/10 text-emerald-500' 
                      : 'bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-white/90'
                  }`}
                  onClick={() => setIsPriceWatchModalOpen(true)}
                >
                  <Bell className="w-5 h-5" />
                  {isWatchingPrice ? 'Watching Price' : 'Watch Price'}
                </button>
              </div>
            </div>

            {/* Store Links */}
            <div className="space-y-3">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Available at
              </h2>
              {product.stores.map((store, index) => (
                <a
                  key={index}
                  href={store.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-[#222] hover:border-gray-300 dark:hover:border-[#333] group"
                >
                  <div className="flex items-center gap-3">
                    <Store className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:text-white/40 dark:group-hover:text-white/60" />
                    <span className="font-medium text-gray-900 dark:text-white group-hover:text-emerald-500 dark:group-hover:text-emerald-400">
                      {store.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-900 dark:text-white">
                      ${store.price.toFixed(2)}
                    </span>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:text-white/40 dark:group-hover:text-white/60" />
                  </div>
                </a>
              ))}
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                About this item
              </h2>
              <p className="text-gray-600 dark:text-white/60 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Features */}
            <div className="space-y-3">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Key Features
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.features.map((feature, index) => (
                  <li 
                    key={index}
                    className="flex items-start gap-2 text-gray-600 dark:text-white/60"
                  >
                    <Info className="w-5 h-5 flex-shrink-0 mt-0.5 text-emerald-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Specifications */}
            <div className="space-y-3">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Specifications
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex flex-col">
                    <span className="text-sm text-gray-500 dark:text-white/50">
                      {key}
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price History */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  Price History
                </h2>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-white/50">
                  <BarChart2 className="w-4 h-4" />
                  Last 30 days
                </div>
              </div>
              <div className="h-48 bg-gray-50 dark:bg-white/5 rounded-lg p-4">
                {/* Price history chart would go here */}
                <div className="flex items-center justify-center h-full text-gray-400 dark:text-white/40">
                  Price history chart coming soon
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <ReviewSection reviews={product.reviews} />
        </div>
      </div>
    </div>
  );
}
