'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Document } from '@langchain/core/documents';
import Navbar from './Navbar';
import Chat from './Chat';
import EmptyChat from './EmptyChat';
import crypto from 'crypto';
import { toast } from 'sonner';
import { useSearchParams } from 'next/navigation';
import { getSuggestions } from '@/lib/actions';
import Error from 'next/error';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import SearchImages from './SearchImages';
import SearchVideos from './SearchVideos';
import { getWebSocketURL } from '@/lib/config';

export type Message = {
  messageId: string;
  chatId: string;
  createdAt: Date;
  content: string;
  focusMode?: string;
  role: 'user' | 'assistant';
  suggestions?: string[];
  sources?: Document[];
  type?: 'image' | 'product';
  alt?: string;
  images?: Image[] | null;
  imagesLoading?: boolean;
  products?: Product[];
};

export interface File {
  fileName: string;
  fileExtension: string;
  fileId: string;
}

type ImageData = {
  product_url: string;
  image_url: string;
  title: string;
  // description: string;
}

type Image = {
  url: string;
  img_url: string;
  title: string;
}

type Video = {
  url: string;
  title: string;
}

type Product = {
  name: string;
  current_price: number;
  original_price: number;
  brand: string;
  discount: number;
  rating: number;
  reviews_count: string;
  product_id: string;
  image: string;
  relevance_score?: number;
  url: string;
  currency: string;
  source: string;
};

