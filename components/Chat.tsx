'use client';

import { Fragment, useEffect, useRef, useState, useCallback } from 'react';
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
  const [showWorkingProcess, setShowWorkingProcess] = useState<boolean>(true);
  const [showThinking, setShowThinking] = useState<boolean>(true);
  const dividerRef = useRef<HTMLDivElement | null>(null);
  const messageEnd = useRef<HTMLDivElement | null>(null);

  // Store working process and thinking messages in refs to persist them
  const workingProcessRef = useRef<string[]>([]);
  const thinkingMessagesRef = useRef<string[]>([]);


  // Save toggle states to localStorage when they change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('showWorkingProcess', JSON.stringify(showWorkingProcess));
    }
  }, [showWorkingProcess, mounted]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('showThinking', JSON.stringify(showThinking));
    }
  }, [showThinking, mounted]);

  // Load toggle states from localStorage on initial mount
  useEffect(() => {
    const savedWorkingProcess = localStorage.getItem('showWorkingProcess');
    const savedThinking = localStorage.getItem('showThinking');
    
    if (savedWorkingProcess !== null) {
      setShowWorkingProcess(JSON.parse(savedWorkingProcess));
    }
    
    if (savedThinking !== null) {
      setShowThinking(JSON.parse(savedThinking));
    }
    
    setMounted(true);
  }, []);

  // Update refs when searchProgress or thinkingMessages change
  useEffect(() => {
    if (searchProgress.workingProcess.length > 0) {
      // Only add new items that aren't already in the ref
      const newItems = searchProgress.workingProcess.filter(
        item => !workingProcessRef.current.includes(item)
      );
      
      if (newItems.length > 0) {
        workingProcessRef.current = [...workingProcessRef.current, ...newItems];
      }
    }
  }, [searchProgress.workingProcess]);

  useEffect(() => {
    if (thinkingMessages.length > 0) {
      // Only add new items that aren't already in the ref
      const newItems = thinkingMessages.filter(
        item => !thinkingMessagesRef.current.includes(item)
      );
      
      if (newItems.length > 0) {
        thinkingMessagesRef.current = [...thinkingMessagesRef.current, ...newItems];
      }
    }
  }, [thinkingMessages]);

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
    <div className="flex flex-col min-h-0 flex-1 overflow-hidden h-screen">
      <div className="flex-1 overflow-y-auto relative z-0 pb-40">
        <div className="max-w-3xl mx-auto">
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
              <div className="flex items-start space-x-2 px-0">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                  <Bot size={16} className="text-white" />
                </div>
                <div className="flex flex-col w-full">
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
                  
                  {searchProgress.status === 'searching' && (
                    <div className="w-[600px] bg-gray-200 dark:bg-[#222222] rounded-full h-1.5 mb-4">
                      <div 
                        className="bg-emerald-400 dark:bg-emerald-400 h-1.5 rounded-full transition-all duration-300" 
                        style={{ width: `${Math.min((searchProgress.websitesSearched / 20) * 100, 100)}%` }}
                      />
                  </div>
                  
                  )}
                  {searchProgress.status === 'scraping' && (
                    <div className="w-[600px] bg-gray-200 dark:bg-[#222222] rounded-full h-1.5 mb-4">
                      <div 
                        className="bg-emerald-400 dark:bg-emerald-400 h-1.5 rounded-full transition-all duration-300" 
                        style={{ width: `${Math.min((searchProgress.websitesSearched / 20) * 100, 100)}%` }}
                      />
                  </div>
                  
                  )}
                  {searchProgress.status === 'compiling' && (
                    <div className="flex items-center justify-center py-2 mb-4">
                      <div className="w-8 h-8 border-4 border-emerald-400 dark:border-emerald-400 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  
                  {workingProcessRef.current.length > 0 && (
                    <div className="mt-2 bg-[#333333] dark:bg-[#333333] rounded-lg p-3 w-auto lg:w-[600px]">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-xs text-gray-400 dark:text-white/30">Working Process</p>
                        <button 
                          onClick={() => setShowWorkingProcess(!showWorkingProcess)}
                          className="text-xs text-gray-400 dark:text-white/30 hover:text-white flex items-center"
                        >
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="12" 
                            height="12" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            className={`ml-1 transition-transform ${showWorkingProcess ? 'rotate-180' : 'rotate-0'}`}
                          >
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                        </button>
                      </div>
                      {showWorkingProcess && (
                        <div className="space-y-1">
                          {workingProcessRef.current.map((process, index) => (
                            <p key={index} className="text-xs text-gray-300 dark:text-white/70">
                              {process}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {thinkingMessagesRef.current.length > 0 && (
                    <div className="mt-2 bg-[#333333] dark:bg-[#333333] rounded-lg p-3 w-auto lg:w-[600px]">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-xs text-gray-300 dark:text-white/70">Thinking...</p>
                        <button 
                          onClick={() => setShowThinking(!showThinking)}
                          className="text-xs text-gray-400 dark:text-white/30 hover:text-white flex items-center"
                        >
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="12" 
                            height="12" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            className={`ml-1 transition-transform ${showThinking ? 'rotate-180' : 'rotate-0'}`}
                          >
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                        </button>
                      </div>
                      {showThinking && (
                        <div className="space-y-2">
                          {thinkingMessagesRef.current.map((thought, index) => (
                            <p key={index} className="text-sm text-gray-300 dark:text-white/70">
                              {thought}
                            </p>
                          ))}
                        </div>
                      )}
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
          )}
          <div ref={messageEnd} />
        </div>

        <div className="z-10">
          <MessageInput
            sendMessage={sendMessage}
            loading={Boolean(loadingState)}
            fileIds={fileIds}
            setFileIds={setFileIds}
            files={files || []}
            setFiles={setFiles || (() => {})}
            isError={searchProgress.status === 'error'}
            selectedModel={selectedModel || 'default'}
            setSelectedModel={setSelectedModel || (() => {})}
          />
        </div>
      </div>
    </div>
  );
}
