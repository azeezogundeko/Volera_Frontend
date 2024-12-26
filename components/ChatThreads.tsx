'use client';

import { cn } from '@/lib/utils';
import { Message } from './ChatWindow';
import { formatTimeDifference } from '@/lib/utils';
import { MessageSquare, Clock } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Thread {
  id: string;
  firstMessage: string;
  lastActive: Date;
  messageCount: number;
}

const ChatThreads = () => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated data - replace with actual API call
    const mockThreads: Thread[] = [
      {
        id: '1',
        firstMessage: 'How do I implement a binary search tree?',
        lastActive: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
        messageCount: 8,
      },
      {
        id: '2',
        firstMessage: 'Explain the concept of dependency injection',
        lastActive: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        messageCount: 12,
      },
      {
        id: '3',
        firstMessage: 'What are the best practices for React hooks?',
        lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        messageCount: 15,
      },
    ];

    setThreads(mockThreads);
    setLoading(false);
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500" />
          </div>
        ) : (
          threads.map((thread) => (
            <Link key={thread.id} href={`/c/${thread.id}`}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                className={cn(
                  "p-4 rounded-xl cursor-pointer",
                  "bg-gradient-to-br from-light-50 to-light-100 dark:from-dark-50 dark:to-dark-100",
                  "border border-light-200 dark:border-dark-200",
                  "hover:border-light-300 dark:hover:border-dark-300",
                  "transition-all duration-200",
                  "group"
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-black/90 dark:text-white/90 truncate">
                      {thread.firstMessage}
                    </h3>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center text-xs text-black/50 dark:text-white/50">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatTimeDifference(new Date(), thread.lastActive)}
                      </div>
                      <div className="flex items-center text-xs text-black/50 dark:text-white/50">
                        <MessageSquare className="w-3 h-3 mr-1" />
                        {thread.messageCount} messages
                      </div>
                    </div>
                  </div>
                  <div className="transform translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 rounded-lg bg-light-200/50 dark:bg-dark-200/50"
                    >
                      <MessageSquare className="w-4 h-4 text-black/60 dark:text-white/60" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatThreads;
