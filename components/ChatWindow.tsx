'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
// import { Document } from '@langchain/core/documents';
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
import { WebSocketNotifications } from './WebSocketNotifications';
import { websocketService } from '@/lib/websocket';

export interface Source {
  url: string;
  content: string;
  title: string;
}

export type Message = {
  messageId: string;
  chatId: string;
  createdAt: Date;
  content: string;
  focusMode?: string;
  role: 'user' | 'assistant';
  suggestions?: string[];
  sources?: Source[];
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
    if (typeof window === 'undefined') return null;

    try {
      const websocket = new WebSocket(url);
      let connectionTimeout: NodeJS.Timeout;

      connectionTimeout = setTimeout(() => {
        if (websocket.readyState !== WebSocket.OPEN) {
          websocketService.sendNotification('Failed to connect to the server. Please try again later.', 'error');
          setErrorRef.current(true);
          websocket.close();
        }
      }, 15000);

      websocket.onopen = () => {
        clearTimeout(connectionTimeout);
        setIsWSReadyRef.current(true);
        setReconnectAttempt(0);
        wsRef.current = websocket;
      };

      websocket.onerror = (error) => {
        clearTimeout(connectionTimeout);
        setErrorRef.current(true);
      };

      websocket.onclose = (event) => {
        clearTimeout(connectionTimeout);
        setIsWSReadyRef.current(false);
        setWs(null);
        wsRef.current = null;
        
        if (event.code === 4001) {
          websocketService.sendNotification('Authentication required. Please sign in.', 'error');
          window.location.href = '/login';
          return;
        }

        if (event.code === 1000 || event.code === 1001) {
          return;
        }

        if (reconnectAttempt < maxReconnectAttempts) {
          const timeout = Math.min(1000 * Math.pow(2, reconnectAttempt), 10000);
          reconnectTimeoutRef.current = setTimeout(() => {
            setReconnectAttempt(prev => prev + 1);
            const newWs = connectWebSocket();
            setWs(newWs);
          }, timeout);
        } else {
          setErrorRef.current(true);
          websocketService.sendNotification('Connection lost. Please refresh the page to reconnect.', 'error');
        }
      };

      websocket.onmessage = (event) => {
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
  }, [url, reconnectAttempt]);

  // Single effect to manage WebSocket lifecycle
  useEffect(() => {
    const websocket = connectWebSocket();
    const currentReconnectTimeout = reconnectTimeoutRef.current;

    return () => {
      
      if (currentReconnectTimeout) {
        clearTimeout(currentReconnectTimeout);
      }

      // Only close if this is the current active connection
      if (websocket === wsRef.current && websocket?.readyState === WebSocket.OPEN) {
        // console.log('[Component Lifecycle] Closing WebSocket connection');
        websocket.close(1000, 'Component unmounting');
      }
    };
  }, [url]); // Only recreate connection when URL changes

  return ws;
};



const loadMessages = async (
  chatId: string,
  setMessages: (messages: Message[]) => void,
  setIsMessagesLoaded: (loaded: boolean) => void,
  setChatHistory: React.Dispatch<React.SetStateAction<{
    speaker: "human" | "assistant";
    message: string;
    messageId: string;
    timestamp: Date;
    images?: Image[];
    products?: Product[];
    sources?: Source[];
  }[]>>,
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
    return;
  }
  // console.log(await res.json()); 

  const data = await res.json();

  const messages = data.messages.documents.length > 0 ? data.messages.documents.map((msg: {
    content?: string;
    messageId: string;
    role: string;
    createdAt: string;
    metadata: string;
    sources?: Source[];
    images?: Image[];
    products?: Product[];
  }) => {
    
    // Remove surrounding quotes and parse metadata
    const cleanContent = msg.content ? msg.content.replace(/^"|"$/g, '') : undefined;
    
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
      messageId: msg.messageId,
      content: cleanContent,
      role: msg.role === 'human' ? 'user' : msg.role,
      createdAt: msg.createdAt,
      metadata: parsedMetadata,
      images: msg.images || [], 
      sources: msg.sources || [],
      products: msg.products || []
    } as unknown as Message;
  }) : [];

  if (messages.length === 0) {
    // console.log('No messages available.');
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

  const allowedImageExtensions = ['jpg', 'jpeg', 'png', 'gif'];

  const isValidImageFile = (file: File): boolean => {
    return allowedImageExtensions.includes(file.fileExtension.toLowerCase());
  };

  const files = data.chat.files.map((file: any) => {
    const newFile: File = {
      fileName: file.name,
      fileExtension: file.name.split('.').pop(),
      fileId: file.fileId,
    };

    if (!isValidImageFile(newFile)) {
      console.error(`Invalid file type: ${newFile.fileName}`);
      return null; // Or handle invalid files as needed
    }

    return newFile;
  }).filter((file: null) => file !== null); // Filter out invalid files

  setFiles(files);
  setFileIds(files.map((file: File) => file.fileId));

  messages.forEach((message: { role: string; content: any; createdAt: any; images: any; products: any; sources: any[]; messageId: string}) => {
    // console.log('Images for message:', message.messageId, message.images); // Log the images array
    setChatHistory(prevHistory => [...prevHistory, {
      speaker: message.role === 'user' ? 'human' : 'assistant',
      message: message.content,
      messageId: message.messageId,
      timestamp: message.createdAt,
      images: message.images || undefined,
      products: message.products,
      sources: message.sources?.map(source => ({
        url: source.metadata?.source || '',
        content: source.pageContent,
        title: source.metadata?.title || ''
      }))
    }]);
  });

  setFocusMode(data.chat.focus_mode);
};


