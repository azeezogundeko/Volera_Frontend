'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, ArrowRight, ChevronUp, X, MessageCircle, Star, ShoppingBag, CircleDollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTheme } from 'next-themes';

interface ProductDetailSidebarProps {
  product: {
    id: string;
    name: string;
    price: number;
    rating: number;
    category: string;
    description: string;
  };
}

export function ProductDetailSidebar({ product }: ProductDetailSidebarProps) {
  const [mounted, setMounted] = useState(false);
  const [isChatExpanded, setIsChatExpanded] = useState(true);
  const [message, setMessage] = useState('');
  const [hasInteracted, setHasInteracted] = useState(false);
  const [messages, setMessages] = useState<Array<{
    content: string;
    isAI: boolean;
  }>>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
    const hasUserInteracted = localStorage.getItem(`productChat_${product.id}`) === 'true';
    setHasInteracted(hasUserInteracted);
  }, [product.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const markAsInteracted = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      localStorage.setItem(`productChat_${product.id}`, 'true');
    }
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
      
      toast.success('Response received', {
        className: theme === 'dark' ? 'bg-emerald-500 text-white' : 'bg-emerald-600 text-white'
      });
    } catch (error) {
      toast.error('Failed to process request');
    } finally {
      setIsProcessing(false);
    }
  };

  const processMessage = async (message: string): Promise<{
    content: string;
    isAI: boolean;
  }> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const lowerMessage = message.toLowerCase();
    let response = '';

    // Simulate AI responses based on common product questions
    if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      response = `The ${product.name} is priced at $${product.price}. This price includes standard shipping.`;
    } else if (lowerMessage.includes('rating') || lowerMessage.includes('review')) {
      response = `This product has a rating of ${product.rating} out of 5 stars based on customer reviews.`;
    } else if (lowerMessage.includes('shipping') || lowerMessage.includes('delivery')) {
      response = `We offer standard shipping (5-7 business days) and express shipping (2-3 business days) for this product. Would you like more details about shipping options?`;
    } else if (lowerMessage.includes('warranty') || lowerMessage.includes('guarantee')) {
      response = `This product comes with a standard 1-year manufacturer warranty. Extended warranty options are available at checkout.`;
    } else if (lowerMessage.includes('specification') || lowerMessage.includes('specs')) {
      response = `Here are the key specifications for ${product.name}:\n${product.description}\n\nWould you like more specific details about any feature?`;
    } else {
      response = `I'd be happy to help you with information about ${product.name}. You can ask about:\n• Price and availability\n• Specifications and features\n• Shipping options\n• Warranty coverage\n• Customer reviews`;
    }

    return {
      content: response,
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
            <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
          </div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white/90">Product Assistant</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-white/10"
          onClick={() => setIsChatExpanded(!isChatExpanded)}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Product Info */}
      <div className="p-4 border-b border-gray-200 dark:border-white/10">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white/90 mb-2">{product.name}</h3>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-gray-700 dark:text-white/70">
            <CircleDollarSign className="w-4 h-4" />
            ${product.price}
          </div>
          <div className="flex items-center gap-1 text-gray-700 dark:text-white/70">
            <Star className="w-4 h-4 text-yellow-400" />
            {product.rating}
          </div>
          <div className="flex items-center gap-1 text-gray-700 dark:text-white/70">
            <ShoppingBag className="w-4 h-4" />
            {product.category}
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <ScrollArea className="flex-1 overflow-y-auto">
        <div className="h-full flex flex-col">
          {/* AI Assistant Section */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white/90">
                  Ask about this product
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
                              Hello! Ask me anything about this product:
                            </p>
                            <p className="text-sm text-gray-700 dark:text-white/70">
                              • Price and availability
                            </p>
                            <p className="text-sm text-gray-700 dark:text-white/70">
                              • Specifications and features
                            </p>
                            <p className="text-sm text-gray-700 dark:text-white/70">
                              • Shipping and warranty
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
                            Finding product information...
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
              placeholder="Ask about this product..."
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
