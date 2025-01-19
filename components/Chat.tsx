'use client';

import { Fragment, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import MessageInput from './MessageInput';
import { File, Message } from './ChatWindow';
import MessageBox from './MessageBox';
import MessageBoxLoading from './MessageBoxLoading';
import VoleraLogo from './VoleraLogo';
import Bot from './Bot';

export default function Chat({
  loading,
  messages,
  sendMessage,
  messageAppeared,
  searchProgress,
  searchStatusMessage,
  rewrite,
  fileIds,
  setFileIds,
  files,
  setFiles,
}: {
  messages: Message[];
  sendMessage: (message: string) => void;
  loading: boolean;
  messageAppeared: boolean;
  searchProgress: {
    websitesSearched: number;
    websitesScraped: number;
    status: 'searching' | 'scraping' | 'compiling' | null;
  };
  searchStatusMessage: string;
  rewrite: (messageId: string) => void;
  fileIds: string[];
  setFileIds: (fileIds: string[]) => void;
  files: File[];
  setFiles: (files: File[]) => void;
}) {
  const [dividerWidth, setDividerWidth] = useState(0);
  const [visibleMessageId, setVisibleMessageId] = useState<string | null>(null);
  const dividerRef = useRef<HTMLDivElement | null>(null);
  const messageEnd = useRef<HTMLDivElement | null>(null);

  const handleVisibilityChange = (messageId: string, isVisible: boolean) => {
    if (isVisible) {
      setVisibleMessageId(messageId);
    } else if (visibleMessageId === messageId) {
      setVisibleMessageId(null);
    }
  };

  useEffect(() => {
    const updateDividerWidth = () => {
      if (dividerRef.current) {
        setDividerWidth(dividerRef.current.scrollWidth);
      }
    };

    updateDividerWidth();

    window.addEventListener('resize', updateDividerWidth);

    return () => {
      window.removeEventListener('resize', updateDividerWidth);
    };
  });

  useEffect(() => {
    messageEnd.current?.scrollIntoView({ behavior: 'smooth' });

    if (messages && messages.length > 0 && messages[0] && messages[0].content) {
      document.title = `${messages[0].content.substring(0, 30)} - Volera`;
    }
  }, [messages]);

  return (
    <div className="flex flex-col min-h-0 flex-1 overflow-hidden">
      <div className="flex-1 overflow-y-auto px-1 sm:px-2 pt-4 sm:pt-6 relative z-0 mb-24 sm:mb-32">
        {messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center space-y-4">
            <VoleraLogo />
            <Bot />
          </div>
        )}
        {messages.map((msg, i) => {
          const isLast = i === messages.length - 1;
          const previousMessageId = i > 0 ? messages[i - 1].messageId : null; // Get the previous message ID
          // console.log(msg.images)
          // console.log(visibleMessageId)
          // console.log(previousMessageId)
          const currentImages = msg.role === 'assistant' && previousMessageId === visibleMessageId ? (msg.images || null) : null;

          return (
            console.log('Current Images:', currentImages),
            <Fragment key={msg.messageId}>
              <div className="mb-4 sm:mb-6 max-w-[95%] w-full mx-auto">
                <MessageBox
                  key={msg.messageId}
                  message={msg}
                  messageIndex={i}
                  history={messages}
                  loading={loading}
                  dividerRef={isLast ? dividerRef : undefined}
                  isLast={isLast}
                  rewrite={rewrite}
                  sendMessage={sendMessage}
                  images={currentImages}
                  imagesLoading={msg.imagesLoading || false}
                  onVisibilityChange={handleVisibilityChange}
                />
              </div>
              {/* <div className="h-px w-full max-w-3xl mx-auto bg-[#222222] mb-4 sm:mb-6" /> */}
            </Fragment>
          );
        })}
        {loading && !messageAppeared && (
          <div className="flex flex-col space-y-4 mb-4 sm:mb-6 max-w-3xl mx-auto">
            <div className="flex items-start space-x-3 sm:space-x-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 animate-pulse flex items-center justify-center">
                <Bot size={16} className="text-white" />
              </div>
              <div className="flex-1">
                <div className="flex flex-col">
                  <h3 className="text-white font-medium text-lg sm:text-xl mb-1">
                    Response
                  </h3>
                  <p className="text-xs sm:text-sm text-white/60 mb-3">
                    {searchStatusMessage}
                  </p>
                </div>
                <div className="space-y-3">
                  {searchProgress.status === 'searching' && (
                    <div className="w-full bg-[#222222] rounded-full h-1.5">
                      <div 
                        className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300" 
                        style={{ width: `${Math.min((searchProgress.websitesSearched / 10) * 100, 100)}%` }}
                      />
                    </div>
                  )}
                  {searchProgress.status === 'scraping' && (
                    <div className="w-full bg-[#222222] rounded-full h-1.5">
                      <div 
                        className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300" 
                        style={{ width: `${Math.min((searchProgress.websitesScraped / 5) * 100, 100)}%` }}
                      />
                    </div>
                  )}
                  {searchProgress.status === 'compiling' && (
                    <div className="flex items-center justify-center py-2">
                      <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messageEnd} />
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-transparent z-20">
        <div className="absolute inset-0 bg-white/20 dark:bg-[#111111]/20 backdrop-blur-sm"></div>
        <div className="max-w-3xl mx-auto px-3 sm:px-6 py-3 sm:py-4 relative">
          <MessageInput
            sendMessage={sendMessage}
            loading={loading}
            fileIds={fileIds}
            setFileIds={setFileIds}
            files={files}
            setFiles={setFiles}
          />
        </div>
      </div>
    </div>
  );
}
