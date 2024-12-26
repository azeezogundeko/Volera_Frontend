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
  const dividerRef = useRef<HTMLDivElement | null>(null);
  const messageEnd = useRef<HTMLDivElement | null>(null);

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

    if (messages.length === 1) {
      document.title = `${messages[0].content.substring(0, 30)} - Volera`;
    }
  }, [messages]);

  return (
    <div className={clsx(
      'flex flex-col h-full overflow-y-auto',
      'transition-colors duration-200'
    )}>
      <div className="flex-1 flex flex-col space-y-4 pt-8 pb-32">
        {messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center space-y-4">
            <VoleraLogo />
            <div className="h-px w-32 bg-gradient-to-r from-transparent via-[#4ade80]/30 to-transparent" />
          </div>
        )}
        <div className="flex-1 w-full max-w-4xl mx-auto px-4 md:px-8">
          {messages.map((msg, i) => {
            const isLast = i === messages.length - 1;

            return (
              <Fragment key={msg.messageId}>
                <div className="mb-6">
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
                    images={null}
                    imagesLoading={false}
                  />
                </div>
                {!isLast && msg.role === 'assistant' && (
                  <div className="h-px w-full bg-light-secondary dark:bg-dark-secondary mb-6" />
                )}
              </Fragment>
            );
          })}
          {loading && !messageAppeared && (
            <div className="flex flex-col space-y-4 mb-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 animate-pulse flex items-center justify-center">
                  <Bot size={16} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col">
                    <h3 className="text-black dark:text-white font-medium text-xl mb-1">
                      Response
                    </h3>
                    <p className="text-sm text-black/60 dark:text-white/60 mb-3">
                      {searchStatusMessage}
                    </p>
                  </div>
                  <div className="space-y-3">
                    {searchProgress.status === 'searching' && (
                      <div className="w-full bg-light-50 dark:bg-dark-50 rounded-full h-1.5">
                        <div 
                          className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300" 
                          style={{ width: `${Math.min((searchProgress.websitesSearched / 10) * 100, 100)}%` }}
                        />
                      </div>
                    )}
                    {searchProgress.status === 'scraping' && (
                      <div className="w-full bg-light-50 dark:bg-dark-50 rounded-full h-1.5">
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
          <div ref={messageEnd} className="h-0" />
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-transparent backdrop-blur-sm border-t border-light-200 dark:border-dark-200">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-4">
          <MessageInput
            loading={loading}
            sendMessage={sendMessage}
            fileIds={fileIds}
            setFileIds={setFileIds}
            files={files}
            setFiles={setFiles}
          />
        </div>
      </div>
    </div>
  );
};
