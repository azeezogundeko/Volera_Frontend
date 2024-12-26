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
    <div className="flex h-screen">
      <motion.div 
        className="fixed inset-y-0 z-50 flex flex-col border-r border-light-200 dark:border-dark-200 bg-white dark:bg-black"
        initial={false}
        animate={{ width: isExpanded ? '280px' : '96px' }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex h-16 shrink-0 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2"
                >
                  <Sparkles className="h-6 w-6 text-emerald-500" />
                  <span className="text-lg font-semibold">Volera</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-light-100 dark:hover:bg-dark-100 rounded-lg transition-colors duration-200"
          >
            {isExpanded ? (
              <ChevronLeft className="h-5 w-5 text-black/70 dark:text-white/70" />
            ) : (
              <ChevronRight className="h-5 w-5 text-black/70 dark:text-white/70" />
            )}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <nav className="flex flex-1 flex-col gap-1 p-4">
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
          </nav>

          <div className="px-4 py-2">
            <AnimatePresence>
              {isExpanded && (
                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="px-2 text-xs font-semibold text-black/40 dark:text-white/40 uppercase tracking-wider"
                >
                  Recent Chats
                </motion.h2>
              )}
            </AnimatePresence>
          </div>

          <nav className="flex flex-col gap-1 px-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-10 rounded-lg bg-light-100 dark:bg-dark-100 animate-pulse"
                />
              ))
            ) : (
              filteredThreads.map((thread) => (
                <ThreadItem
                  key={thread.id}
                  thread={thread}
                  active={segments.includes(thread.id)}
                  expanded={isExpanded}
                />
              ))
            )}
          </nav>
        </div>

        <div className="flex flex-col gap-2 p-4 border-t border-light-200 dark:border-dark-200">
          <button
            onClick={handleNewChat}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-lg w-full',
              'bg-emerald-500 hover:bg-emerald-600 text-white',
              'transition-colors duration-200'
            )}
          >
            <Plus className="w-5 h-5" />
            <AnimatePresence>
              {isExpanded && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  New Chat
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <button
            onClick={() => setIsSettingsOpen(true)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-lg w-full',
              'bg-transparent hover:bg-light-100 dark:hover:bg-dark-100',
              'transition-colors duration-200'
            )}
          >
            <Settings className="w-5 h-5 text-black/70 dark:text-white/70" />
            <AnimatePresence>
              {isExpanded && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-black/70 dark:text-white/70"
                >
                  Settings
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.div>

      <div className={cn(
        "flex flex-1 flex-col",
        isExpanded ? "lg:pl-[280px]" : "lg:pl-24"
      )}>
        <Layout>
          {children}
        </Layout>
      </div>

      <SettingsDialog
        isOpen={isSettingsOpen}
        setIsOpen={setIsSettingsOpen}
        user={user}
      />
    </div>
  );
};

export default Sidebar;
