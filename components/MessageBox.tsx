/* eslint-disable @next/next/no-img-element */
import React, { MutableRefObject, useEffect, useState, useRef } from 'react';
import { Message } from './ChatWindow';
import { cn } from '@/lib/utils';
import {
  BookCopy,
  Disc3,
  Volume2,
  StopCircle,
  Layers3,
  Plus,
  User,
  Bot,
} from 'lucide-react';
import Markdown from 'markdown-to-jsx';
import Copy from './MessageActions/Copy';
import Rewrite from './MessageActions/Rewrite';
import MessageSources from './MessageSources';
import SearchImages from './SearchImages';
import { useSpeech } from 'react-text-to-speech';
import { Image } from './SearchImages';
import ProductCard from './ProductCard'; // Import ProductCard component

const MessageBox = ({
  message,
  messageIndex,
  history,
  loading,
  dividerRef,
  isLast,
  rewrite,
  sendMessage,
  images,
  imagesLoading,
  onSearchVideos,
  onVisibilityChange
}: {
  message: Message;
  messageIndex: number;
  history: Message[];
  loading: boolean;
  dividerRef?: MutableRefObject<HTMLDivElement | null>;
  isLast: boolean;
  rewrite: (messageId: string) => void;
  sendMessage: (message: string) => void;
  images: Image[] | null;
  imagesLoading: boolean;
  onSearchVideos?: () => Promise<void>;
  onVisibilityChange?: (messageId: string, isVisible: boolean) => void;
}) => {
  const messageRef = useRef<HTMLDivElement>(null);
  const [parsedMessage, setParsedMessage] = useState(message.content || '');
  const [speechMessage, setSpeechMessage] = useState(message.content || '');

  useEffect(() => {
    if (message?.content) {
      const content = typeof message.content === 'string' ? message.content : JSON.stringify(message.content);
      const regex = /\[.*?\]/g;
      const cleanedMessage = content.replace(regex, '');
      // Convert escaped newlines to actual newlines and format code blocks
      const formattedMessage = cleanedMessage
        .replace(/\\n/g, '\n') // Convert escaped newlines to actual newlines
        .replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
          return `\`\`\`${lang || ''}\n${code.trim()}\n\`\`\``;
        });
      setParsedMessage(formattedMessage);
      setSpeechMessage(cleanedMessage.replace(/\\n/g, ' '));
    }
  }, [message.content]);

  const { speechStatus, start, stop } = useSpeech({ text: speechMessage });

  useEffect(() => {
    if (!messageRef.current || !onVisibilityChange) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onVisibilityChange(message.messageId, true);
          }
        });
      },
      {
        threshold: 0.5, // Message is considered visible when 50% is in view
        rootMargin: '-10% 0px -10% 0px' // Add some margin to make transition smoother
      }
    );

    observer.observe(messageRef.current);

    return () => {
      observer.disconnect();
    };
  }, [message.messageId, onVisibilityChange]);

  return (
    <div className="w-full overflow-x-hidden relative" ref={messageRef}>
      {/* Main Content Area */}
      <div className="w-full lg:w-[calc(100%-20rem)] pl-0">
        {message.role === 'user' && (
          <div className="flex justify-end px-0 relative z-0 max-w-3xl mx-auto">
            <div className="flex items-start space-x-2">
              <div className="max-w-[85%] bg-light-100 dark:bg-dark-100 rounded-xl p-2.5 border border-light-200 dark:border-dark-200 shadow-sm">
                <div className="prose prose-sm dark:prose-invert w-full break-words whitespace-pre-wrap [&>p]:my-1.5 [&>p]:pr-1">
                  {parsedMessage && parsedMessage.trim() !== '' && (
                    <Markdown
                      className={cn(
                        'prose prose-sm prose-h1:mb-3 prose-h2:mb-2 prose-h2:mt-6 prose-h2:font-[800] prose-h3:mt-4 prose-h3:mb-1.5 prose-h3:font-[600] dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 font-[400]',
                        'max-w-none text-black/90 dark:text-white/90',
                        'prose-code:bg-light-secondary dark:prose-code:bg-dark-secondary prose-code:p-1 prose-code:rounded-md',
                        'prose-pre:bg-light-secondary dark:prose-pre:bg-dark-secondary prose-pre:p-4 prose-pre:rounded-lg'
                      )} 
                      options={{
                        overrides: {
                          code: {
                            props: {
                              className: 'language-text'
                            }
                          }
                        }
                      }}
                    >
                      {parsedMessage}
                    </Markdown>
                  )}
                  {/* {message.type === 'product' ? (
                    <div>
                      <p>{message.content || 'Here are some product suggestions:'}</p>
                      <div className="grid grid-cols-2 gap-4 pt-4">
                        {message.products?.slice(0, 10).map((product, index) => (
                          <ProductCard 
                            key={index} 
                            product={product} 
                          />
                        ))}
                      </div>
                    </div>
                  ) : null} */}
                </div>
              </div>
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-light-100 dark:bg-dark-100 border border-light-200 dark:border-dark-200 flex items-center justify-center">
                <User size={16} className="text-black/80 dark:text-white/80" />
              </div>
            </div>
          </div>
        )}

        {message.role === 'assistant' && (
          <div className="relative z-0">
            <div className="flex items-start px-0 max-w-3xl mx-auto">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                <Bot size={16} className="text-white" />
              </div>
              
              <div className="flex-1 min-w-0 pl-2">
                <div className="flex flex-col space-y-4">
                  <div className="bg-light-100 dark:bg-dark-100 rounded-xl p-4 border border-light-200 dark:border-dark-200">
                    {message.sources && message.sources.length > 0 && (
                      <div className="mt-4 p-4 bg-light-100 dark:bg-dark-100 rounded-xl border border-light-200 dark:border-dark-200">
                        <div className="flex items-center gap-2 mb-2">
                          <BookCopy className="text-black/70 dark:text-white/70" size={16} />
                          <h3 className="text-sm font-medium text-black/70 dark:text-white/70">
                            Sources
                          </h3>
                        </div>
                        <MessageSources sources={message.sources}/>
                      </div>
                      )}
                        <div className="prose dark:prose-invert w-full [&>p]:my-1.5">
                          {parsedMessage && parsedMessage.trim() !== '' && (
                            <Markdown
                              className={cn(
                                'prose prose-h1:mb-3 prose-h2:mb-2 prose-h2:mt-6 prose-h2:font-[800] prose-h3:mt-4 prose-h3:mb-1.5 prose-h3:font-[600] dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 font-[400]',
                                'max-w-none text-black dark:text-white',
                                'prose-code:bg-light-secondary dark:prose-code:bg-dark-secondary prose-code:p-1 prose-code:rounded-md',
                                'prose-pre:bg-light-secondary dark:prose-pre:bg-dark-secondary prose-pre:p-4 prose-pre:rounded-lg'
                              )} 
                              options={{
                                overrides: {
                                  code: {
                                    props: {
                                      className: 'language-text'
                                    }
                                  }
                                }
                              }}
                            >
                              {parsedMessage}
                            </Markdown>
                          )}
                          {message.products && message.products.length > 0 && (
                            <div className="pt-6">
                              <b className="text-2xl">Product Suggestions</b>
                              <div className="grid grid-cols-2 gap-4 pt-4">
                                {message.products?.slice(0, 10).map((product, index) => (
                                  <ProductCard 
                                    key={index} 
                                    product={product} 
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                  

                  {loading && isLast ? null : (
                    <div className="flex flex-row items-center justify-between w-full text-black dark:text-white py-4">
                      {/* <Rewrite rewrite={rewrite} messageId={message.messageId} /> */}
                      {/* <div className="flex flex-row items-center space-x-1">
                        <Copy initialMessage={message.content} message={message} />
                        <button
                          onClick={() => {
                            if (speechStatus === 'started') {
                              stop();
                            } else {
                              start();
                            }
                          }}
                          className="p-2 text-black/70 dark:text-white/70 rounded-xl hover:bg-light-secondary dark:hover:bg-dark-secondary transition duration-200 hover:text-black dark:hover:text-white"
                        >
                          {speechStatus === 'started' ? (
                            <StopCircle size={18} />
                          ) : (
                            <Volume2 size={18} />
                          )}
                        </button>
                      </div> */}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar */}
      {images && images.length > 0 && (
        <div className="hidden lg:block w-[320px] flex-shrink-0 fixed right-0 top-0 h-screen overflow-y-auto bg-light-50 dark:bg-dark-50 border-l border-light-200 dark:border-dark-200">
          <div className="p-4">
            <SearchImages
              images={images}
              loading={imagesLoading}
              messageId={message.messageId}
              onSearchVideos={onSearchVideos}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageBox;
