'use client';

import { useState } from 'react';
import { Message } from '@/lib/types';
import crypto from 'crypto';
import { useRouter } from 'next/navigation';

export function useChat() {
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const router = useRouter();

  const createNewChat = async (chatId: string): Promise<any> => {
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
        },
        body: JSON.stringify(chatId)
      });

      if (!response.ok) {
        throw new Error('Failed to create new chat');
      }

      const data = await response.json();
      console.log('Chat created successfully:', data);
      return data;

    } catch (error) {
      console.error('Error creating new chat:', error);
      throw error;
    } finally {
      setIsCreatingChat(false);
    }
  };

  return { 
    createNewChat,
    isCreatingChat
  };
}
