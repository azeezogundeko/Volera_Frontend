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
  LogOut,
  Scale,
  Twitter,
  Linkedin,
  Share2
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSelectedLayoutSegments } from 'next/navigation';
import React, { useState, type ReactNode, useEffect, useCallback } from 'react';
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
// const ProFeature = ({ expanded }: { expanded: boolean }) => {
//   if (!expanded) return null;
  
//   return (
//     <div className="px-3 mt-2 mb-4">
//       <div className="rounded-lg bg-emerald-600 p-3 space-y-3">
//         <h3 className="text-white text-sm font-medium">Try Pro</h3>
//         <p className="text-xs text-emerald-100">
//           Upgrade for image upload, smarter AI, and more Pro Search.
//         </p>
//         <Link
//           href="/pro"
//           className="inline-flex items-center gap-1 text-xs text-white/90 hover:text-white transition-colors group"
//         >
//           Learn More
//           <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
//         </Link>
//       </div>
//     </div>
//   );
// };

const UserButton = ({ expanded }: { expanded: boolean }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check authentication status
    const token = localStorage.getItem('auth_token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_email');
    setIsAuthenticated(false);
    router.push('/login');
  };

  if (!isAuthenticated) {
    return (
      <Link href="/login" className={cn(
        "flex items-center gap-2",
        expanded ? "px-3 py-2" : "justify-center p-2",
        "text-sm text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white/90 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors"
      )}>
        <span>{expanded ? "Sign in" : "→"}</span>
      </Link>
    );
  }

  return (
    <button 
      onClick={handleLogout}
      className={cn(
        "flex items-center gap-2 w-full",
        expanded ? "px-3 py-2" : "justify-center p-2",
        "text-sm text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white/90 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors"
      )}
    >
      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center flex-shrink-0">
        <LogOut className="w-4 h-4" />
      </div>
      {expanded && <span className="flex-1 text-left">Logout</span>}
    </button>
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

const SocialIcons = ({ expanded }: { expanded: boolean }) => {
  return (
    <div className={cn(
      'flex gap-2',
      expanded ? 'px-3 justify-start' : 'justify-center'
    )}>
      <Link
        href="https://twitter.com"
        target="_blank"
        className="p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
      >
        <X className="w-4 h-4 text-gray-500 dark:text-white/50" />
      </Link>
      <Link
        href="https://linkedin.com"
        target="_blank"
        className="p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
      >
        <Linkedin className="w-4 h-4 text-gray-500 dark:text-white/50" />
      </Link>
      <Link
        href="https://bsky.app"
        target="_blank"
        className="p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
      >
        <svg className="w-4 h-4 text-gray-500 dark:text-white/50" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L1 21h22L12 2zm0 4.5l7.5 13H4.5L12 6.5z"/>
        </svg>
      </Link>
    </div>
  );
};

const Sidebar = ({ children }: { children: React.ReactNode }) => {
  // Initialize expanded state to true by default for SSR consistency
  const [expanded, setExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProUser, setIsProUser] = useState(false);
  const router = useRouter();
  const segments = useSelectedLayoutSegments();
  const { theme } = useTheme();

  // Store current path to detect actual route changes
  const [currentPath, setCurrentPath] = useState('');

  // Update expanded state from localStorage after mount
  useEffect(() => {
    const savedState = localStorage.getItem('sidebar-expanded');
    if (savedState !== null) {
      setExpanded(savedState === 'true');
    }
  }, []);

  // Check Pro status after mount
  useEffect(() => {
    const userStatus = localStorage.getItem('userStatus');
    setIsProUser(userStatus === 'true');
  }, []);

  // Persist sidebar state to localStorage
  useEffect(() => {
    localStorage.setItem('sidebar-expanded', expanded.toString());
  }, [expanded]);

  // Close mobile menu only on actual route changes
  useEffect(() => {
    const pathname = window.location.pathname;
    if (currentPath && pathname !== currentPath) {
      setIsMobileMenuOpen(false);
    }
    setCurrentPath(pathname);
  }, [segments, currentPath]);

  // Handle mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1024) { // lg breakpoint
        setIsMobileMenuOpen(false); // Always close mobile menu on desktop
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleExpanded = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setExpanded(prev => !prev);
  }, []);

  const toggleMobileMenu = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMobileMenuOpen(prev => !prev);
  }, []);

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
        <nav className="space-y-4 py-6 px-3">
          <div className="px-2">
            <NewChatButton expanded={true} />
          </div>

          <div className="space-y-1">
            <IconButton
              href="/dashboard" 
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
            {/* <IconButton
              href="/discover"
              icon={Compass}
              label="Discover"
              expanded={true}
              active={segments[0] === 'discover'}
            /> */}
            <IconButton
              href="/wishlist"
              icon={Heart}
              label="Wishlist"
              expanded={true}
              active={segments[0] === 'wishlist'}
            />
            <IconButton
              href="/marketplace"
              icon={Store}
              label="Marketplace"
              expanded={true}
              active={segments[0] === 'marketplace'}
            />
            <IconButton
              href="/compare"
              icon={Scale}
              label="Compare"
              expanded={true}
              active={segments[0] === 'compare'}
            />
            <IconButton
              href="/refer"
              icon={Share2}
              label="Refer & Earn"
              expanded={true}
              active={segments[0] === 'refer'}
            />
          </div>
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
        <UserButton expanded={true} />
        <SocialIcons expanded={true} />
      </div>
    </div>
  );

  // Desktop sidebar content with collapsible state
  const desktopSidebarContent = (
    <div
      className={cn(
        'flex flex-col h-full',
        expanded ? 'w-[280px]' : 'w-16',
        'bg-white dark:bg-[#111111]',
        'border-r border-gray-200 dark:border-white/10',
        'transition-all duration-300'
      )}
    >
      {/* Logo Section - Desktop */}
      <div
        className={cn(
          'flex items-center',
          expanded ? 'justify-center' : 'justify-center',
          'h-16 px-4 border-b border-gray-200 dark:border-white/10',
          'relative'
        )}
      >
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
        <nav className="space-y-4">
          <div className="px-2">
            <NewChatButton expanded={expanded} />
          </div>

          <div className="space-y-1">
            <IconButton
              href="/dashboard"
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
            {/* <IconButton
              href="/discover"
              icon={Compass}
              label="Discover"
              expanded={expanded}
              active={segments[0] === 'discover'}
            /> */}
            <IconButton
              href="/wishlist"
              icon={Heart}
              label="Wishlist"
              expanded={expanded}
              active={segments[0] === 'wishlist'}
            />
            <IconButton
              href="/marketplace"
              icon={Store}
              label="Marketplace"
              expanded={expanded}
              active={segments[0] === 'marketplace'}
            />
            <IconButton
              href="/compare"
              icon={Scale}
              label="Compare"
              expanded={expanded}
              active={segments[0] === 'compare'}
            />
            <IconButton
              href="/refer"
              icon={Share2}
              label="Refer & Earn"
              expanded={expanded}
              active={segments[0] === 'refer'}
            />
          </div>

          {isProUser ? (
            <div className="space-y-1">
              <IconButton
                href="/pro"
                icon={TrendingUp}
                label="Pro Dashboard"
                expanded={expanded}
                active={segments[0] === 'pro'}
              />
              <IconButton
                href="/pro/settings"
                icon={Settings}
                label="Pro Settings"
                expanded={expanded}
                active={segments[0] === 'pro' && segments[1] === 'settings'}
              />
            </div>
          ) : null}
        </nav>
      </div>

      {/* Settings and User Profile */}
      <div
        className={cn(
          'mt-auto border-t border-gray-200 dark:border-white/10',
          'p-4 space-y-3'
        )}
      >
        <IconButton
          href="#"
          icon={Settings}
          label="Settings"
          expanded={expanded}
          onClick={() => setIsSettingsOpen(true)}
        />
        <UserButton expanded={expanded} />
        <SocialIcons expanded={expanded} />
      </div>
    </div>
  );

  return (
    <>
      <Toaster position="top-center" />
      {/* Mobile Menu Button - Always rendered, visibility controlled by CSS */}
      <button
        onClick={toggleMobileMenu}
        type="button"
        aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        className="fixed top-4 left-4 z-[99] p-2 rounded-lg bg-white dark:bg-[#1a1a1a] shadow-lg border border-gray-200 dark:border-white/10 lg:hidden flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
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
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[97] lg:hidden"
              onClick={(e) => {
                console.log('Backdrop clicked');
                e.preventDefault();
                e.stopPropagation();
                setIsMobileMenuOpen(false);
              }}
            />
            <motion.div
              key="sidebar"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ 
                type: "spring", 
                stiffness: 300,
                damping: 30,
                duration: 0.3
              }}
              className="fixed top-0 left-0 bottom-0 z-[98] lg:hidden"
              onClick={(e) => {
                console.log('Sidebar clicked');
                e.stopPropagation();
              }}
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
        'transition-all duration-300',
        'pt-16 lg:pt-0'
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
