'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, ArrowRight, ChevronUp, X, Wand2, Filter, Tag, Star, CircleDollarSign, ShoppingBag, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTheme } from 'next-themes';
import { websocketService, WebSocketMessage } from '@/lib/websocket';

interface MarketplaceSidebarProps {
  onFiltersUpdate: (filters: Record<string, any>) => void;
  currentFilters: Record<string, any>;
  currentProducts: Array<any>;
}

export function MarketplaceSidebar({ 
  onFiltersUpdate,
  currentFilters,
  currentProducts
}: MarketplaceSidebarProps) {
  const [mounted, setMounted] = useState(false);
  const [isChatExpanded, setIsChatExpanded] = useState(true);
  const [message, setMessage] = useState('');
  const [hasInteracted, setHasInteracted] = useState(false);
  const [messages, setMessages] = useState<Array<{
    content: string;
    isAI: boolean;
    filters?: Record<string, any>;
  }>>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  const QUICK_FILTERS = [
    { label: 'Under $100', icon: CircleDollarSign },
    { label: 'Top Rated', icon: Star },
    { label: 'Best Sellers', icon: ShoppingBag },
    { label: 'New Arrivals', icon: Zap },
    { label: 'On Sale', icon: Tag },
    { label: 'Premium', icon: Sparkles }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    setMounted(true);
    // Check if user has previously interacted
    const hasUserInteracted = localStorage.getItem('marketplaceSidebarInteracted') === 'true';
    setHasInteracted(hasUserInteracted);

    // Subscribe to WebSocket messages
    const unsubscribe = websocketService.subscribe((message: WebSocketMessage) => {
      if (message.type === 'FILTER_RESPONSE') {
        const { filters, aiResponse } = message.data;
        onFiltersUpdate(filters);
        setMessages(prev => [...prev, { content: aiResponse, isAI: true, filters }]);
        toast.success('Filters updated successfully', {
          className: theme === 'dark' ? 'bg-emerald-500 text-white' : 'bg-emerald-600 text-white'
        });
        setIsProcessing(false);
      } else if (message.type === 'ERROR') {
        toast.error(message.data.message || 'An error occurred');
        setIsProcessing(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const markAsInteracted = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      localStorage.setItem('marketplaceSidebarInteracted', 'true');
    }
  };

  const handleQuickFilter = async (filter: string) => {
    markAsInteracted();
    setMessage(filter);
    await handleSendMessage(filter);
  };

  const handleSendMessage = async (input?: string) => {
    const userMessage = input || message;
    if (!userMessage.trim()) return;

    markAsInteracted();
    setMessages(prev => [...prev, { content: userMessage, isAI: false }]);
    setMessage('');
    setIsProcessing(true);

    try {
      const aiResponse = await processMessage(userMessage);
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      toast.error('Failed to process request');
      setIsProcessing(false);
    }
  };

  const processMessage = async (message: string): Promise<{
    content: string;
    isAI: boolean;
    filters?: Record<string, any>;
  }> => {
    if (!currentProducts || !Array.isArray(currentProducts)) {
      toast.error('No products available for filtering');
      throw new Error('No products available');
    }

    const success = await websocketService.sendMessage({
      type: 'FILTER_REQUEST',
      data: {
        message,
        currentProducts: currentProducts,
        currentFilters: currentFilters || {}
      }
    });

    if (!success) {
      throw new Error('Failed to send message');
    }

    return {
      content: 'Processing your request...',
      isAI: true
    };
  };

  if (!mounted) {
    return null; 
  }

  return (
    <div className="w-full h-screen bg-white dark:bg-[#0a0a0a] border-l border-gray-200 dark:border-white/10 flex flex-col lg:w-[350px] lg:fixed lg:right-0 lg:top-0">
      {/* Close button - Only shown on mobile */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-white/10 shrink-0 bg-white dark:bg-[#0a0a0a] sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center">
            <Filter className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
          </div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white/90">Filters & Assistant</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-white/10"
          onClick={() => onFiltersUpdate(currentFilters)}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Scrollable Content */}
      <ScrollArea className="flex-1 overflow-y-auto">
        <div className="h-full flex flex-col">
          {/* Active Filters Section */}
          <div className="p-4 border-b border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white/90 flex items-center gap-2">
                <Filter className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
                Active Filters
              </h3>
              {Object.keys(currentFilters).length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-xs text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white/90"
                  onClick={() => onFiltersUpdate({})}
                >
                  Clear All
                </Button>
              )}
            </div>
            <div className="space-y-2">
              {Object.entries(currentFilters).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10"
                >
                  <span className="text-sm text-gray-700 dark:text-white/70 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-emerald-600 dark:text-emerald-400">
                      {value.toString()}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 hover:bg-gray-100 dark:hover:bg-white/10"
                      onClick={() => {
                        const newFilters = { ...currentFilters };
                        delete newFilters[key];
                        onFiltersUpdate(newFilters);
                      }}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
              {Object.keys(currentFilters).length === 0 && (
                <div className="text-sm text-gray-500 dark:text-white/50 text-center py-2">
                  No filters applied
                </div>
              )}
            </div>
          </div>

          {/* Quick Filters */}
          <div className="p-4 border-b border-gray-200 dark:border-white/10">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white/90 mb-3 flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
              Quick Filters
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {QUICK_FILTERS.map((filter) => (
                <Button
                  key={filter.label}
                  variant="outline"
                  className="h-9 text-xs bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-200 dark:hover:border-emerald-500/20"
                  onClick={() => handleQuickFilter(filter.label)}
                >
                  <filter.icon className="w-3.5 h-3.5 mr-2" />
                  {filter.label}
                </Button>
              ))}
            </div>
          </div>

          {/* AI Assistant Section */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white/90">
                  AI Shopping Assistant
                </h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setIsChatExpanded(!isChatExpanded)}
              >
                {isChatExpanded ? <ChevronUp className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </Button>
            </div>

            <AnimatePresence>
              {isChatExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 flex flex-col min-h-0"
                >
                  <div className="flex-1 overflow-y-auto">
                    <div className="px-4">
                      <div className="space-y-4 py-4">
                        {/* Welcome Message - Only shown if user hasn't interacted */}
                        {!hasInteracted && (
                          <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
                            <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-1">
                              Welcome! Try asking for:
                            </p>
                            <p className="text-sm text-gray-700 dark:text-white/70">
                              "Show me wireless headphones under $200"
                            </p>
                            <p className="text-sm text-gray-700 dark:text-white/70">
                              "Find top-rated gaming monitors"
                            </p>
                          </div>
                        )}

                        {/* Chat Messages */}
                        {messages.map((msg, index) => (
                          <div 
                            key={index}
                            className={cn(
                              'p-3 rounded-lg text-sm',
                              msg.isAI 
                                ? 'bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white/90' 
                                : 'bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 ml-8'
                            )}
                          >
                            {msg.content.split('\n').map((line, i) => (
                              <p key={i} className="mb-1 last:mb-0">{line}</p>
                            ))}
                          </div>
                        ))}
        
                        {isProcessing && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-2 text-sm text-gray-500 dark:text-white/50"
                          >
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ repeat: Infinity, duration: 0.8 }}
                            >
                              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            </motion.div>
                            Processing your request...
                          </motion.div>
                        )}
        
                        <div ref={messagesEndRef} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </ScrollArea>

      {/* Input Area - Fixed at bottom */}
      {isChatExpanded && (
        <div className="p-4 border-t border-gray-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a] shrink-0">
          <div className="relative">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask the AI assistant to help you find products..."
              className="min-h-[80px] resize-none bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white/90 placeholder:text-gray-500 dark:placeholder:text-white/50"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button 
              size="sm" 
              className="absolute right-2 bottom-2 h-8 w-8 p-0 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600" 
              onClick={() => handleSendMessage()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}