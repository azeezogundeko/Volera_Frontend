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
  thinkingMessages,
  rewrite,
  fileIds,
  setFileIds,
  files,
  setFiles,
  isError,
  selectedModel,
  setSelectedModel,
  handleFileUpload,
  handleRemoveFile,
  handleCancelSearch,
  loadingState,
  isSearching,
  isSpeaking,
  toggleSpeech,
}: {
  messages: Message[];
  sendMessage: (message: string) => void;
  loading?: boolean;
  messageAppeared: boolean;
  searchProgress: {
    websitesSearched: number;
    websitesScraped: number;
    status: 'searching' | 'scraping' | 'compiling' | 'error' | null;
    workingProcess: string[];
  };
  thinkingMessages: string[];
  rewrite: (messageId: string) => void;
  fileIds: string[];
  setFileIds: (fileIds: string[]) => void;
  files?: File[];
  setFiles?: (files: File[]) => void;
  isError?: boolean;
  selectedModel?: string;
  setSelectedModel?: (model: string) => void;
  handleFileUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveFile?: (fileId: string) => void;
  handleCancelSearch?: () => void;
  loadingState?: boolean;
  isSearching?: boolean;
  isSpeaking?: boolean;
  toggleSpeech?: () => void;
}) {
  const [dividerWidth, setDividerWidth] = useState(0);
  const [visibleMessageId, setVisibleMessageId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
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

  useEffect(() => {
    setMounted(true);
  }, []);

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
                  loading={Boolean(loadingState)}
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
          <div className="flex flex-col space-y-2 mb-4 sm:mb-6 max-w-3xl mx-auto">
            <div className="flex items-start space-x-3 sm:space-x-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 animate-pulse flex items-center justify-center">
                <Bot size={16} className="text-white" />
              </div>
              <div className="flex-1">
                <div className="flex flex-col">
                  <p className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-white/90 mb-2">
                    Searching for answers...
                  </p>
                  {searchProgress.status && (
                    <div className="flex items-center space-x-2 mb-2">
                      <p className="text-xs text-gray-600 dark:text-white/60">
                        {searchProgress.status === 'searching' && `Searched ${searchProgress.websitesSearched} websites`}
                        {searchProgress.status === 'scraping' && `Scraped ${searchProgress.websitesScraped} websites`}
                        {searchProgress.status === 'compiling' && 'Compiling response'}
                      </p>
                    </div>
                  )}
                </div>
                <div className="space-y-2 -ml-11 pt-4">
                  {searchProgress.status === 'searching' && (
                    <div className="w-full bg-gray-200 dark:bg-[#222222] rounded-full h-1.5">
                      <div 
                        className="bg-emerald-400 dark:bg-emerald-400 h-1.5 rounded-full transition-all duration-300" 
                        style={{ width: `${Math.min((searchProgress.websitesSearched / 10) * 100, 100)}%` }}
                      />
                    </div>
                  )}
                  {searchProgress.status === 'scraping' && (
                    <div className="w-full bg-gray-200 dark:bg-[#222222] rounded-full h-1.5">
                      <div 
                        className="bg-emerald-400 dark:bg-emerald-400 h-1.5 rounded-full transition-all duration-300" 
                        style={{ width: `${Math.min((searchProgress.websitesScraped / 5) * 100, 100)}%` }}
                      />
                    </div>
                  )}
                  {searchProgress.status === 'compiling' && (
                    <div className="flex items-center justify-center py-2">
                      <div className="w-8 h-8 border-4 border-emerald-400 dark:border-emerald-400 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  {searchProgress.workingProcess.length > 0 && (
                    <div className="mt-4 bg-gray-50 dark:bg-[#1A1A1A] rounded-lg p-3 w-full">
                      <p className="text-xs text-gray-500 dark:text-white/50 mb-2">Working Process</p>
                      <div className="space-y-2">
                        {searchProgress.workingProcess.map((process, index) => (
                          <p key={index} className="text-sm text-gray-700 dark:text-white/80">
                            {process}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                  {thinkingMessages.length > 0 && (
                    <div className="mt-4 bg-gray-50 dark:bg-[#1A1A1A] rounded-lg p-3 w-full">
                      <p className="text-xs text-gray-500 dark:text-white/50 mb-2">Thinking...</p>
                      <div className="space-y-2">
                        {thinkingMessages.map((thought, index) => (
                          <p key={index} className="text-sm text-gray-700 dark:text-white/80">
                            {thought}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                  {searchProgress.status === 'error' && (
                    <div className="flex flex-col items-start space-y-2 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 rounded-lg p-3">
                      <p className="text-sm text-red-600 dark:text-red-400">There was an error generating a response</p>
                      <p className="text-xs text-red-500 dark:text-red-400/80">
                        If this issue persists please contact us through our help center at{' '}
                        <a href="mailto:support@volera.com" className="underline hover:text-red-700 dark:hover:text-red-300">
                          support@volera.com
                        </a>
                      </p>
                      <button 
                        onClick={() => window.location.reload()}
                        className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 flex items-center space-x-1 bg-red-100 dark:bg-red-900/30 px-3 py-1.5 rounded-md"
                      >
                        Regenerate response
                      </button>
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
            loading={Boolean(loadingState)}
            fileIds={fileIds}
            setFileIds={setFileIds}
            files={files || []}
            setFiles={setFiles || (() => {})}
            isError={isError}
            selectedModel={selectedModel || 'default'}
            setSelectedModel={setSelectedModel || (() => {})}
          />
        </div>
      </div>
    </div>
  );
}
