'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useChat } from '@/hooks/useChat';
import ChatWindow from '@/components/ChatWindow';
import { cn } from '@/lib/utils';

export default function Home() {
  const { messages, createNewChat, isLoading } = useChat();
  const [input, setInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const chat = await createNewChat();
    if (chat) {
      if (chat.sendMessage) {
        await chat.sendMessage(input);
      } else {
        console.error('sendMessage is null.');
      }
    } else {
      console.error('Chat creation failed.');
    }
    setInput('');
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-light-100 to-light-200 dark:from-dark-100 dark:to-dark-200">
      {/* Header */}
      <header className="w-full py-6 px-4 sm:px-6 lg:px-8 border-b border-light-200 dark:border-dark-200">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-black/90 dark:text-white/90">
            Volera
          </h1>
        </div>
      </header>

      {/* Chat Container */}
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col">
        {/* Chat Window */}
        <div className="flex-1 mb-6 overflow-hidden">
          <ChatWindow 
            messages={messages} 
            isLoading={isLoading}
            id="home-chat"
            initialFocusMode="all"
          />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            className={cn(
              'w-full px-4 py-3 rounded-lg',
              'bg-white dark:bg-dark-100',
              'border border-light-200 dark:border-dark-200',
              'text-black dark:text-white',
              'placeholder:text-black/50 dark:placeholder:text-white/50',
              'focus:outline-none focus:ring-2 focus:ring-primary/50',
              'shadow-sm'
            )}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className={cn(
              'absolute right-2 top-1/2 -translate-y-1/2',
              'px-4 py-1.5 rounded-md',
              'bg-primary text-white',
              'hover:bg-primary/90',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'transition-colors'
            )}
          >
            Send
          </button>
        </form>
      </div>
    </main>
  );
}
