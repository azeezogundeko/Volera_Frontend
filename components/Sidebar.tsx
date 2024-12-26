'use client';

import { cn } from '@/lib/utils';
import { BookOpenText, Home, Settings, Sparkles, ChevronLeft, ChevronRight, MessageSquare, Clock, ArrowUpRight, Search, Plus } from 'lucide-react';
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
        'w-full flex items-center gap-2',
        expanded ? 'px-4 py-2.5' : 'justify-center py-2.5',
        'rounded-lg',
        'bg-transparent hover:bg-light-100 dark:hover:bg-dark-100',
        'transition-colors duration-200',
        active && 'bg-light-100 dark:bg-dark-100'
      )}
      onClick={onClick}
    >
      <Icon className="w-5 h-5 text-black/70 dark:text-white/70" />
      {expanded && (
        <AnimatePresence mode="wait">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-sm font-medium text-black/90 dark:text-white/90"
          >
            {label}
          </motion.span>
        </AnimatePresence>
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
          <AnimatePresence mode="wait">
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
          </AnimatePresence>
        ) : (
          <div className="w-full flex justify-center">
            <div className="w-1 h-1 rounded-full bg-black/40 dark:bg-white/40" />
          </div>
        )}
      </motion.div>
    </Link>
  );
};

const TryProButton = ({ expanded }: { expanded: boolean }) => {
  return (
    <Link
      href="/pro"
      className={cn(
        'w-full flex items-center gap-2 px-4 py-2.5 rounded-lg',
        'bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600',
        'transition-all duration-200'
      )}
    >
      <Sparkles className="w-5 h-5 text-white" />
      {expanded && (
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col"
          >
            <span className="text-sm font-medium text-white">Try Pro</span>
            <span className="text-xs text-white/80">Upgrade for image upload, smarter AI</span>
          </motion.div>
        </AnimatePresence>
      )}
    </Link>
  );
};

const UserProfile = ({ user, expanded }: { user: User; expanded: boolean }) => {
  return (
    <div className={cn(
      "flex items-center gap-2 py-2",
      expanded ? "px-4" : "justify-center"
    )}>
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
        {user.image ? (
          <img src={user.image} alt={user.name} className="w-full h-full rounded-full" />
        ) : (
          <span className="text-white text-sm font-medium">
            {user.name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      {expanded && (
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 min-w-0"
          >
            <div className="text-sm font-medium text-black/90 dark:text-white/90 truncate">
              {user.name}
            </div>
            <div className="text-xs text-black/50 dark:text-white/50 truncate">
              {user.email}
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
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

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    // Emit custom event for sidebar state change
    const event = new CustomEvent('sidebarStateChange', { 
      detail: { expanded: !isExpanded }
    });
    window.dispatchEvent(event);
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
    <div className="flex h-screen">
      <motion.div 
        className="fixed inset-y-0 z-50 flex flex-col border-r border-light-200 dark:border-dark-200 bg-white dark:bg-black"
        initial={false}
        animate={{ 
          width: isExpanded ? '280px' : '96px',
        }}
        style={{
          boxShadow: '0 0 15px rgba(0, 0, 0, 0.05)'
        }}
      >
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex items-center justify-between p-4">
            <AnimatePresence mode="wait">
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-lg font-semibold text-black/90 dark:text-white/90"
                >
                  Perplexica
                </motion.div>
              )}
            </AnimatePresence>
            <button
              onClick={toggleExpanded}
              className="p-2 hover:bg-light-100 dark:hover:bg-dark-100 rounded-lg transition-colors"
            >
              {isExpanded ? (
                <ChevronLeft className="w-5 h-5 text-black/70 dark:text-white/70" />
              ) : (
                <ChevronRight className="w-5 h-5 text-black/70 dark:text-white/70" />
              )}
            </button>
          </div>

          <div className="flex flex-col gap-1 p-2">
            <button
              onClick={handleNewChat}
              className={cn(
                'w-full flex items-center gap-2 px-4 py-2.5 rounded-lg',
                'bg-light-100 dark:bg-dark-100 hover:bg-light-200 dark:hover:bg-dark-200',
                'transition-colors duration-200'
              )}
            >
              <Plus className="w-5 h-5 text-black/70 dark:text-white/70" />
              <AnimatePresence mode="wait">
                {isExpanded && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm font-medium text-black/90 dark:text-white/90"
                  >
                    New Chat
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <div className="my-2" />

            {navLinks.map((link) => (
              <IconButton
                key={link.href}
                href={link.href}
                icon={link.icon}
                label={link.label}
                expanded={isExpanded}
                active={link.active}
              />
            ))}
          </div>

          {!loading && filteredThreads.length > 0 && isExpanded && (
            <div className="mt-4">
              <div className="flex items-center px-6 py-2">
                <Clock className="w-4 h-4 text-black/40 dark:text-white/40" />
                <AnimatePresence mode="wait">
                  {isExpanded && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="ml-2 text-xs font-medium text-black/40 dark:text-white/40"
                    >
                      Recent
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <div className="space-y-1">
                {filteredThreads.map((thread) => (
                  <ThreadItem
                    key={thread.id}
                    thread={thread}
                    active={segments.includes('c') && segments.includes(thread.id)}
                    expanded={isExpanded}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="mt-auto p-2 space-y-2">
            {isExpanded && <TryProButton expanded={isExpanded} />}
            <div className={cn(
              "flex flex-col",
              isExpanded ? "space-y-2" : "items-center space-y-4"
            )}>
              <UserProfile user={user} expanded={isExpanded} />
              <IconButton
                href="/settings"
                icon={Settings}
                label="Settings"
                expanded={isExpanded}
                active={isSettingsOpen}
                onClick={() => setIsSettingsOpen(true)}
              />
            </div>
          </div>
        </div>
      </motion.div>

      <div className={cn(
        "flex-1 transition-all duration-200 min-h-screen flex flex-col",
        isExpanded ? "ml-[280px]" : "ml-24"
      )}>
        <div className="flex-1 flex flex-col max-w-[1200px] w-full mx-auto px-6">
          <Layout>{children}</Layout>
        </div>
      </div>

      <SettingsDialog 
        isOpen={isSettingsOpen} 
        setIsOpen={setIsSettingsOpen} 
      />
    </div>
  );
};

export default Sidebar;
