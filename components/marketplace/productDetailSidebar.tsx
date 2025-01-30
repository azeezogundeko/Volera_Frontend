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
import ReactMarkdown from 'react-markdown';
import { websocketService, ProductDetailsResponse, WebSocketMessage } from '@/lib/websocket';

import { ProductDetail } from '@/types/productDetail'

interface ProductDetailSidebarProps {
  product: ProductDetail;
  isOpen?: boolean;
  onClose?: () => void;
}

export function ProductDetailSidebar({ product, isOpen, onClose }: ProductDetailSidebarProps) {
  const [isClient, setIsClient] = useState(false);
  const [isChatExpanded, setIsChatExpanded] = useState(true);
  const [message, setMessage] = useState('');
  const [hasInteracted, setHasInteracted] = useState(false);
  const [messages, setMessages] = useState<Array<{
    content: string;
    isAI: boolean;
  }>>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  // useEffect(() => {
  //   console.log('Product in useEffect:', product);
  //   const fetchInitialDetails = async () => {
  //     try {
  //       const defaultQuery = `Tell me more about the ${product.name} from ${product.brand || 'the seller'}. What are its key features and benefits?`;
  //       console.log('Sending WebSocket message with product:', {
  //         productId: product.product_id,
  //         name: product.name,
  //         brand: product.brand
  //       });
  //       await websocketService.sendMessage({
  //         type: 'PRODUCT_DETAILS_REQUEST',
  //         data: {
  //           product: product,
  //           query: defaultQuery
  //         },
  //         message: undefined
  //       });
  //     } catch (error) {
  //       console.error('Failed to fetch initial product details:', error);
  //     }
  //   };

  //   fetchInitialDetails();
  // }, [product]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsClient(true);
      const hasUserInteracted = localStorage.getItem(`productChat_${product.product_id}`) === 'true';
      setHasInteracted(hasUserInteracted);

      // Subscribe to WebSocket messages
      const unsubscribe = websocketService.subscribe((message: WebSocketMessage) => {
        console.log('Received WebSocket message in ProductDetailSidebar:', message);
        
        if (message.type === 'PRODUCT_DETAILS_RESPONSE') {
          const productMessage = message.data as { productId?: string, aiResponse?: string };


          if (productMessage.productId === product.product_id) {
            try {
              // Add AI response to messages
              setMessages(prev => {
                console.log('Previous Messages:', prev);
                // Only add the message if aiResponse is not empty or undefined
                if (productMessage.aiResponse && productMessage.aiResponse.trim() !== '') {
                  const newMessages = [...prev, {
                    content: productMessage.aiResponse,
                    isAI: true
                  }];
                  // console.log('New Messages:', newMessages);
                  return newMessages;
                }
                return prev;
              });
              // toast.success('Product details retrieved', {
              //   className: resolvedTheme === 'dark' ? 'bg-emerald-500 text-white' : 'bg-emerald-600 text-white'
              // });
            } catch (error) {
              // console.error('Error processing product details:', error);
              toast.error('Error retrieving product details');
            }
            setIsProcessing(false);
          } else {
            console.log('Product ID mismatch', {
              messageProductId: productMessage.productId,
              currentProductId: product.product_id
            });
          }
        }

        else if (message.type === 'ERROR') {
          const errorMessage = message
          setMessages(prev => {
            if (errorMessage.message && errorMessage.message.trim() !== '') {
              const newMessages = [...prev, {
                content: errorMessage.message,
                isAI: true
              }];
              return newMessages;
            }
            return prev;
          });

        }
      });

      return () => unsubscribe();
    }
  }, [product.product_id, resolvedTheme]);

  useEffect(() => {
    if (isClient) {
      scrollToBottom();
    }
  }, [messages, isClient]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const markAsInteracted = () => {
    if (!hasInteracted && typeof window !== 'undefined') {
      setHasInteracted(true);
      localStorage.setItem(`productChat_${product.product_id}`, 'true');
    }
  };

  const handleSendMessage = async () => {
    const userMessage = message;
    if (!userMessage.trim()) return;

    markAsInteracted();
    setMessages(prev => [...prev, { content: userMessage, isAI: false }]);
    setMessage('');
    setIsProcessing(true);

    try {
      // Send message via WebSocket
      websocketService.sendMessage({
        type: 'PRODUCT_DETAILS_REQUEST',
        data: {
          product: product,
          query: userMessage
        },
        message: undefined
      });
    } catch (error) {
      toast.error('Failed to send message');
      setIsProcessing(false);
    }
  };

  // Only render client-side content
  if (!isClient) {
    return null;
  }

  return (
    <AnimatePresence>
      {(isOpen && isClient) && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: "0%" }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 20 }}
          className={cn(
            "fixed lg:relative inset-y-0 right-0 w-full sm:w-[350px] bg-white dark:bg-[#0a0a0a] border-l border-gray-200 dark:border-white/10 flex flex-col",
            "z-50 lg:z-0 lg:h-[calc(100vh-4rem)] lg:sticky lg:top-16"
          )}
        >
          {/* Close button - Only shown on mobile */}
          <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a] sticky top-0 z-10">
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
              onClick={onClose}
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
                {product.currency}{product.current_price}
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
                                <ReactMarkdown
                                    className="prose prose-sm dark:prose-invert"
                                    components={{
                                      strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
                                      p: ({ node, ...props }) => <p className="mb-2" {...props} />
                                    }}
                                    // breaks
                                  >
                                    {msg.content}
                                  </ReactMarkdown>
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

          {/* Additional Details Section */}
          {/* {extendedDetails && (
            <div className="p-4 border-b border-gray-200 dark:border-white/10">
              <h4 className="text-sm font-semibold mb-2 text-gray-900 dark:text-white/90">
                Extended Product Information
              </h4>
              {extendedDetails.technicalSpecs && (
                <div className="space-y-1">
                  {Object.entries(extendedDetails.technicalSpecs).map(([key, value]) => (
                    <div key={key} className="text-sm text-gray-700 dark:text-white/70">
                      <span className="font-medium">{key}:</span> {String(value)}
                    </div>
                  ))}
                </div>
              )}
              {extendedDetails.availability && (
                <div className="text-sm text-gray-700 dark:text-white/70 mt-2">
                  <span className="font-medium">Availability:</span> {' '}
                  {extendedDetails.availability.inStock ? 'In Stock' : 'Out of Stock'}
                  {extendedDetails.availability.estimatedDelivery && (
                    ` (Estimated Delivery: ${extendedDetails.availability.estimatedDelivery})`
                  )}
                </div>
              )}
              {extendedDetails.aiSummary && (
                <div className="text-sm text-gray-700 dark:text-white/70 mt-2">
                  <span className="font-medium">AI Summary:</span> {extendedDetails.aiSummary}
                </div>
              )}
            </div>
          )} */}

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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
