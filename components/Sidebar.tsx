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
  Store,
  Menu,
  X,
  UserCircle2,
  BookOpen,
  Compass,
  TrendingUp,
  Heart,
  User,
  LogOut
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSelectedLayoutSegments } from 'next/navigation';
import React, { useState, type ReactNode, useEffect } from 'react';
import Layout from './Layout';
import SettingsDialog from './SettingsDialog';
import LoadingSpinner from './LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';
import { formatTimeDifference } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { useChat } from '@/hooks/useChat';
import { Toaster, toast } from 'sonner';

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
        'flex items-center gap-3',
        expanded ? 'px-3 py-2' : 'justify-center p-2',
        'rounded-lg w-full',
        'hover:bg-gray-50 dark:hover:bg-white/5',
        'transition-all duration-200',
        active && 'bg-emerald-50 dark:bg-emerald-500/10',
        active && 'text-emerald-600 dark:text-emerald-500'
      )}
      onClick={onClick}
    >
      <Icon className={cn(
        "w-5 h-5",
        active 
          ? "text-emerald-600 dark:text-emerald-500" 
          : "text-gray-500 dark:text-white/50"
      )} />
      {expanded && (
        <AnimatePresence mode="wait">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              "text-sm font-medium whitespace-nowrap",
              active 
                ? "text-emerald-600 dark:text-emerald-500"
                : "text-gray-600 dark:text-white/70"
            )}
          >
            {label}
          </motion.span>
        </AnimatePresence>
      )}
    </Link>
  );
};

const NavSection = ({ 
  title, 
  children, 
  expanded 
}: { 
  title: string; 
  children: React.ReactNode;
  expanded: boolean;
}) => {
  return (
    <div className="space-y-1">
      {expanded && (
        <h3 className="text-xs font-medium text-gray-400 dark:text-white/30 uppercase tracking-wider px-3 mb-2">
          {title}
        </h3>
      )}
      {children}
          </div>
  );
};

