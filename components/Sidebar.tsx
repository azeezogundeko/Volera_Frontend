'use client';

import { cn } from '@/lib/utils';
import { BookOpenText, Home, Settings, Sparkles, ChevronLeft, ChevronRight, MessageSquare, Clock, ArrowUpRight, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSelectedLayoutSegments } from 'next/navigation';
import React, { useState, type ReactNode, useEffect } from 'react';
import Layout from './Layout';
import SettingsDialog from './SettingsDialog';
import { motion, AnimatePresence } from 'framer-motion';
import { formatTimeDifference } from '@/lib/utils';

interface Thread {
  id: string;
  title: string;
  lastActive: Date;
}

interface User {
  id: string;
  name: string;
  email: string;
  isPro: boolean;
  image?: string;
}

interface IconButtonProps {
  href: string;
  icon: React.ElementType;
  label: string;
  expanded: boolean;
  active?: boolean;
  onClick?: () => void;
}

const IconButton = ({ href, icon: Icon, label, expanded, active, onClick }: IconButtonProps) => {
  return (
    <Link
      href={href}
      className={cn(
        'w-full flex items-center gap-2 px-4 py-2.5 rounded-lg',
        'bg-transparent hover:bg-light-100 dark:hover:bg-dark-100',
        'transition-colors duration-200',
        active && 'bg-light-100 dark:bg-dark-100'
      )}
      onClick={onClick}
    >
      <Icon className="w-5 h-5 text-black/70 dark:text-white/70" />
      {expanded && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-sm font-medium text-black/90 dark:text-white/90"
        >
          {label}
        </motion.span>
      )}
    </Link>
  );
};

const ThreadItem = ({ 
  thread, 
  active, 
  expanded 
}: { 
  thread: Thread; 
  active: boolean;
  expanded: boolean;
}) => {
  return (
    <Link href={`/c/${thread.id}`}>
      <motion.div
        whileHover={{ x: 4 }}
        className={cn(
          "flex items-center gap-3 px-3 py-1.5 rounded-lg cursor-pointer group ml-8",
          "transition-all duration-200 relative",
          active
            ? "bg-gradient-to-br from-light-100 to-light-200 dark:from-dark-100 dark:to-dark-200"
            : "hover:bg-light-100/50 dark:hover:bg-dark-100/50"
        )}
      >
        <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-3 h-px bg-light-200 dark:bg-dark-200" />
        {expanded ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 min-w-0"
          >
            <div className="text-xs text-black/70 dark:text-white/70 truncate">
              {thread.title}
            </div>
          </motion.div>
        ) : (
          <div className="w-full flex justify-center">
            <div className="w-1 h-1 rounded-full bg-black/40 dark:bg-white/40" />
          </div>
        )}
      </motion.div>
    </Link>
  );
};