const useSocket = (
  url: string,
  setIsWSReady: (ready: boolean) => void,
  setError: (error: boolean) => void,
  onMessageCallback?: (event: MessageEvent) => void,
) => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [reconnectAttempt, setReconnectAttempt] = useState(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const maxReconnectAttempts = 5;
  const wsRef = useRef<WebSocket | null>(null);

  // Stabilize callback references
  const setIsWSReadyRef = useRef(setIsWSReady);
  const setErrorRef = useRef(setError);
  const onMessageCallbackRef = useRef(onMessageCallback);

  useEffect(() => {
    setIsWSReadyRef.current = setIsWSReady;
    setErrorRef.current = setError;
    onMessageCallbackRef.current = onMessageCallback;
  }, [setIsWSReady, setError, onMessageCallback]);

  const connectWebSocket = useCallback(() => {
    console.log('[WS Lifecycle] Attempting to connect WebSocket');
    if (typeof window === 'undefined') return null;

    try {
      const websocket = new WebSocket(url);
      let connectionTimeout: NodeJS.Timeout;

      connectionTimeout = setTimeout(() => {
        if (websocket.readyState !== WebSocket.OPEN) {
          console.error('[WS Lifecycle] Connection timeout after 15s');
          toast.error('Failed to connect to the server. Please try again later.');
          setErrorRef.current(true);
          websocket.close();
        }
      }, 15000);

      websocket.onopen = () => {
        clearTimeout(connectionTimeout);
        setIsWSReadyRef.current(true);
        setReconnectAttempt(0);
        console.log('[WS Lifecycle] Connection opened successfully', {
          readyState: websocket.readyState,
          url: websocket.url
        });
        wsRef.current = websocket;
      };

      websocket.onerror = (error) => {
        clearTimeout(connectionTimeout);
        console.error('[WS Lifecycle] WebSocket error:', error, {
          readyState: websocket.readyState,
          url: websocket.url
        });
        toast.error('Connection error. Please try again later.');
        setErrorRef.current(true);
      };

      websocket.onclose = (event) => {
        clearTimeout(connectionTimeout);
        console.log('[WS Lifecycle] Connection closed:', {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean,
          readyState: websocket.readyState
        });
        setIsWSReadyRef.current(false);
        setWs(null);
        wsRef.current = null;
        
        if (event.code === 4001) {
          console.log('[WS Lifecycle] Authentication required');
          toast.error('Authentication required. Please sign in.');
          window.location.href = '/login';
          return;
        }

        if (event.code === 1000 || event.code === 1001) {
          console.log('[WS Lifecycle] Normal closure');
          return;
        }

        if (reconnectAttempt < maxReconnectAttempts) {
          const timeout = Math.min(1000 * Math.pow(2, reconnectAttempt), 10000);
          console.log(`[WS Lifecycle] Scheduling reconnect:`, {
            attempt: reconnectAttempt + 1,
            maxAttempts: maxReconnectAttempts,
            timeout: timeout
          });
          
          reconnectTimeoutRef.current = setTimeout(() => {
            setReconnectAttempt(prev => prev + 1);
            console.log('[WS Lifecycle] Attempting reconnect', {
              attempt: reconnectAttempt + 1
            });
            const newWs = connectWebSocket();
            setWs(newWs);
          }, timeout);
        } else {
          console.log('[WS Lifecycle] Max reconnection attempts reached');
          setErrorRef.current(true);
          toast.error('Connection lost. Please refresh the page to reconnect.');
        }
      };

      websocket.onmessage = (event) => {
        console.log('[WS Message] Received:', {
          type: typeof event.data,
          size: event.data.length,
          readyState: websocket.readyState
        });
        if (onMessageCallbackRef.current) {
          onMessageCallbackRef.current(event);
        }
      };

      setWs(websocket);
      return websocket;
    } catch (error) {
      console.error('[WS Lifecycle] Error creating WebSocket:', error);
      setErrorRef.current(true);
      return null;
    }
  }, [url, reconnectAttempt]); // Reduced dependencies

  // Single effect to manage WebSocket lifecycle
  useEffect(() => {
    console.log('[Component Lifecycle] Setting up WebSocket connection');
    const websocket = connectWebSocket();
    const currentReconnectTimeout = reconnectTimeoutRef.current;

    return () => {
      console.log('[Component Lifecycle] Cleanup triggered', {
        isCurrentWS: websocket === wsRef.current,
        readyState: websocket?.readyState,
        hasReconnectTimeout: !!currentReconnectTimeout
      });
      
      if (currentReconnectTimeout) {
        clearTimeout(currentReconnectTimeout);
      }

      // Only close if this is the current active connection
      if (websocket === wsRef.current && websocket?.readyState === WebSocket.OPEN) {
        console.log('[Component Lifecycle] Closing WebSocket connection');
        websocket.close(1000, 'Component unmounting');
      }
    };
  }, [url]); // Only recreate connection when URL changes

  // Keep connection alive with ping
  // useEffect(() => {
  //   if (!ws) return;

  //   console.log('[Ping] Setting up ping interval');
  //   const pingInterval = setInterval(() => {
  //     if (ws.readyState === WebSocket.OPEN) {
  //       try {
  //         ws.send(JSON.stringify({ type: 'ping' }));
  //         console.log('[Ping] Sent');
  //       } catch (error) {
  //         console.error('[Ping] Error sending:', error);
  //         clearInterval(pingInterval);
  //       }
  //     } else {
  //       console.log('[Ping] Skipped - WebSocket not open:', {
  //         readyState: ws.readyState
  //       });
  //     }
  //   }, 30000);

  //   return () => {
  //     console.log('[Ping] Clearing interval');
  //     clearInterval(pingInterval);
  //   };
  // }, [ws]);

  return ws;
};