const UserButton = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Check authentication status
    const token = localStorage.getItem('auth_token');
    const email = localStorage.getItem('user_email');
    setIsAuthenticated(!!token);
    setUserEmail(email || '');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_email');
    setIsAuthenticated(false);
    router.push('/login');
  };

  if (!isAuthenticated) {
    return (
      <Link href="/login" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white/90 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors">
        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center">
          <User className="w-4 h-4" />
        </div>
        <span>Sign in</span>
      </Link>
    );
  }

  return (
    <div className="group relative">
      <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white/90 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors">
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
          <span className="text-white text-sm font-medium">
            {userEmail.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="truncate flex-1 text-left">{userEmail}</span>
      </button>
      
      {/* Logout dropdown */}
      <div className="absolute bottom-full left-0 w-full mb-1 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

const NewChatButton = ({ expanded }: { expanded: boolean }) => {
  const { createNewChat, isCreatingChat } = useChat();
  const router = useRouter();

  const handleNewChat = async () => {
    try {
      const data = await createNewChat();
      if (data?.id) {
        router.push(`/c/${data.id}`);
      }
    } catch (error) {
      console.error('Error creating new chat:', error);
      toast.error('Failed to create new chat');
    }
  };
  
  return (
    <button
      onClick={handleNewChat}
      disabled={isCreatingChat}
        className={cn(
        'flex items-center gap-3 w-full',
        expanded ? 'px-3 py-2' : 'justify-center p-2',
        'rounded-lg',
        'bg-emerald-500 hover:bg-emerald-600',
          'transition-all duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed'
      )}
    >
      {isCreatingChat ? (
        <LoadingSpinner className="w-5 h-5 text-white" />
      ) : (
        <Plus className="w-5 h-5 text-white" />
      )}
        {expanded && (
        <span className="text-sm font-medium text-white">
          New Chat
        </span>
      )}
    </button>
  );
};

const Sidebar = ({ children }: { children: React.ReactNode }) => {
  const [expanded, setExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const segments = useSelectedLayoutSegments();
  const { theme } = useTheme();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [segments]);

  // Handle expanded state based on screen size and mobile menu
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // lg breakpoint
        setExpanded(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleExpanded = () => {
    if (window.innerWidth >= 1024) { // Only toggle on desktop
      setExpanded(!expanded);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Mobile sidebar content with always expanded state
  const mobileSidebarContent = (
    <div className="flex flex-col h-full w-[280px] bg-white dark:bg-[#111111] border-r border-gray-200 dark:border-white/10">
      {/* Logo Section - Mobile */}
      <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200 dark:border-white/10">
        <span className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-emerald-400 bg-clip-text text-transparent tracking-tight">
          Volera
        </span>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-hidden">
        <nav className="space-y-6 py-6 px-3">
          <div className="px-2">
            <NewChatButton expanded={true} />
          </div>

          <NavSection title="Overview" expanded={true}>
            <IconButton
                  href="/" 
              icon={Home}
              label="Dashboard"
              expanded={true}
              active={segments.length === 0}
            />
            <IconButton
              href="/track"
              icon={Target}
              label="Track Items"
              expanded={true}
              active={segments[0] === 'track'}
            />
            <IconButton
              href="/library"
              icon={BookOpen}
              label="Library"
              expanded={true}
              active={segments[0] === 'library'}
            />
          </NavSection>

          <NavSection title="Explorer" expanded={true}>
            <IconButton
              href="/discover"
              icon={Compass}
              label="Discover"
              expanded={true}
              active={segments[0] === 'discover'}
            />
            <IconButton
              href="/trending"
              icon={TrendingUp}
              label="Trending"
              expanded={true}
              active={segments[0] === 'trending'}
            />
            <IconButton
              href="/favorites"
              icon={Heart}
              label="Favorites"
              expanded={true}
              active={segments[0] === 'favorites'}
            />
          </NavSection>

          <NavSection title="Shopping" expanded={true}>
            <IconButton
              href="/store"
              icon={Store}
              label="Browse Store"
              expanded={true}
              active={segments[0] === 'store'}
            />
            <IconButton
              href="/chat"
              icon={MessageSquare}
              label="AI Assistant"
              expanded={true}
              active={segments[0] === 'chat'}
            />
          </NavSection>
        </nav>
      </div>

      {/* Settings and User Profile */}
      <div className="mt-auto border-t border-gray-200 dark:border-white/10 p-4 space-y-3">
        <IconButton
          href="#"
          icon={Settings}
          label="Settings"
          expanded={true}
          onClick={() => setIsSettingsOpen(true)}
        />
        <UserButton />
      </div>
    </div>
  );

  // Desktop sidebar content with collapsible state
  const desktopSidebarContent = (
    <div className={cn(
      'flex flex-col h-full',
      expanded ? 'w-[280px]' : 'w-16',
      'bg-white dark:bg-[#111111]',
      'border-r border-gray-200 dark:border-white/10',
      'transition-all duration-300'
    )}>
      {/* Logo Section - Desktop */}
      <div className={cn(
        'flex items-center',
        expanded ? 'justify-center' : 'justify-center',
        'h-16 px-4 border-b border-gray-200 dark:border-white/10',
        'relative' // Added for absolute positioning of the toggle button
      )}>
        {expanded && (
          <span className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-emerald-400 bg-clip-text text-transparent tracking-tight">
                        Volera
          </span>
                  )}
                  <button
                    onClick={toggleExpanded}
          className="absolute right-4 p-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 lg:block hidden"
        >
          {expanded ? (
            <ChevronLeft className="w-5 h-5 text-gray-400 dark:text-white/40" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-400 dark:text-white/40" />
          )}
                  </button>
              </div>

      {/* Navigation */}
      <div className="flex-1 overflow-hidden py-6 px-3">
        <nav className="space-y-6">
          <div className="px-2">
            <NewChatButton expanded={expanded} />
            </div>

          <NavSection title="Overview" expanded={expanded}>
            <IconButton
              href="/"
              icon={Home}
              label="Dashboard"
              expanded={expanded}
              active={segments.length === 0}
            />
                  <IconButton
                    href="/track"
                    icon={Target}
              label="Track Items"
              expanded={expanded}
                    active={segments[0] === 'track'}
                  />
                  <IconButton
              href="/library"
              icon={BookOpen}
              label="Library"
              expanded={expanded}
              active={segments[0] === 'library'}
            />
          </NavSection>

          <NavSection title="Explorer" expanded={expanded}>
            <IconButton
              href="/discover"
              icon={Compass}
              label="Discover"
              expanded={expanded}
              active={segments[0] === 'discover'}
                  />
                  <IconButton
              href="/trending"
              icon={TrendingUp}
              label="Trending"
              expanded={expanded}
              active={segments[0] === 'trending'}
                  />
                  <IconButton
              href="/favorites"
              icon={Heart}
              label="Favorites"
              expanded={expanded}
              active={segments[0] === 'favorites'}
            />
          </NavSection>

          <NavSection title="Shopping" expanded={expanded}>
            <IconButton
              href="/store"
                    icon={Store}
              label="Browse Store"
              expanded={expanded}
                    active={segments[0] === 'store'}
                  />
                  <IconButton
              href="/chat"
              icon={MessageSquare}
              label="AI Assistant"
              expanded={expanded}
              active={segments[0] === 'chat'}
            />
          </NavSection>
                </nav>
              </div>

      {/* Settings and User Profile */}
      <div className={cn(
        'mt-auto border-t border-gray-200 dark:border-white/10',
        'p-4 space-y-3'
      )}>
                  <IconButton
          href="#"
                    icon={Settings}
                    label="Settings"
          expanded={expanded}
                    onClick={() => setIsSettingsOpen(true)}
                  />
        <UserButton />
                </div>
              </div>
  );

  return (
    <>
      <Toaster position="top-center" />
      {/* Mobile Menu Button */}
            <button
        onClick={toggleMobileMenu}
        className="fixed top-4 left-4 z-[60] p-2 rounded-lg bg-white dark:bg-[#1a1a1a] shadow-lg border border-gray-200 dark:border-white/10 lg:hidden"
      >
        {isMobileMenuOpen ? (
          <X className="w-5 h-5 text-gray-500 dark:text-white/50" />
        ) : (
          <Menu className="w-5 h-5 text-gray-500 dark:text-white/50" />
        )}
      </button>

      {/* Mobile Sidebar */}
      <AnimatePresence mode="wait">
        {isMobileMenuOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[55] lg:hidden"
              onClick={toggleMobileMenu}
            />
            <motion.div
              key="sidebar"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
              className="fixed top-0 left-0 bottom-0 z-[60] lg:hidden"
            >
              {mobileSidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed top-0 left-0 bottom-0 z-[40]">
        {desktopSidebarContent}
      </div>

      {/* Main Content */}
      <main className={cn(
        'min-h-screen',
        expanded ? 'lg:pl-[280px]' : 'lg:pl-16',
        'transition-all duration-300'
      )}>
        {children}
      </main>

      {/* Settings Dialog */}
      <SettingsDialog
        isOpen={isSettingsOpen}
        setIsOpen={setIsSettingsOpen}
      />
    </>
  );
};

export default Sidebar;
