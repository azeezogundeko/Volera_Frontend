'use client';

import { useState, useEffect } from 'react';
import { Message } from '@/lib/types';
import crypto from 'crypto';
import router from 'next/router';

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatId, setChatId] = useState(crypto.randomBytes(16).toString('hex'));
  const [isCreatingChat, setIsCreatingChat] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
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
      if (typeof window !== 'undefined') {
        router.push(`/c/${data.id}`);
      }
    };

    fetchData();
  }, []); // Dependency array as needed

  const createNewChat = async (): Promise<any> => {
    if (typeof window === 'undefined') {
      console.error('Router can only be used on the client side.');
      return null;
    }

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
      console.log('Chat created successfully:', data); 
      return data;

    } catch (error) {
      console.error('Error creating new chat:', error); // Log any errors
    } 
    
  };

  return { 
    createNewChat, 
    messages, 
    isLoading, 
    chatId, 
    isCreatingChat 
  };
}
