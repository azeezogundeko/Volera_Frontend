'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Download, Calendar, DollarSign, Clock, FileText } from 'lucide-react';
import Link from 'next/link';

interface BillingHistory {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  invoice: string;
}

export default function BillingSettings() {
  const [billingHistory] = useState<BillingHistory[]>([
    {
      id: '1',
      date: '2025-01-17',
      amount: 49.99,
      status: 'paid',
      invoice: 'INV-2025-001',
    },
    {
      id: '2',
      date: '2024-12-17',
      amount: 49.99,
      status: 'paid',
      invoice: 'INV-2024-012',
    },
    {
      id: '3',
      date: '2024-11-17',
      amount: 49.99,
      status: 'paid',
      invoice: 'INV-2024-011',
    },
  ]);

  return (
    <div className="space-y-8">
      {/* Current Plan Overview */}
      <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Current Plan</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Pro Plan</p>
          </div>
          <Link
            href="/settings/subscription"
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            Change Plan
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg">
              <DollarSign className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Monthly Price</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">$49.99</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg">
              <Calendar className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Renewal Date</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">Feb 17, 2025</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg">
              <Clock className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Billing Cycle</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">Monthly</p>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Method Summary */}
      <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Payment Method</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Manage your payment methods</p>
          </div>
          <Link
            href="/settings/payment-methods"
            className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
          >
            Manage Payment Methods
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg">
            <CreditCard className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Visa ending in 4242</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Expires 12/25</p>
          </div>
        </div>
      </section>

      {/* Billing History */}
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Billing History</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">View and download your invoices</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left bg-gray-50 dark:bg-gray-900">
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">Date</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">Amount</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">Status</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {billingHistory.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {new Date(item.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    ${item.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      {
                        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': item.status === 'paid',
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200': item.status === 'pending',
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200': item.status === 'failed',
                      }
                    )}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="inline-flex items-center text-sm text-emerald-600 hover:text-emerald-700">
                      <FileText className="w-4 h-4 mr-1" />
                      {item.invoice}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
