'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import Image from 'next/image';
import PriceWatchModal from './marketplace/PriceWatchModal';

interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  source: string;
  url: string;
  specifications: Array<{ label: string; value: string }>;
  features: string[];
}

interface SearchResultsProps {
  results: Product[];
  onClose: () => void;
}

const SearchResults = ({ results, onClose }: SearchResultsProps) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isPriceWatchModalOpen, setIsPriceWatchModalOpen] = useState(false);

  const handleTrack = (product: Product) => {
    setSelectedProduct(product);
    setIsPriceWatchModalOpen(true);
  };

  const handlePriceWatchSubmit = (data: {
    targetPrice: number;
    notifyEmail: boolean;
    notifyPush: boolean;
  }) => {
    // Here you would send the data to your backend
    console.log('Price watch data:', { ...data, product: selectedProduct });
    toast.success('Item added to tracking');
    setIsPriceWatchModalOpen(false);
    onClose();
  };

  return (
    <>
      <div className="space-y-6">
        {results.map((product) => (
          <div
            key={product.id}
            className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg border border-gray-200 dark:border-white/10"
          >
            {/* Product Image */}
            <div className="w-full sm:w-48 h-48 relative rounded-lg overflow-hidden bg-gray-100 dark:bg-white/5">
              <Image
                src={product.image}
                alt={product.title}
                width={400}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <div className="space-y-1 mb-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white/90 line-clamp-2">
                  {product.title}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-semibold text-gray-900 dark:text-white">
                    ${product.price}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-white/50">
                    on {product.source}
                  </span>
                </div>
              </div>

              {/* Specifications */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {product.specifications.slice(0, 4).map((spec) => (
                  <div
                    key={spec.label}
                    className="text-sm text-gray-600 dark:text-white/60"
                  >
                    <span className="font-medium">{spec.label}:</span>{' '}
                    {spec.value}
                  </div>
                ))}
              </div>

              {/* Features */}
              <div className="space-y-1 mb-4">
                {product.features.slice(0, 2).map((feature, index) => (
                  <div
                    key={index}
                    className="text-sm text-gray-600 dark:text-white/60"
                  >
                    • {feature}
                  </div>
                ))}
              </div>

              <div className="flex sm:flex-col gap-2 sm:gap-3">
                <a
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
                >
                  <span className="text-sm font-medium">Visit Store</span>
                </a>
                <button
                  onClick={() => handleTrack(product)}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                >
                  <span className="text-sm font-medium">Track Price</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Price Watch Modal */}
      {selectedProduct && (
        <PriceWatchModal
          isOpen={isPriceWatchModalOpen}
          onClose={() => setIsPriceWatchModalOpen(false)}
          stores={[{ name: selectedProduct.source, price: selectedProduct.price }]}
          onSubmit={handlePriceWatchSubmit}
        />
      )}
    </>
  );
};

export default SearchResults; 