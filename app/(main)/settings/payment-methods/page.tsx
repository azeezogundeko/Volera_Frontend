'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Trash2, Plus } from 'lucide-react';

interface PaymentMethod {
  id: string;
  type: 'visa' | 'mastercard' | 'amex';
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

export default function PaymentMethodsSettings() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'visa',
      last4: '4242',
      expMonth: 12,
      expYear: 25,
      isDefault: true,
    },
    {
      id: '2',
      type: 'mastercard',
      last4: '8888',
      expMonth: 3,
      expYear: 24,
      isDefault: false,
    },
  ]);

  const [showAddCard, setShowAddCard] = useState(false);
  const [newCard, setNewCard] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
  });

  const handleSetDefault = (id: string) => {
    setPaymentMethods(methods =>
      methods.map(method => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
  };

  const handleDelete = (id: string) => {
    setPaymentMethods(methods =>
      methods.filter(method => method.id !== id)
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-emerald-500" />
          Payment Methods
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your payment methods and billing preferences
        </p>
      </div>

      {/* Existing Payment Methods */}
      <div className="space-y-4">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg">
                  <CreditCard className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {method.type.charAt(0).toUpperCase() + method.type.slice(1)} ending in {method.last4}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Expires {method.expMonth.toString().padStart(2, '0')}/{method.expYear}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {!method.isDefault && (
                  <button
                    onClick={() => handleSetDefault(method.id)}
                    className="text-sm text-emerald-600 hover:text-emerald-700"
                  >
                    Set as default
                  </button>
                )}
                {method.isDefault && (
                  <span className="text-sm text-emerald-600">
                    Default
                  </span>
                )}
                <button
                  onClick={() => handleDelete(method.id)}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Card */}
      <div className="mt-8">
        {!showAddCard ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAddCard(true)}
            className="inline-flex items-center px-4 py-2 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Card
          </motion.button>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Add New Card
            </h3>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Name on Card
                </label>
                <input
                  type="text"
                  id="name"
                  value={newCard.name}
                  onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 focus:border-emerald-500 focus:ring-emerald-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="number" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Card Number
                </label>
                <input
                  type="text"
                  id="number"
                  value={newCard.number}
                  onChange={(e) => setNewCard({ ...newCard, number: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 focus:border-emerald-500 focus:ring-emerald-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    id="expiry"
                    placeholder="MM/YY"
                    value={newCard.expiry}
                    onChange={(e) => setNewCard({ ...newCard, expiry: e.target.value })}
                    className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 focus:border-emerald-500 focus:ring-emerald-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    CVC
                  </label>
                  <input
                    type="text"
                    id="cvc"
                    value={newCard.cvc}
                    onChange={(e) => setNewCard({ ...newCard, cvc: e.target.value })}
                    className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 focus:border-emerald-500 focus:ring-emerald-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowAddCard(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                >
                  Add Card
                </motion.button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
