'use client';

import { cn } from '@/lib/utils';
import { 
  BookOpenText, 
  Home, 
  Settings, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  MessageSquare, 
  Clock, 
  ArrowUpRight, 
  Search, 
  Plus, 
  Target, 
  Store 
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSelectedLayoutSegments } from 'next/navigation';
import React, { useState, type ReactNode, useEffect } from 'react';
import Layout from './Layout';
import SettingsDialog from './SettingsDialog';
import LoadingSpinner from './LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';
import { formatTimeDifference } from '@/lib/utils';
import logoLight  from '@/public/logo-light.png';
import logoDark  from '@/public/logo-dark.png';
import { useTheme } from 'next-themes';
import Image from 'next/image';

interface Thread {
  id: string;
  title: string;
  lastActive: Date;
}

interface User {
  avatar: any;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
  updated_at: string;
  isPro?: boolean;
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
        'flex items-center gap-2',
        expanded ? 'px-4 py-2.5' : 'justify-center py-2.5',
        'rounded-lg w-full',
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
    <div className="flex items-center gap-3">
      <div className={cn(
        'w-8 h-8 rounded-full',
        'bg-primary',
        'flex items-center justify-center',
        'flex-shrink-0'
      )}>
        {user.avatar ? (
          <Image
            src={user.avatar}
            alt={`${user.first_name}'s avatar`}
            width={32}
            height={32}
            className="rounded-full"
          />
        ) : (
          <span className="text-white text-sm font-medium">
            {user.first_name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      {expanded && (
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-sm font-medium text-black/90 dark:text-white/90 truncate">
            {user.first_name} {user.last_name}
          </span>
          <span className="text-xs text-black/60 dark:text-white/60 truncate" title={user.email}>
            {user.email}
          </span>
        </div>
      )}
    </div>
  );
};

const AuthButtons = ({ expanded }: { expanded: boolean }) => {
  if (!expanded) return null;
  
  return (
    <div className={cn(
      'flex flex-col gap-2',
      expanded ? 'px-4' : 'px-2'
    )}>
      <Link
        href="/signup"
        className={cn(
          'w-full flex items-center gap-2 rounded-lg',
          'bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600',
          'transition-all duration-200',
          expanded ? 'px-4 py-2.5' : 'justify-center py-2.5'
        )}
      >
        <ArrowUpRight className="w-5 h-5 text-white" />
        {expanded && (
          <AnimatePresence mode="wait">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm font-medium text-white"
            >
              Sign Up
            </motion.span>
          </AnimatePresence>
        )}
      </Link>
      <Link
        href="/login"
        className={cn(
          'w-full flex items-center gap-2 rounded-lg',
          'bg-light-100 dark:bg-dark-100 hover:bg-light-200 dark:hover:bg-dark-200',
          'transition-all duration-200',
          expanded ? 'px-4 py-2.5' : 'justify-center py-2.5'
        )}
      >
        <MessageSquare className="w-5 h-5 text-black/70 dark:text-white/70" />
        {expanded && (
          <AnimatePresence mode="wait">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm font-medium text-black/90 dark:text-white/90"
            >
              Log In
            </motion.span>
          </AnimatePresence>
        )}
      </Link>
    </div>
  );
};

const Sidebar = ({ children }: { children: React.ReactNode }) => {
  const segments = useSelectedLayoutSegments();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const router = useRouter();
  const { theme } = useTheme();

  const createNewChat = async () => {
    try {
      setIsCreatingChat(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chats/new`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${localStorage.getItem('token_type')} ${localStorage.getItem('auth_token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to create new chat');
      }

      const data = await response.json();
      router.push(`/c/${data.id}`);
    } catch (error) {
      console.error('Error creating new chat:', error);
    } finally {
      setIsCreatingChat(false);
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        setIsAuthenticated(true);
        setUser(JSON.parse(userData));
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    checkAuth();

    window.addEventListener('storage', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('token_type');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    router.push('/login');
  };

  return (
    <>
      <SettingsDialog isOpen={isSettingsOpen} setIsOpen={setIsSettingsOpen} />
      <div className="flex h-full">
        <motion.div
          initial={false}
          animate={{
            width: isExpanded ? 220 : 72,
          }}
          className={cn(
            'h-full flex-shrink-0 overflow-y-auto overflow-x-hidden relative',
            'border-r border-light-100 dark:border-dark-100',
            'bg-light-primary dark:bg-dark-primary',
          )}
        >
          <div className="h-full flex flex-col">
            {/* Logo Section */}
            <div className="p-3 border-b border-light-100 dark:border-dark-100">
              <div className="flex items-center justify-between">
                <Link 
                  href="/" 
                  className={cn(
                    'flex items-center gap-2',
                    !isExpanded && 'justify-center w-full'
                  )}
                >
                  <Image
                    src={theme === 'dark' ? logoDark : logoLight}
                    alt="Logo"
                    width={28}
                    height={28}
                    className="flex-shrink-0"
                  />
                  {isExpanded && (
                    <AnimatePresence mode="wait">
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-base font-semibold text-black/90 dark:text-white/90"
                      >
                        Perplexica
                      </motion.span>
                    </AnimatePresence>
                  )}
                </Link>
                {isExpanded && (
                  <button
                    onClick={toggleExpanded}
                    className={cn(
                      'p-1.5 rounded-lg',
                      'hover:bg-light-100 dark:hover:bg-dark-100',
                      'transition-colors duration-200'
                    )}
                  >
                    <ChevronLeft className="w-4 h-4 text-black/70 dark:text-white/70" />
                  </button>
                )}
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-0">
              {/* Navigation Section */}
              <div className="flex-1 flex flex-col justify-center">
                <nav className={cn(
                  'space-y-1',
                  isExpanded ? 'px-3' : 'px-2'
                )}>
                  <IconButton
                    href="/"
                    icon={Home}
                    label="Home"
                    expanded={isExpanded}
                    active={segments.length === 0}
                  />
                  <IconButton
                    href="/discover"
                    icon={Search}
                    label="Discover"
                    expanded={isExpanded}
                    active={segments[0] === 'discover'}
                  />
                  <IconButton
                    href="/library"
                    icon={BookOpenText}
                    label="Library"
                    expanded={isExpanded}
                    active={segments[0] === 'library'}
                  />
                  <IconButton
                    href="/track"
                    icon={Target}
                    label="Track"
                    expanded={isExpanded}
                    active={segments[0] === 'track'}
                  />
                  <IconButton
                    href="/store"
                    icon={Store}
                    label="Store"
                    expanded={isExpanded}
                    active={segments[0] === 'store'}
                  />
                  <button
                    onClick={createNewChat}
                    disabled={isCreatingChat}
                    className={cn(
                      'w-full flex items-center gap-2 px-3 py-2.5 rounded-lg',
                      'bg-light-100 dark:bg-dark-100 hover:bg-light-200 dark:hover:bg-dark-200',
                      'transition-all duration-200',
                      isCreatingChat && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    {isCreatingChat ? (
                      <LoadingSpinner className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4 text-black/70 dark:text-white/70" />
                    )}
                    {isExpanded && (
                      <AnimatePresence mode="wait">
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="text-sm font-medium text-black/90 dark:text-white/90"
                        >
                          New Chat
                        </motion.span>
                      </AnimatePresence>
                    )}
                  </button>
                </nav>
              </div>

              {/* Bottom Section */}
              <div className="p-3 border-t border-light-100 dark:border-dark-100">
                {isAuthenticated ? (
                  <div className="space-y-3">
                    {user && !user.isPro && <TryProButton expanded={isExpanded} />}
                    {user && (
                      <div className="space-y-2">
                        <UserProfile user={user} expanded={isExpanded} />
                        {isExpanded && (
                          <button
                            onClick={handleLogout}
                            className={cn(
                              'w-full px-3 py-2 rounded-lg',
                              'text-sm text-red-600 dark:text-red-400',
                              'hover:bg-light-100 dark:hover:bg-dark-100',
                              'transition-colors duration-200'
                            )}
                          >
                            Sign Out
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  isExpanded && <AuthButtons expanded={isExpanded} />
                )}
                <div className="mt-3">
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
          </div>

          {/* Expand Button */}
          {!isExpanded && (
            <button
              onClick={toggleExpanded}
              className={cn(
                'absolute -right-4 top-6',
                'w-8 h-8 rounded-full',
                'bg-white dark:bg-dark-secondary',
                'border border-light-100 dark:border-dark-100',
                'shadow-md',
                'flex items-center justify-center',
                'hover:bg-light-100 dark:hover:bg-dark-100',
                'transition-colors duration-200'
              )}
            >
              <ChevronRight className="w-5 h-5 text-black/70 dark:text-white/70" />
            </button>
          )}
        </motion.div>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </>
  );
};

export default Sidebar;