const Sidebar = ({ children }: { children: React.ReactNode }) => {
  const segments = useSelectedLayoutSegments();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User>({
    id: '1',
    name: 'Demo User',
    email: 'demo@example.com',
    isPro: false,
  });
  const router = useRouter();

  useEffect(() => {
    const fetchThreads = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chats`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch chats');
        }

        const data = await res.json();
        const formattedThreads: Thread[] = data.chats.map((chat: any) => ({
          id: chat.id,
          title: chat.title || chat.messages[0]?.content || 'New Chat',
          lastActive: new Date(chat.$createdAt),
        }));

        setThreads(formattedThreads);
      } catch (error) {
        console.error('Error fetching threads:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchThreads();
  }, []);

  const handleNewChat = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error('Failed to create new chat');
      }

      const data = await res.json();
      router.push(`/c/${data.chat.id}`);
    } catch (error) {
      console.error('Error creating new chat:', error);
    }
  };

  const filteredThreads = threads.slice(0, 4);

  const navLinks = [
    {
      icon: Home,
      href: '/',
      active: segments.length === 0,
      label: 'Home',
    },
    {
      icon: Search,
      href: '/discover',
      active: segments.includes('discover'),
      label: 'Discover',
    },
    {
      icon: BookOpenText,
      href: '/library',
      active: segments.includes('library'),
      label: 'Library',
    },
  ];

  return (
    <div>
      <motion.div 
        className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col"
        initial={false}
        animate={{ width: isExpanded ? '280px' : '96px' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <div className={cn(
          "flex grow flex-col gap-y-4 py-8 relative h-screen",
          "bg-gradient-to-b from-light-50 to-light-100 dark:from-dark-50 dark:to-dark-100",
          "border-r border-light-200 dark:border-dark-200"
        )}>
          <Link href="/" className={cn("px-4 py-2", isExpanded ? 'w-full flex justify-center' : '')}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-green-600 shadow-lg shadow-green-500/20"
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
          </Link>

          {/* New Chat Button */}
          <div className={cn(
            "px-4 mb-4",
            !isExpanded && "flex justify-center"
          )}>
            <button
              onClick={handleNewChat}
              className={cn(
                isExpanded ? "w-full flex items-center gap-2 px-4 py-2.5" : "p-3",
                "rounded-lg",
                "bg-light-50 dark:bg-dark-50",
                "hover:bg-light-100 dark:hover:bg-dark-100",
                "border border-light-200 dark:border-dark-200",
                "transition-all duration-200"
              )}
            >
              <MessageSquare className="w-5 h-5 text-black/70 dark:text-white/70" />
              {isExpanded && (
                <span className="text-sm font-medium text-black/90 dark:text-white/90">
                  New Chat
                </span>
              )}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col items-center gap-y-1 px-4 w-full">
            {navLinks.map((link) => (
              <IconButton
                key={link.href}
                {...link}
                expanded={isExpanded}
              />
            ))}
          </nav>

          {/* Chat Threads Section */}
          {isExpanded && (
            <div className="flex-1 w-full">
              <div className={cn(
                "space-y-0.5 px-4 -mt-1",
              )}>
                <AnimatePresence mode="wait">
                  {loading ? (
                    <div className="space-y-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={cn(
                            "h-6 rounded-lg ml-4 relative",
                            "bg-gradient-to-r from-light-100 to-light-200 dark:from-dark-100 dark:to-dark-200",
                            "animate-pulse"
                          )}
                        >
                          <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-2 h-px bg-light-200 dark:bg-dark-200" />
                        </div>
                      ))}
                    </div>
                  ) : filteredThreads.length === 0 ? (
                    <div className="px-3 py-2 text-xs text-black/50 dark:text-white/50 ml-4 relative">
                      <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-2 h-px bg-light-200 dark:bg-dark-200" />
                      No chats found
                    </div>
                  ) : (
                    filteredThreads.map((thread) => (
                      <Link
                        key={thread.id}
                        href={`/c/${thread.id}`}
                        className={cn(
                          'group flex items-center gap-2 rounded-lg px-3 py-2 text-sm relative',
                          'hover:bg-light-100 dark:hover:bg-dark-100 transition-colors',
                          'text-black/70 dark:text-white/70',
                          segments.includes('c') && segments.includes(thread.id) && 'bg-light-100 dark:bg-dark-100',
                          'ml-4'
                        )}
                      >
                        <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-2 h-px bg-light-200 dark:bg-dark-200" />
                        <MessageSquare
                          className={cn(
                            'w-4 h-4',
                            segments.includes('c') && segments.includes(thread.id) && 'text-black dark:text-white'
                          )}
                        />
                        <span className={cn(
                          'truncate text-xs',
                          segments.includes('c') && segments.includes(thread.id) && 'text-black dark:text-white'
                        )}>
                          {thread.title || 'New Chat'}
                        </span>
                      </Link>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Try Pro Section */}
          {isExpanded && !user.isPro && (
            <div className="mt-auto">
              <div className="px-4 py-3">
                <div className="rounded-lg bg-gradient-to-r from-emerald-400/20 to-emerald-500/20 p-3 border border-emerald-500/20">
                  <h4 className="font-medium text-sm text-emerald-700 dark:text-emerald-300">Try Pro</h4>
                  <p className="text-xs text-emerald-600/80 dark:text-emerald-300/80 mt-1">
                    Unlock unlimited chats and advanced features
                  </p>
                  <button className="mt-2 w-full rounded-md bg-emerald-500 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-600 transition-colors">
                    Upgrade Now
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* User Section */}
          <div className="mt-2">
            <div className="px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-sm font-medium text-white">{user.name.charAt(0).toUpperCase()}</span>
                  </div>
                  {isExpanded && (
                    <span className="text-sm font-medium text-black/90 dark:text-white/90">{user.name}</span>
                  )}
                </div>
                <button 
                  onClick={() => setIsSettingsOpen(true)}
                  className="p-1 rounded-md hover:bg-light-100 dark:hover:bg-dark-200/50 transition-colors"
                >
                  <Settings className="w-4 h-4 text-black/60 dark:text-white/60" />
                </button>
              </div>
            </div>
          </div>

          <motion.button
            initial={false}
            animate={{ 
              x: isExpanded ? 12 : 12,
              rotate: isExpanded ? 180 : 0 
            }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-light-100 dark:bg-dark-100 rounded-full p-1.5 border border-light-200 dark:border-dark-200 hover:bg-light-200 dark:hover:bg-dark-200 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500/50"
          >
            <ChevronLeft className="w-4 h-4 text-black/60 dark:text-white/60" />
          </motion.button>
        </div>
      </motion.div>

      <div className={cn(
        "lg:pl-24 transition-all duration-300",
        isExpanded ? "lg:pl-72" : "lg:pl-24"
      )}>
        {children}
      </div>

      <SettingsDialog
        isOpen={isSettingsOpen}
        setIsOpen={setIsSettingsOpen}
      />
    </div>
  );
};

export default Sidebar;