const ChatWindow = ({ id, initialFocusMode, messages, isLoading, videos, loading }: { id?: string; initialFocusMode?: string; messages: Message[]; isLoading: boolean; videos?: Video[]; loading?: boolean; }) => {
  const searchParams = useSearchParams();
  const initialMessage = searchParams.get('q');

  const [chatId, setChatId] = useState<string | undefined>(id);
  const [newChatCreated, setNewChatCreated] = useState(false);
  const [selectedModel, setSelectedModel] = useState('deepseek');

  const [hasError, setHasError] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const [isWSReady, setIsWSReady] = useState(false);
  const [loadingState, setLoadingState] = useState(false);
  const [messageAppeared, setMessageAppeared] = useState(false);

  const [chatHistory, setChatHistory] = useState<{
    speaker: "human" | "assistant";
    message: string;
    timestamp: Date;
    messageId: string;
    images?: Image[];
    products?: Product[];
    sources?: Source[];
  }[]>([]);

  const [files, setFiles] = useState<File[]>([]);
  const [fileIds, setFileIds] = useState<string[]>([]);

  const [focusMode, setFocusMode] = useState('Q/A');
  // const [model, setModel] = useState('deepseek');

  const [isMessagesLoaded, setIsMessagesLoaded] = useState(false);

  const [notFound, setNotFound] = useState(false);

  const [open, setOpen] = useState(false);
  const [slides, setSlides] = useState<any[]>([]);

  const [videosState, setVideosState] = useState<Video[] | null>(videos ?? []);
  const [videosLoading, setVideosLoading] = useState(false);

  const [searchProgress, setSearchProgress] = useState<{
    websitesSearched: number;
    websitesScraped: number;
    status: 'searching' | 'scraping' | 'compiling' | 'error' | null;
    workingProcess: string[];
  }>({
    websitesSearched: 0,
    websitesScraped: 0,
    status: null,
    workingProcess: []
  });

  const [thinkingMessages, setThinkingMessages] = useState<string[]>([]);

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
    } else if (!chatId || notFound) {
      setNewChatCreated(true);
      setIsMessagesLoaded(true);
      setChatId(crypto.randomBytes(20).toString('hex'));
    }
  }, [chatId, localMessages.length, newChatCreated, notFound]);

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
  //     console.log('[DEBUG] ready');
  //   }
  //   console.log('[DEBUG] Readiness Check:', {
  //     isMessagesLoaded,
  //     isWSReady,
  //     chatId,
  //     localMessages: localMessages.length,
  //     newChatCreated
    // });
    }
  }, [isMessagesLoaded, isWSReady]);

  const handleWebSocketMessage = useCallback((event: MessageEvent) => {
    try {
      // console.log('[WS DEBUG] Raw message received:', event.data);
      
      const data = typeof event.data === 'string' 
        ? JSON.parse(event.data) 
        : JSON.parse(new TextDecoder().decode(event.data));
      
      // console.log('[WS DEBUG] Parsed message:', data);
      
      // Ignore ping messages
      if (data.type === 'ping') {
        // console.log('[WS DEBUG] Received ping message');
        return;
      }
      
      switch (data.type) {
        case 'message':
          if (data.content) {
            const content = typeof data.content === 'string' ? data.content : JSON.stringify(data.content);
            setLocalMessages(localMessages => [...localMessages, {
              messageId: data.messageId,
              chatId: chatId || '',
              content: content,
              role: 'assistant',
              sources: data.sources || [],
              images: data.images || [],
              products: data.products?.map((item: any) => ({
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
              })) ?? [],
              createdAt: new Date(),
              imagesLoading: false
            }]);
            setMessageAppeared(true);
            // Reset search progress when message is complete
            setSearchProgress({
              websitesSearched: 0,
              websitesScraped: 0,
              status: null,
              workingProcess: []
            });
          }
          setLoadingState(false);
          break;

        case 'progress':
          // console.log('[DEBUG] Progress update:', data);
          if (!loadingState) {
            setLoadingState(true);
            setMessageAppeared(false);
          }
          if (data.progress) {
            setSearchProgress(prev => {
              // Add thinking message if provided
              const updatedWorkingProcess = [...prev.workingProcess];
              if (data.progress.thinking && !updatedWorkingProcess.includes(data.progress.thinking)) {
                updatedWorkingProcess.push(data.progress.thinking);
              }
              
              return {
                ...prev,
                websitesSearched: data.progress.searched || prev.websitesSearched,
                websitesScraped: data.progress.scraped || prev.websitesScraped,
                status: data.progress.status || prev.status,
                workingProcess: updatedWorkingProcess
              };
            });
          }
          break;

        case 'thinking':
          if (data.message) {
            setThinkingMessages(prev => {
              if (!prev.includes(data.message)) {
                return [...prev, data.message];
              }
              return prev;
            });
          }
          break;

        case 'search_complete':
          // console.log('[DEBUG] Search complete:', data);
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

        // case 'image':
        //   const imageMessage: Message = {
        //     messageId: data.messageId,
        //     chatId: chatId || crypto.randomBytes(16).toString('hex'), // Ensure chatId is always a string
        //     createdAt: new Date(),
        //     content: data.content,
        //     role: 'assistant',
        //     type: 'image'
        //   };
          
        //   setLocalMessages(prevMessages => [...prevMessages, imageMessage]);
        //   break;

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

        // case 'message':
        //   const content = typeof data.content === 'string' ? data.content : JSON.stringify(data.content);
        //     const productMessage: Message = {
        //       messageId: data.messageId,
        //       chatId: chatId || '',
        //       content: content,
        //       role: 'assistant',
        //       sources: data.sources || [],
        //       images: data.images || [],
        //       products: data.products?.map((item: any) => ({
        //         name: item.name,
        //         current_price: item.current_price,
        //         original_price: item.original_price,
        //         brand: item.brand,
        //         discount: item.discount,
        //         rating: item.rating,
        //         reviews_count: item.reviews_count,
        //         product_id: item.product_id,
        //         image: item.image,
        //         relevance_score: item.relevance_score,
        //         url: item.url,
        //         currency: item.currency,
        //         source: item.source
        //       })),
        //       createdAt: new Date(),
        //       imagesLoading: false
        //     };
        //     setLocalMessages(prevMessages => [...prevMessages, productMessage]);
        //     setMessageAppeared(true);
        //     setLoadingState(false);
        //   break;

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

        // case 'sources':
        //   setLocalMessages(prevMessages => {
        //     const updatedMessages = [...prevMessages];
        //     const lastMessage = updatedMessages[updatedMessages.length - 1];
        //     if (lastMessage && lastMessage.role === 'assistant') {
        //       lastMessage.sources = data.sources;
        //     } else {
        //       // If no assistant message exists, create one
        //       updatedMessages.push({
        //         messageId: data.messageId,
        //         chatId: chatId || '',
        //         content: '',
        //         role: 'assistant',
        //         sources: data.sources,
        //         createdAt: new Date(),
        //         images: null,
        //         imagesLoading: false
        //       });
        //     }
        //     return updatedMessages;
        //   });
        //   break;

        case 'messageEnd':
          // console.log('[STREAMING DEBUG] Message streaming completed');
          setLoadingState(false);
          setMessageAppeared(true);
          break;

        default:
          // console.log('[STREAMING DEBUG] Unhandled message type:', data.type);
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
      websocketService.sendNotification('WebSocket is not connected', 'error');
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
    setChatHistory(prevHistory => [...prevHistory, { 
      speaker: 'human', 
      message: message, 
      messageId: messageId,
      timestamp: new Date(), 
      images: [], 
      products: [], 
      sources: [] 
    }]);
    console.log(focusMode)
    const payload = {
      type: 'message',
      data: {
        messageId: messageId,
        chatId: chatIdToUse,
        content: newMessage.content
      },
      parentMessageId: parentMessageId,
      focusMode: focusMode,
      model: selectedModel,
      file_ids: fileIds, 
      history: [
        ...chatHistory,
        { 
          speaker: 'human', 
          message: newMessage.content, 
          timestamp: new Date(), 
          images: [], 
          products: [], 
          sources: [] 
        },
      ]
    };

    console.log(payload)
  
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
          return `Searching...`;
        case 'scraping':
          return `Scraping...`;
        case 'compiling':
          return 'Compiling...';
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
    return (
      <div className="flex flex-col h-screen">
        <WebSocketNotifications />
        {localMessages.length > 0 ? (
          <>
            <Navbar
              messages={localMessages}
              chatId={id || ''}
              userEmail={userEmail}
            />
            <div className="flex-1 flex flex-col">
              <Chat
                loading={loadingState}
                messages={localMessages}
                messageAppeared={messageAppeared}
                searchProgress={searchProgress}
                sendMessage={sendMessage}
                rewrite={rewrite}
                thinkingMessages={thinkingMessages}
                fileIds={fileIds}
                setFileIds={setFileIds}
                files={files}
                setFiles={setFiles}
                isError={searchProgress.status === 'error'}
                selectedModel={selectedModel}
                setSelectedModel={setSelectedModel}
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col">
            <EmptyChat
              sendMessage={sendMessage}
              focusMode={focusMode}
              setFocusMode={setFocusMode}
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
              fileIds={fileIds}
              setFileIds={setFileIds}
              files={files}
              setFiles={setFiles}
            />
          </div>
        )}
        <Lightbox open={open} close={() => setOpen(false)} slides={slides} />
      </div>
    );
  };


export default ChatWindow;