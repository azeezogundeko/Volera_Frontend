'use client';

import { useState } from 'react';
import { 
  Camera, 
  Search, 
  X, 
  Sparkles, 
  ArrowRight, 
  Mic, 
  ImagePlus,
  ShoppingBag,
  Play,
  Globe,
  ExternalLink,
  ImageIcon
} from 'lucide-react';
import NextImage from 'next/image';
import { cn } from '@/lib/utils';
import { useTheme } from '@/app/contexts/ThemeContext';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  brand: string;
  rating: number;
  source: string;
  url: string;
}

interface AIInsight {
  priceRange: string;
  brandMatches: string[];
  sustainabilityScore: number;
  styleMatch: number;
}

interface Website {
  id: string;
  name: string;
  description: string;
  image: string;
  url: string;
  category: string;
}

export default function SnapSearchPage() {
  const { theme } = useTheme();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [insights, setInsights] = useState<AIInsight | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'products' | 'images' | 'videos' | 'websites'>('products');

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      // Trigger analysis
      analyzeImage(file);
    }
  };

  const analyzeImage = async (file: File) => {
    setIsAnalyzing(true);
    // TODO: Implement actual API call
    setTimeout(() => {
      setIsAnalyzing(false);
      setInsights({
        priceRange: "$50 - $200",
        brandMatches: ["Nike", "Adidas", "Puma"],
        sustainabilityScore: 8.5,
        styleMatch: 92
      });
      // Dummy similar products
      setSimilarProducts([
        {
          id: "1",
          name: "Premium Sports Shoe",
          price: 129.99,
          image: "https://source.unsplash.com/random/400x400/?sneaker",
          brand: "Nike",
          rating: 4.5,
          source: "Nike Store",
          url: "#"
        },
        // Add more dummy products...
      ]);
    }, 2000);
  };

  const removeImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setInsights(null);
    setSimilarProducts([]);
  };

  return (
    <div className={cn(
      "min-h-screen",
      theme === 'dark' ? "bg-[#0a0a0a]" : "bg-gray-50"
    )}>
      {/* Header */}
      <header className={cn(
        "sticky top-0 z-50 border-b",
        theme === 'dark' ? "bg-[#0a0a0a] border-white/10" : "bg-white border-gray-200"
      )}>
        <div className="max-w-[1600px] mx-auto px-4 py-3">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <h1 className={cn(
              "text-xl font-semibold bg-gradient-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent"
            )}>
              Snap & Search
            </h1>
            
            {/* Search Bar */}
            <div className="flex-1 w-full sm:w-auto max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products or upload an image..."
                  className={cn(
                    "w-full pl-10 pr-4 py-2 rounded-xl text-sm",
                    theme === 'dark' 
                      ? "bg-[#141414] border-[#222] text-white/90 placeholder:text-white/40"
                      : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-500",
                    "border focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  )}
                />
              </div>
            </div>

            {/* Profile Section */}
            <div className="flex items-center gap-3">
              <button className={cn(
                "p-2 rounded-full",
                theme === 'dark' ? "hover:bg-white/5" : "hover:bg-gray-100"
              )}>
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <span className="text-sm font-medium text-emerald-500">JD</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Panel - Photo Upload & Results */}
          <div className="w-full lg:w-[25%] flex flex-col gap-6">
            {/* Upload Section */}
            <div className={cn(
              "rounded-xl p-6 border",
              theme === 'dark'
                ? "bg-[#141414] border-[#222]"
                : "bg-white border-gray-200"
            )}>
              {!previewUrl ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className={cn(
                    "w-14 h-14 rounded-full flex items-center justify-center mb-4",
                    theme === 'dark' ? "bg-white/5" : "bg-gray-50"
                  )}>
                    <ImageIcon className="w-7 h-7 text-emerald-500" />
                  </div>
                  <h3 className={cn(
                    "text-base font-medium mb-2",
                    theme === 'dark' ? "text-white/90" : "text-gray-900"
                  )}>Upload Product Image</h3>
                  <p className={cn(
                    "text-xs text-center mb-4",
                    theme === 'dark' ? "text-white/60" : "text-gray-500"
                  )}>
                    Drag and drop or click to upload
                  </p>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <span className={cn(
                      "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium",
                      "bg-emerald-500 hover:bg-emerald-600 text-white"
                    )}>
                      <Camera className="w-4 h-4" />
                      Choose Image
                    </span>
                  </label>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className={cn(
                      "text-base font-medium",
                      theme === 'dark' ? "text-white/90" : "text-gray-900"
                    )}>Product Image</h3>
                    <button
                      onClick={removeImage}
                      className={cn(
                        "p-1.5 rounded-lg",
                        theme === 'dark' ? "hover:bg-white/5" : "hover:bg-gray-100"
                      )}
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                  <div className="relative aspect-square rounded-lg overflow-hidden mb-3">
                    <NextImage
                      src={previewUrl}
                      alt="Selected product"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button 
                    onClick={() => {/* Implement find similar */}}
                    className={cn(
                      "w-full px-4 py-2 rounded-lg text-sm font-medium",
                      "bg-emerald-500 hover:bg-emerald-600 text-white"
                    )}
                  >
                    Find Similar
                  </button>
                </div>
              )}
            </div>

            {/* AI Insights */}
            {insights && (
              <div className={cn(
                "rounded-xl p-6 border",
                theme === 'dark'
                  ? "bg-[#141414] border-[#222]"
                  : "bg-white border-gray-200"
              )}>
                <h3 className={cn(
                  "text-lg font-medium mb-4",
                  theme === 'dark' ? "text-white/90" : "text-gray-900"
                )}>AI Insights</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={cn(
                      "text-sm",
                      theme === 'dark' ? "text-white/60" : "text-gray-500"
                    )}>Price Range</span>
                    <span className={cn(
                      "text-sm font-medium",
                      theme === 'dark' ? "text-white/90" : "text-gray-900"
                    )}>{insights.priceRange}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={cn(
                      "text-sm",
                      theme === 'dark' ? "text-white/60" : "text-gray-500"
                    )}>Brand Matches</span>
                    <div className="flex gap-2">
                      {insights.brandMatches.map((brand) => (
                        <span
                          key={brand}
                          className={cn(
                            "px-2 py-1 rounded text-xs font-medium",
                            theme === 'dark'
                              ? "bg-white/5 text-white/90"
                              : "bg-gray-100 text-gray-900"
                          )}
                        >
                          {brand}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={cn(
                      "text-sm",
                      theme === 'dark' ? "text-white/60" : "text-gray-500"
                    )}>Sustainability Score</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 rounded-full bg-gray-100 dark:bg-white/5">
                        <div
                          className="h-full rounded-full bg-emerald-500"
                          style={{ width: `${insights.sustainabilityScore * 10}%` }}
                        />
                      </div>
                      <span className={cn(
                        "text-sm font-medium",
                        theme === 'dark' ? "text-white/90" : "text-gray-900"
                      )}>{insights.sustainabilityScore}/10</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Center Panel - Visual Discovery */}
          <div className="flex-1 min-w-0">
            {/* Tabs */}
            <div className="flex items-center justify-start gap-2 mb-6 overflow-x-auto no-scrollbar pb-2">
              {(['products', 'images', 'videos', 'websites'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium capitalize flex items-center gap-2 whitespace-nowrap",
                    activeTab === tab
                      ? "bg-emerald-500 text-white"
                      : theme === 'dark'
                        ? "bg-white/5 hover:bg-white/10 text-white/90"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                  )}
                >
                  {tab === 'products' && <ShoppingBag className="w-4 h-4" />}
                  {tab === 'images' && <ImageIcon className="w-4 h-4" />}
                  {tab === 'videos' && <Play className="w-4 h-4" />}
                  {tab === 'websites' && <Globe className="w-4 h-4" />}
                  {tab}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="min-h-[300px]">
              {/* Products Grid */}
              {activeTab === 'products' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 justify-items-center">
                  {similarProducts.map((product) => (
                    <div
                      key={product.id}
                      className={cn(
                        "group relative rounded-xl border overflow-hidden w-full",
                        "hover:border-emerald-500/50 transition-all duration-200",
                        "border-gray-200 dark:border-[#222]",
                        "bg-white dark:bg-[#141414]"
                      )}
                    >
                      <div className="aspect-[4/3] relative overflow-hidden">
                        <NextImage
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="p-3">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm font-medium line-clamp-2 text-gray-900 dark:text-white/90">
                            {product.name}
                          </h3>
                          <span className="flex-shrink-0 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                            ${product.price}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center justify-between">
                          <span className="text-xs text-gray-500 dark:text-white/50">
                            {product.brand}
                          </span>
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-medium text-gray-500 dark:text-white/50">
                              {product.rating}
                            </span>
                            <svg className="w-3 h-3 text-yellow-400 fill-yellow-400" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Images Grid */}
              {activeTab === 'images' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 auto-rows-fr gap-4">
                  {similarProducts.map((product) => (
                    <div
                      key={product.id}
                      className={cn(
                        "aspect-square rounded-xl overflow-hidden",
                        "group relative cursor-pointer"
                      )}
                    >
                      <NextImage
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              )}

              {/* Videos Grid */}
              {activeTab === 'videos' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 justify-items-center">
                  {similarProducts.map((product) => (
                    <div
                      key={product.id}
                      className={cn(
                        "group relative rounded-xl overflow-hidden w-full",
                        "cursor-pointer aspect-video"
                      )}
                    >
                      <NextImage
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                            <Play className="w-4 h-4 text-gray-900 translate-x-0.5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Websites Grid */}
              {activeTab === 'websites' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 justify-items-center">
                  {similarProducts.map((item) => (
                    <div
                      key={item.id}
                      className={cn(
                        "group relative rounded-xl border overflow-hidden w-full",
                        "hover:border-emerald-500/50 transition-all duration-200",
                        "border-gray-200 dark:border-[#222]",
                        "bg-white dark:bg-[#141414]"
                      )}
                    >
                      <div className="aspect-video relative overflow-hidden">
                        <NextImage
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-3 left-3 right-3">
                          <div className="flex items-center gap-2 mb-1">
                            <Globe className="w-4 h-4 text-white" />
                            <span className="text-sm font-medium text-white">{item.name}</span>
                          </div>
                          <p className="text-xs text-white/80 line-clamp-2">
                            {item.brand}
                          </p>
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 dark:text-white/50">
                            {item.source}
                          </span>
                          <button className={cn(
                            "p-1.5 rounded-lg",
                            theme === 'dark' ? "hover:bg-white/5" : "hover:bg-gray-100"
                          )}>
                            <ExternalLink className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Loading State */}
              {isAnalyzing && (
                <div className="flex items-center justify-center h-[300px]">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    <p className={cn(
                      "text-sm",
                      theme === 'dark' ? "text-white/60" : "text-gray-500"
                    )}>Analyzing image...</p>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!isAnalyzing && similarProducts.length === 0 && (
                <div className="flex items-center justify-center h-[300px]">
                  <p className={cn(
                    "text-sm",
                    theme === 'dark' ? "text-white/60" : "text-gray-500"
                  )}>Upload an image to see similar items</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - AI Chat */}
          <div className={cn(
            "fixed bottom-0 left-0 right-0 lg:static lg:w-[20%] border-t lg:border-t-0 lg:border-l transition-all duration-300 bg-inherit",
            theme === 'dark' ? "border-white/10" : "border-gray-200",
            isChatOpen 
              ? "translate-y-0 lg:translate-y-0 lg:translate-x-0" 
              : "translate-y-full lg:translate-y-0 lg:translate-x-full"
          )}>
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    theme === 'dark' ? "bg-white/5" : "bg-gray-100"
                  )}>
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                  </div>
                  <span className={cn(
                    "font-medium",
                    theme === 'dark' ? "text-white/90" : "text-gray-900"
                  )}>Shopping Assistant</span>
                </div>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className={cn(
                    "p-2 rounded-lg",
                    theme === 'dark' ? "hover:bg-white/5" : "hover:bg-gray-100"
                  )}
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Chat Input */}
              <div className={cn(
                "flex items-center gap-2 p-2 rounded-xl border mt-4",
                theme === 'dark'
                  ? "bg-[#141414] border-[#222]"
                  : "bg-white border-gray-200"
              )}>
                <input
                  type="text"
                  placeholder="Ask about the product..."
                  className={cn(
                    "flex-1 bg-transparent text-sm focus:outline-none",
                    theme === 'dark'
                      ? "text-white/90 placeholder:text-white/40"
                      : "text-gray-900 placeholder:text-gray-500"
                  )}
                />
                <button className={cn(
                  "p-2 rounded-lg",
                  theme === 'dark' ? "hover:bg-white/5" : "hover:bg-gray-100"
                )}>
                  <Mic className="w-4 h-4 text-gray-400" />
                </button>
                <button className="bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-lg">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Chat Toggle Button (Mobile) */}
          {!isChatOpen && (
            <button
              onClick={() => setIsChatOpen(true)}
              className={cn(
                "fixed bottom-4 right-4 lg:hidden",
                "w-12 h-12 rounded-full bg-emerald-500 text-white",
                "flex items-center justify-center shadow-lg"
              )}
            >
              <Sparkles className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 