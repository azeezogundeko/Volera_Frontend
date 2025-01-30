'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, X, Sparkles } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { websocketService, WebSocketMessage } from '@/lib/websocket';
import { ProductDetail } from '@/types/productDetail';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

interface Message {
  content: string;
  isAI: boolean;
}

export default function ChatSidebar({ isOpen, onClose, products }: { isOpen: boolean; onClose: () => void; products: ProductDetail[] }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    if (!hasInteracted) {
      setMessages([
        {
          content: "Hello! I'm your Compare Assistant. I can help you compare products, analyze their features, and make recommendations. What would you like to know about the products you're comparing?",
          isAI: true
        }
      ]);
      setHasInteracted(true);
    }
  }, [hasInteracted]);

  useEffect(() => {
    const unsubscribe = websocketService.subscribe((message: WebSocketMessage) => {
      if (message.type === 'COMPARE_RESPONSE') {
        const aiMessage = message.data as { response?: string };
        if (aiMessage.response && aiMessage.response.trim() !== '') {
          setMessages(prev => [...prev, {
            content: aiMessage.response || "Default message content",
            isAI: true
          }]);
          setIsProcessing(false);
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

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim() || isProcessing) return;

    const userMessage = {
      content: message.trim(),
      isAI: false
    };
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsProcessing(true);

    try {
      await websocketService.sendMessage({
        type: 'COMPARE_REQUEST',
        data: {
          query: userMessage.content,
          products: products
        },
        message: undefined
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 dark:border-[#222] flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-6 h-6 text-[#4ade80]" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Compare Assistant</h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors lg:hidden"
        >
          <X className="w-8 h-8 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={cn(
                "flex flex-col space-y-2 text-sm",
                msg.isAI ? "items-start" : "items-end"
              )}
            >
              <div
                className={cn(
                  "p-3 rounded-lg text-sm",
                  msg.isAI 
                    ? "bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white/90" 
                    : "bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
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
            </div>
          ))}
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-sm text-gray-500 dark:text-white/50 p-3"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
              >
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </motion.div>
              Finding answer...
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-gray-200 dark:border-[#222]">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask about the products..."
            className="flex-1 min-h-[2.5rem] max-h-32 resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e as any);
              }
            }}
          />
          <Button 
            type="submit"
            size="icon"
            className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
            disabled={isProcessing}
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
