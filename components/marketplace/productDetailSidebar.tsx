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

const ProductDetailSidebar = ({ product, isOpen, onClose }: ProductDetailSidebarProps) => {
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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsClient(true);
    }
  }, []);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    setMessages(prev => [...prev, { content: message, isAI: false }]);
    setMessage('');
    setIsProcessing(true);
  };

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
          className="fixed lg:relative inset-y-0 right-0 w-full sm:w-[350px] bg-white dark:bg-[#0a0a0a] border-l border-gray-200 dark:border-white/10 flex flex-col z-50"
        >
          <div className="p-4">
            <h3 className="text-lg font-semibold">{product.name}</h3>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ProductDetailSidebar; 