const loadMessages = async (
  chatId: string,
  setMessages: (messages: Message[]) => void,
  setIsMessagesLoaded: (loaded: boolean) => void,
  setChatHistory: (history: {
    speaker: "human" | "assistant";
    message: string;
    timestamp: Date;
  }[]) => void,
  setFocusMode: (mode: string) => void,
  setNotFound: (notFound: boolean) => void,
  setFiles: (files: File[]) => void,
  setFileIds: (fileIds: string[]) => void,
) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/chats/${chatId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem('token_type')} ${localStorage.getItem('auth_token')}`
      },
      
      
    },
  );

  if (res.status === 404) {
    setNotFound(true);
    setIsMessagesLoaded(true);
    return;
  }
  // console.log(await res.json()); 

  const data = await res.json();

  const messages = data.messages.documents.length > 0 ? data.messages.documents.map((msg: {
    content: string;
    message_id?: string;
    id?: string;
    role: string;
    created_at: string;
    metadata: string;
  }) => {
    
    // Remove surrounding quotes and parse metadata
    const cleanContent = msg.content.replace(/^"|"$/g, '');
    
    let parsedMetadata = {};
    try {
      // Handle metadata parsing (it looks like a string representation of a dict)
      parsedMetadata = eval(`(${msg.metadata})`);
    } catch (error) {
      console.error('Failed to parse metadata:', msg.metadata);
    }

    return {
      ...msg,
      chatId: data.chat.id,
      messageId: msg.message_id || msg.id,
      content: cleanContent,
      role: msg.role === 'human' ? 'user' : msg.role,
      createdAt: new Date(msg.created_at),
      metadata: parsedMetadata,
    } as Message;
  }) : [];

  if (messages.length === 0) {
    console.log('No messages available.');
    // Optionally, you can set a state variable to display a message in the UI
  }

  messages.sort((a: { $createdAt: string | number | Date; }, b: { $createdAt: string | number | Date; }) => 
    new Date(a.$createdAt).getTime() - new Date(b.$createdAt).getTime()
  );

  setMessages(messages);
  setIsMessagesLoaded(true);

  // Set other chat-related states
  if (messages.length > 0) {
    document.title = messages[0].content;
  }

  const files = data.chat.files.map((file: any) => ({
    fileName: file.name,
    fileExtension: file.name.split('.').pop(),
    fileId: file.fileId,
  }));

  setFiles(files);
  setFileIds(files.map((file: File) => file.fileId));

  const history = messages.map((msg: { role: any; content: any; createdAt: any; }) => ({
    speaker: msg.role,
    message: msg.content,
    timestamp: msg.createdAt,
  }));

  setChatHistory(history);
  setFocusMode(data.chat.focus_mode);
};


const 
ChatWindow = ({ id, initialFocusMode, messages, isLoading, videos, loading }: { id?: string; initialFocusMode?: string; messages: Message[]; isLoading: boolean; videos?: Video[]; loading?: boolean; }) => {
  const searchParams = useSearchParams();
  const initialMessage = searchParams.get('q');

  const [chatId, setChatId] = useState<string | undefined>(id);
  const [newChatCreated, setNewChatCreated] = useState(false);

  const [hasError, setHasError] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const [isWSReady, setIsWSReady] = useState(false);
  const [loadingState, setLoadingState] = useState(false);
  const [messageAppeared, setMessageAppeared] = useState(false);

  const [chatHistory, setChatHistory] = useState<{
    speaker: "human" | "assistant";
    message: string;
    timestamp: Date;
  }[]>([]);

  const [files, setFiles] = useState<File[]>([]);
  const [fileIds, setFileIds] = useState<string[]>([]);

  const [focusMode, setFocusMode] = useState('all');
  const [optimizationMode, setOptimizationMode] = useState('fast');

  const [isMessagesLoaded, setIsMessagesLoaded] = useState(false);

  const [notFound, setNotFound] = useState(false);

  const [open, setOpen] = useState(false);
  const [slides, setSlides] = useState<any[]>([]);

  const [videosState, setVideosState] = useState<Video[] | null>(videos ?? []);
  const [videosLoading, setVideosLoading] = useState(false);

  const [searchProgress, setSearchProgress] = useState<{
    websitesSearched: number;
    websitesScraped: number;
    status: 'searching' | 'scraping' | 'compiling' | null;
  }>({
    websitesSearched: 0,
    websitesScraped: 0,
    status: null
  });

  const [error, setError] = useState<string | null>(null);

  const [userEmail, setUserEmail] = useState<string>('');

  const [localMessages, setLocalMessages] = useState<Message[]>([]);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setUserEmail(user.email);
    }
  }, []);

  const convertImageDataToImage = (imageData: ImageData[]): Image[] => {
    return imageData.map(data => ({
      url: data.product_url,
      img_url: data.image_url,
      title: data.title
    }));
  }

  useEffect(() => {
    if (
      chatId &&
      !newChatCreated &&
      !isMessagesLoaded &&
      localMessages.length === 0
    ) {
      loadMessages(
        chatId,
        setLocalMessages,
        setIsMessagesLoaded,
        setChatHistory,
        setFocusMode,
        setNotFound,
        setFiles,
        setFileIds,
      );
    } else if (!chatId) {
      setNewChatCreated(true);
      setIsMessagesLoaded(true);
      setChatId(crypto.randomBytes(20).toString('hex'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId, localMessages.length, newChatCreated]);

  useEffect(() => {
    if (initialFocusMode !== undefined) {
      setFocusMode(initialFocusMode);
    }
  }, [initialFocusMode]);

  const messagesRef = useRef<Message[]>([]);

  useEffect(() => {
    messagesRef.current = localMessages;
  }, [localMessages]);

  useEffect(() => {
    if (isMessagesLoaded && isWSReady) {
      setIsReady(true);
      console.log('[DEBUG] ready');
    }
    console.log('[DEBUG] Readiness Check:', {
      isMessagesLoaded,
      isWSReady,
      chatId,
      localMessages: localMessages.length,
      newChatCreated
    });
  }, [isMessagesLoaded, isWSReady]);

  const handleWebSocketMessage = useCallback((event: MessageEvent) => {
    try {
      console.log('[WS DEBUG] Raw message received:', event.data);
      
      const data = typeof event.data === 'string' 
        ? JSON.parse(event.data) 
        : JSON.parse(new TextDecoder().decode(event.data));
      
      console.log('[WS DEBUG] Parsed message:', data);
      
      // Ignore ping messages
      if (data.type === 'ping') {
        console.log('[WS DEBUG] Received ping message');
        return;
      }
      
      switch (data.type) {
        case 'message':
          if (data.content) {
            const content = typeof data.content === 'string' ? data.content : JSON.stringify(data.content);
            setLocalMessages(localMessages => [...localMessages, {
              messageId: crypto.randomBytes(16).toString('hex'),
              chatId: chatId || '',
              content: content,
              role: 'assistant',
              sources: data.sources || [],
              suggestions: data.suggestions || [],
              createdAt: new Date(),
              images: null,
              imagesLoading: false
            }]);
            setMessageAppeared(true);
            // Reset search progress when message is complete
            setSearchProgress({
              websitesSearched: 0,
              websitesScraped: 0,
              status: null
            });
          }
          setLoadingState(false);
          break;

        case 'progress':
          console.log('[DEBUG] Progress update:', data);
          if (!loadingState) {
            setLoadingState(true);
            setMessageAppeared(false);
          }
          if (data.progress) {
            setSearchProgress(prev => ({
              ...prev,
              websitesSearched: data.progress.searched || prev.websitesSearched,
              websitesScraped: data.progress.scraped || prev.websitesScraped,
              status: data.progress.status || prev.status
            }));
          }
          break;

        case 'search_complete':
          console.log('[DEBUG] Search complete:', data);
          setSearchProgress(prev => ({
            ...prev,
            status: 'compiling',
            websitesSearched: data.totalSearched || prev.websitesSearched,
            websitesScraped: data.totalScraped || prev.websitesScraped
          }));
          break;

        case 'error':
          console.error('[STREAMING DEBUG] Error:', data.error);
          setError(data.error);
          setLoadingState(false);
          break;

        case 'image':
          const imageMessage: Message = {
            messageId: crypto.randomBytes(16).toString('hex'),
            chatId: chatId || crypto.randomBytes(16).toString('hex'), // Ensure chatId is always a string
            createdAt: new Date(),
            content: data.content,
            role: 'assistant',
            type: 'image'
          };
          
          setLocalMessages(prevMessages => [...prevMessages, imageMessage]);
          break;

        case 'image_search':
          if (data.data) {
            const convertedImages = data.data.map((item: any) => ({
              url: item.url,
              img_url: item.img_url,
              title: item.title
            }));
            
            // Update the specific message's images
            setLocalMessages(prevMessages => {
              const updatedMessages = [...prevMessages];
              const lastMessage = updatedMessages[updatedMessages.length - 1];
              if (lastMessage && lastMessage.role === 'assistant') {
                lastMessage.images = convertedImages;
                lastMessage.imagesLoading = false;
              }
              return updatedMessages;
            });
          }
          break;

        case 'product':
          if (data.products) {
            const productMessage: Message = {
              messageId: crypto.randomBytes(16).toString('hex'),
              chatId: chatId || '',
              content: data.content || 'Here are some product suggestions:',
              role: 'assistant',
              type: 'product',
              products: data.products.map((item: any) => ({
                name: item.name,
                current_price: item.current_price,
                original_price: item.original_price,
                brand: item.brand,
                discount: item.discount,
                rating: item.rating,
                reviews_count: item.reviews_count,
                product_id: item.product_id,
                image: item.image,
                relevance_score: item.relevance_score,
                url: item.url,
                currency: item.currency,
                source: item.source
              })),
              createdAt: new Date()
            };
            setLocalMessages(prevMessages => [...prevMessages, productMessage]);
            setMessageAppeared(true);
            setLoadingState(false);
          }
          break;

        case 'video_search':
          setVideosLoading(false);
          if (data.data) {
            const convertedVideos = data.data.map((item: any) => ({
              url: item.url,
              title: item.title
            }));
            setVideosState(convertedVideos);
          }
          break;

        case 'sources':
          setLocalMessages(prevMessages => {
            const updatedMessages = [...prevMessages];
            const lastMessage = updatedMessages[updatedMessages.length - 1];
            if (lastMessage && lastMessage.role === 'assistant') {
              lastMessage.sources = data.sources;
            } else {
              // If no assistant message exists, create one
              updatedMessages.push({
                messageId: crypto.randomBytes(16).toString('hex'),
                chatId: chatId || '',
                content: '',
                role: 'assistant',
                sources: data.sources,
                createdAt: new Date(),
                images: null,
                imagesLoading: false
              });
            }
            return updatedMessages;
          });
          break;

        case 'messageEnd':
          console.log('[STREAMING DEBUG] Message streaming completed');
          setLoadingState(false);
          setMessageAppeared(true);
          break;

        default:
          console.log('[STREAMING DEBUG] Unhandled message type:', data.type);
      }
    } catch (error) {
      console.error('[STREAMING DEBUG] Error parsing WebSocket message:', error);
      setLoadingState(false);
    }
  }, [loadingState]);

  const ws = useSocket(
    getWebSocketURL(),
    setIsWSReady,
    setHasError,
    handleWebSocketMessage  
  );

  const sendMessage = async (message: string, parentMessageId?: string) => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      toast.error('WebSocket is not connected');
      return;
    }
  
    const messageId = crypto.randomUUID ? crypto.randomUUID() : self.crypto.randomUUID();
    const chatIdToUse = chatId || crypto.randomBytes(20).toString('hex');
    setChatId(chatIdToUse);
    
    setLoadingState(true);
    setMessageAppeared(false);
    
    const newMessage: Message = {
      messageId: messageId,
      chatId: chatIdToUse,
      content: message,
      role: 'user',
      createdAt: new Date(),
    };
  
    setLocalMessages((prevMessages) => [...prevMessages, newMessage]);
    setChatHistory((prevHistory) => [
      ...prevHistory,
      { speaker: 'human', message: message, timestamp: new Date() },
    ]);
    const payload = {
      type: 'message',
      data: {
        messageId: messageId,
        chatId: chatIdToUse,
        content: newMessage.content
      },
      parentMessageId: parentMessageId,
      focusMode: focusMode,
      optimizationMode: optimizationMode,
      fileIds: fileIds,
      history: [
        ...chatHistory,
        { speaker: 'human', message: newMessage.content, timestamp: new Date() },
      ]
    };
  
    ws.send(JSON.stringify(payload));
  };

    const rewrite = (messageId: string) => {
      const index = localMessages.findIndex((msg) => msg.messageId === messageId);
  
      if (index === -1) return;
  
      const message = localMessages[index - 1];
  
      setLocalMessages((prev) => {
        return [...prev.slice(0, localMessages.length > 2 ? index - 1 : 0)];
      });
      setChatHistory((prev) => {
        return [...prev.slice(0, localMessages.length > 2 ? index - 1 : 0)];
      });
  
      sendMessage(message.content, message.messageId);
    };
  
    useEffect(() => {
      if (isReady && initialMessage && ws?.readyState === 1) {
        sendMessage(initialMessage);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ws?.readyState, isReady, initialMessage, isWSReady]);
  
    const handleSearchVideos = async () => {
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        toast.error('WebSocket is not connected');
        return;
      }

      // Get the last message content to use as search query
      const lastMessage = localMessages[localMessages.length - 1];
      if (!lastMessage) return;

      ws.send(JSON.stringify({
        type: 'search_videos',
        chatId: chatId,
        messageId: lastMessage.messageId,
        query: lastMessage.content
      }));
    };

    const getSearchStatusMessage = () => {
      switch (searchProgress.status) {
        case 'searching':
          return `Searched ${searchProgress.websitesSearched} websites...`;
        case 'scraping':
          return `Scraped ${searchProgress.websitesScraped} websites...`;
        case 'compiling':
          return 'Compiling response...';
        default:
          return 'Processing...';
      }
    };

    if (hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <p className="dark:text-white/70 text-black/70 text-sm">
            Failed to connect to the server. Please try again later.
          </p>
        </div>
      );
    }
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <p className="dark:text-white/70 text-black/70 text-sm">
            {error}
          </p>
        </div>
      );
    }
    return isReady ? (
      notFound ? (
        <Error statusCode={404} />
      ) : (
        <div className="flex flex-1 relative overflow-hidden">
          <div className="flex-1 flex flex-col">
            {localMessages.length > 0 ? (
              <>
                <Navbar
                  messages={localMessages}
                  chatId={id || ''}
                  userEmail={userEmail}
                />
                <Chat
                  loading={loadingState}
                  messages={localMessages}
                  messageAppeared={messageAppeared}
                  searchProgress={searchProgress}
                  searchStatusMessage={getSearchStatusMessage()}
                  sendMessage={sendMessage}
                  rewrite={rewrite}
                  fileIds={fileIds}
                  setFileIds={setFileIds}
                  files={files}
                  setFiles={setFiles}
                />
              </>
            ) : (
              <EmptyChat
                sendMessage={sendMessage}
                focusMode={focusMode}
                setFocusMode={setFocusMode}
                optimizationMode={optimizationMode}
                setOptimizationMode={setOptimizationMode}
                fileIds={fileIds}
                setFileIds={setFileIds}
                files={files}
                setFiles={setFiles}
              />
            )}
          </div>
          <Lightbox open={open} close={() => setOpen(false)} slides={slides} />
        </div>
      )
    ) : (
      <div className="flex flex-row items-center justify-center min-h-screen">
        <svg
          aria-hidden="true"
          className="w-8 h-8 text-light-200 fill-light-secondary dark:text-[#202020] animate-spin dark:fill-[#ffffff3b]"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100.003 78.2051 78.1951 100.003 50.5908 100C22.9765 99.9972 0.997224 78.018 1 50.4037C1.00281 22.7993 22.8108 0.997224 50.4251 1C78.0395 1.00281 100.018 22.8108 100 50.4251ZM9.08164 50.594C9.06312 73.3997 27.7909 92.1272 50.5966 92.1457C73.4023 92.1642 92.1298 73.4365 92.1483 50.6308C92.1669 27.8251 73.4392 9.0973 50.6335 9.07878C27.8278 9.06026 9.10003 27.787 9.08164 50.594Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4037 97.8624 35.9116 96.9801 33.5533C95.1945 28.8227 92.871 24.3692 90.0681 20.348C85.6237 14.1775 79.4473 9.36872 72.0454 6.45794C64.6435 3.54717 56.3134 2.65431 48.3133 3.89319C45.869 4.27179 44.3768 6.77534 45.014 9.20079C45.6512 11.6262 48.1343 13.0956 50.5786 12.717C56.5073 11.8281 62.5542 12.5399 68.0406 14.7911C73.527 17.0422 78.2187 20.7487 81.5841 25.4923C83.7976 28.5886 85.4467 32.059 86.4416 35.7474C87.1273 38.1189 89.5423 39.6781 91.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
      </div>
    );
  };



export default ChatWindow;