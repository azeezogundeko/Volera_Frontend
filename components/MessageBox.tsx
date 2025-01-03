/* eslint-disable @next/next/no-img-element */
import React, { MutableRefObject, useEffect, useState } from 'react';
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
}) => {
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

  return (
    <div className="w-full overflow-x-hidden flex flex-col space-y-4">
      {message.role === 'user' && (
        <div className="flex justify-end px-4 lg:px-8 relative z-0">
          <div className="flex items-start space-x-2">
            <div className="max-w-full bg-light-100 dark:bg-dark-100 rounded-xl p-4 border border-light-200 dark:border-dark-200 shadow-sm">
              <div className="prose prose-sm dark:prose-invert max-w-full text-sm break-words">
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
          <div className="px-4 lg:px-8">
            <div className="flex items-start space-x-4">
              {message.sources && message.sources.length > 0 && (
                <div className="flex flex-col space-y-2">
                  <div className="flex flex-row items-center space-x-2">
                    <BookCopy className="text-black dark:text-white" size={20} />
                    <h3 className="text-black dark:text-white font-medium text-xl">
                      Sources
                    </h3>
                  </div>
                  <MessageSources sources={message.sources} />
                </div>
              )}
              <div className="flex flex-col space-y-2 max-w-full">
                <div className="flex flex-row items-center space-x-2">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                    <Bot size={16} className="text-white" />
                  </div>
                  <h3 className="text-black dark:text-white font-medium text-xl">
                    Response
                  </h3>
                </div>
                <div className="rounded-xl p-4 max-w-full break-words">
                  <div className="prose dark:prose-invert max-w-full">
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
                  </div>
                </div>
                {loading && isLast ? null : (
                  <div className="flex flex-row items-center justify-between w-full text-black dark:text-white py-4 -mx-2">
                    <Rewrite rewrite={rewrite} messageId={message.messageId} />
                    <div className="flex flex-row items-center space-x-1">
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
                    </div>
                  </div>
                )}
                {isLast &&
                  message.suggestions &&
                  message.suggestions.length > 0 &&
                  message.role === 'assistant' &&
                  !loading && (
                    <>
                      <div className="h-px w-full bg-light-secondary dark:bg-dark-secondary" />
                      <div className="flex flex-col space-y-3 text-black dark:text-white">
                        <div className="flex flex-row items-center space-x-2 mt-4">
                          <Layers3 />
                          <h3 className="text-xl font-medium">Related</h3>
                        </div>
                        <div className="flex flex-col space-y-3">
                          {message.suggestions.map((suggestion, i) => (
                            <div
                              className="flex flex-col space-y-3 text-sm"
                              key={i}
                            >
                              <div className="h-px w-full bg-light-secondary dark:bg-dark-secondary" />
                              <div
                                onClick={() => {
                                  sendMessage(suggestion);
                                }}
                                className="cursor-pointer flex flex-row justify-between font-medium space-x-2 items-center"
                              >
                                <p className="transition duration-200 hover:text-[#24A0ED]">
                                  {suggestion}
                                </p>
                                <Plus
                                  size={20}
                                  className="text-[#24A0ED] flex-shrink-0"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
              </div>
            </div>
          </div>
          <div className="lg:sticky lg:top-20 flex flex-col items-end space-y-3 w-full lg:w-2/12 z-30 h-full pb-4">
            <SearchImages
              images={images}
              loading={imagesLoading} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageBox;
