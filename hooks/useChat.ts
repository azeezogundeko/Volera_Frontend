'use client';

import { useState } from 'react';
import { Message } from '@/lib/types';

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (content: string) => {
    try {
      setIsLoading(true);
      
      // Add user message
      const userMessage: Message = {
        role: 'user',
        content,
      };
      setMessages(prev => [...prev, userMessage]);

      // Simulate AI response (replace with actual API call)
      const aiMessage: Message = {
        role: 'assistant',
        content: 'I understand you\'re looking for shopping assistance. How can I help you today?',
      };
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    sendMessage,
    isLoading,
  };
}
