'use client';

import React, { useState } from 'react';
import { X, Bell, Store as StoreIcon } from 'lucide-react';

interface Store {
  name: string;
  price: number;
  link?: string;
}

interface PriceWatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  stores: Store[];
  onSubmit: (data: {
    targetPrice: number;
    selectedStores: string[];
    notifyEmail: boolean;
    notifyPush: boolean;
  }) => void;
}

const PriceWatchModal = ({
  isOpen,
  onClose,
  stores,
  onSubmit,
}: PriceWatchModalProps) => {
  const [targetPrice, setTargetPrice] = useState('');
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyPush, setNotifyPush] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      targetPrice: parseFloat(targetPrice),
      selectedStores,
      notifyEmail,
      notifyPush,
    });
    onClose();
  };

  const toggleStore = (storeName: string) => {
    setSelectedStores((prev) =>
      prev.includes(storeName)
        ? prev.filter((name) => name !== storeName)
        : [...prev, storeName]
    );
  };

  if (!isOpen) return null;

  const lowestPrice = Math.min(...stores.map((store) => store.price));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-md bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:text-white/40 dark:hover:text-white/60"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-emerald-500/10 rounded-full">
              <Bell className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Set Price Alert
              </h2>
              <p className="text-sm text-gray-500 dark:text-white/50">
                Get notified when the price drops
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Target Price */}
            <div className="space-y-2">
              <label
                htmlFor="targetPrice"
                className="block text-sm font-medium text-gray-700 dark:text-white/70"
              >
                Target Price
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 dark:text-white/50">$</span>
                </div>
                <input
                  type="number"
                  id="targetPrice"
                  step="0.01"
                  min="0"
                  required
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  placeholder={`Current lowest: $${lowestPrice.toFixed(2)}`}
                  className="block w-full pl-8 pr-4 py-2.5 text-gray-900 dark:text-white border border-gray-200 dark:border-[#333] rounded-lg bg-white dark:bg-[#111] focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Store Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-white/70">
                Select Stores to Track
              </label>
              <div className="space-y-2">
                {stores.map((store) => (
                  <label
                    key={store.name}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-[#333] hover:border-gray-300 dark:hover:border-[#444] cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedStores.includes(store.name)}
                        onChange={() => toggleStore(store.name)}
                        className="w-4 h-4 text-emerald-500 border-gray-300 rounded focus:ring-emerald-500"
                      />
                      <div className="flex items-center gap-2">
                        <StoreIcon className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:text-white/40 dark:group-hover:text-white/60" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {store.name}
                        </span>
                      </div>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-white/60">
                      ${store.price.toFixed(2)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-white/70">
                Notification Preferences
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={notifyEmail}
                    onChange={(e) => setNotifyEmail(e.target.checked)}
                    className="w-4 h-4 text-emerald-500 border-gray-300 rounded focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-600 dark:text-white/60">
                    Email notifications
                  </span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={notifyPush}
                    onChange={(e) => setNotifyPush(e.target.checked)}
                    className="w-4 h-4 text-emerald-500 border-gray-300 rounded focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-600 dark:text-white/60">
                    Push notifications
                  </span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full px-4 py-2.5 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
            >
              Set Price Alert
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PriceWatchModal;
