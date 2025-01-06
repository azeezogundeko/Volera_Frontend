'use client';

import { ArrowLeft, Bell, BellOff, ArrowUp, ArrowDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  Tick,
} from 'chart.js';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Dummy data for price history
const generatePriceHistory = (currentPrice: number, days: number) => {
  const data = [];
  let price = currentPrice;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Add some random variation to the price
    price = price + (Math.random() - 0.5) * 20;
    
    data.push({
      date: date.toISOString().split('T')[0],
      price: Math.max(0, price),
    });
  }
  
  return data;
};

interface Product {
  id: string;
  title: string;
  description: string;
  currentPrice: number;
  targetPrice: number;
  notificationsEnabled: boolean;
  image: string;
  url: string;
  specs?: { label: string; value: string }[];
  features?: string[];
}

const ProductPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [priceHistory, setPriceHistory] = useState<{ date: string; price: number }[]>([]);
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

  useEffect(() => {
    // In a real app, fetch product data from an API
    // For now, using dummy data
    const dummyProduct: Product = {
      id: params.id,
      title: 'Apple MacBook Pro 14"',
      description: "The most powerful MacBook Pro ever is here. With the blazing-fast M1 Pro or M1 Max chip — the first Apple silicon designed for pros — you get groundbreaking performance and amazing battery life.",
      currentPrice: 1599,
      targetPrice: 1499,
      notificationsEnabled: true,
      image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-spacegray-select-202310?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1697311054290",
      url: "https://www.apple.com/shop/buy-mac/macbook-pro/14-inch",
      specs: [
        { label: "Processor", value: "Apple M1 Pro" },
        { label: "Memory", value: "16GB unified memory" },
        { label: "Storage", value: "512GB SSD" },
        { label: "Display", value: "14-inch Liquid Retina XDR display" },
      ],
      features: [
        "Up to 17 hours of battery life",
        "16-core Neural Engine",
        "14-inch Liquid Retina XDR display",
        "Three Thunderbolt 4 ports",
      ],
    };

    setProduct(dummyProduct);
    setPriceHistory(generatePriceHistory(dummyProduct.currentPrice, 30));
  }, [params.id]);

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-gray-200 dark:border-[#333] border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  const chartData = {
    labels: priceHistory.map(entry => entry.date),
    datasets: [
      {
        label: 'Price History',
        data: priceHistory.map(entry => entry.price),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          color: '#f3f4f6',
        },
        ticks: {
          callback: (tickValue: string | number, index: number, ticks: Tick[]) => {
            return tickValue.toString();
          }
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#111111]">
      <div className="max-w-[1200px] w-full mx-auto px-4 sm:px-6 py-6">
        {/* Back Button and Title */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-500 dark:text-white/50" />
          </button>
          <div>
            <h1 className="text-xl font-medium text-gray-900 dark:text-white/90">
              Product Details
            </h1>
            <p className="text-sm text-gray-500 dark:text-white/50">
              View detailed information and price history
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Card */}
            <div className="p-4 sm:p-6 rounded-xl border border-gray-200 dark:border-[#222] bg-white dark:bg-[#111111]">
              <div className="flex flex-col sm:flex-row gap-6">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full sm:w-40 h-40 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <h2 className="text-xl font-medium text-gray-900 dark:text-white/90 mb-2">
                    {product.title}
                  </h2>
                  <p className="text-gray-500 dark:text-white/50 mb-4">
                    {product.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-4">
                    <div>
                      <div className="text-sm text-gray-500 dark:text-white/50">Current Price</div>
                      <div className="text-2xl font-medium text-gray-900 dark:text-white/90">
                        ${product.currentPrice}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-white/50">Target Price</div>
                      <div className="text-2xl font-medium text-emerald-500">
                        ${product.targetPrice}
                      </div>
                    </div>
                    <div className="w-full sm:w-auto sm:ml-auto mt-4 sm:mt-0">
                      <Link
                        href={product.url}
                        target="_blank"
                        className="block w-full sm:w-auto text-center px-4 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
                      >
                        Visit Store
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Price History Graph */}
            <div className="p-4 sm:p-6 rounded-xl border border-gray-200 dark:border-[#222] bg-white dark:bg-[#111111]">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white/90 mb-4">
                Price History
              </h3>
              <div className="h-[300px]">
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>

            {/* Specifications */}
            {product.specs && (
              <div className="p-4 sm:p-6 rounded-xl border border-gray-200 dark:border-[#222] bg-white dark:bg-[#111111]">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white/90 mb-4">
                  Specifications
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {product.specs.map((spec, index) => (
                    <div key={index} className="flex flex-col">
                      <div className="text-sm text-gray-500 dark:text-white/50">
                        {spec.label}
                      </div>
                      <div className="text-gray-900 dark:text-white/90">
                        {spec.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Features and Actions */}
          <div className="space-y-6">
            {/* Features */}
            {product.features && (
              <div className="p-4 sm:p-6 rounded-xl border border-gray-200 dark:border-[#222] bg-white dark:bg-[#111111]">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white/90 mb-4">
                  Key Features
                </h3>
                <ul className="space-y-3">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="text-gray-500 dark:text-white/50">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="p-4 sm:p-6 rounded-xl border border-gray-200 dark:border-[#222] bg-white dark:bg-[#111111]">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white/90 mb-4">
                Actions
              </h3>
              <div className="space-y-4">
                <button
                  onClick={() => {
                    setProduct(prev => prev ? {
                      ...prev,
                      notificationsEnabled: !prev.notificationsEnabled
                    } : null);
                  }}
                  className={cn(
                    "w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors",
                    product.notificationsEnabled
                      ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 hover:bg-emerald-100 dark:hover:bg-emerald-500/20"
                      : "bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-white/50 hover:bg-gray-200 dark:hover:bg-white/10"
                  )}
                >
                  {product.notificationsEnabled ? (
                    <>
                      <Bell className="w-5 h-5" />
                      <span>Notifications Enabled</span>
                    </>
                  ) : (
                    <>
                      <BellOff className="w-5 h-5" />
                      <span>Enable Notifications</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
