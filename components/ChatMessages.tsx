'use client';

import React from 'react';
import Image from 'next/image';
import { Message } from './ChatWindow';
import ChatProductCard from './ChatProductCard';

interface ChatMessagesProps {
  messages: Message[];
  setCurrentImageIndex: (index: number) => void;
  setIsLightboxOpen: (isOpen: boolean) => void;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  setCurrentImageIndex,
  setIsLightboxOpen,
}) => {
  return (
    <>
      {messages.map((message) => (
        <div
          key={message.messageId}
          className={`flex ${
            message.role === 'assistant' ? 'justify-start' : 'justify-end'
          }`}
        >
          <div
            className={`max-w-[80%] rounded-lg p-4 ${
              message.role === 'assistant'
                ? 'bg-white text-gray-900'
                : 'bg-emerald-600 text-white'
            }`}
          >
            {message.type === 'image' && message.images && (
              <div className="mb-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {message.images.map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-square cursor-pointer"
                      onClick={() => {
                        setCurrentImageIndex(index);
                        setIsLightboxOpen(true);
                      }}
                    >
                      <Image
                        src={image.img_url}
                        alt={image.title}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {message.type === 'product' && message.products && (
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-3">Suggested Products:</h3>
                <div className="flex flex-col gap-3">
                  {message.products.map((product, index) => (
                    <ChatProductCard key={`${product.product_id}-${index}`} product={product} />
                  ))}
                </div>
              </div>
            )}

            <div className="prose prose-sm dark:prose-invert max-w-none">
              {message.content}
            </div>

            {message.sources && message.sources.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-3">Sources:</h3>
                <ul className="list-disc pl-4">
                  {message.sources.map((source, index) => (
                    <li key={index}>{source.pageContent}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ))}
    </>
  );
};

export default ChatMessages;
