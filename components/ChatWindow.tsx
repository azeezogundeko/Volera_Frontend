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

export type Message = {
  messageId: string;
  chatId: string;
  createdAt: Date;
  content: string;
  role: 'user' | 'assistant';
  suggestions?: string[];
  sources?: Document[];
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

const useSocket = (
  url: string,
  setIsWSReady: (ready: boolean) => void,
  setError: (error: boolean) => void,
  onMessageCallback?: (event: MessageEvent) => void,
) => {
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const establishWebSocketConnection = () => {
      const wsURL = new URL(url);
      const searchParams = new URLSearchParams();
      wsURL.search = searchParams.toString();

      const websocket = new WebSocket(wsURL.toString());

      const connectionTimeout = setTimeout(() => {
        if (websocket.readyState !== WebSocket.OPEN) {
          console.error('[DEBUG] WebSocket connection timeout');
          toast.error('Failed to connect to the server. Please try again later.');
          setError(true);
          websocket.close();
      }}, 15000); // Increased timeout to 15 seconds

      websocket.onopen = () => {
        clearTimeout(connectionTimeout);
        setIsWSReady(true);
        console.log('[DEBUG] WebSocket opened successfully');

      };

      websocket.onerror = (error) => {
        clearTimeout(connectionTimeout);
        console.error('[DEBUG] WebSocket error:', error);
        setError(true);
        toast.error('WebSocket connection error.');
        
      };

      websocket.onclose = (event) => {
        clearTimeout(connectionTimeout);
        console.log('[DEBUG] WebSocket closed:', event);
        setError(true);
        
      };

      websocket.onmessage = (event: MessageEvent) => {
        console.log('[WS DEBUG] Raw message received:', event.data);
        
        try {
          const data = typeof event.data === 'string' 
            ? JSON.parse(event.data) 
            : JSON.parse(new TextDecoder().decode(event.data));
          
          console.log('[WS DEBUG] Parsed message:', data);
          
          if (onMessageCallback) {
            // Pass the parsed data instead of the raw event
            onMessageCallback({
              ...event,
              data: JSON.stringify(data)
            });
          }
        } catch (error) {
          console.error('[WS DEBUG] Error parsing WebSocket message:', error);
          console.error('[WS DEBUG] Received data:', event.data);
        }
      };

      setWs(websocket);
    };

    if (!ws) {
      establishWebSocketConnection();
    }

    return () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [url, setIsWSReady, setError, ws, onMessageCallback]);

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
      },
    },
  );

  if (res.status === 404) {
    setNotFound(true);
    setIsMessagesLoaded(true);
    return;
  }

  const data = await res.json();

  const messages = data.messages.map((msg: any) => {
    return {
      ...msg,
      ...JSON.parse(msg.metadata),
    };
  }) as Message[];

  setMessages(messages);

  const history = messages.map((msg) => {
    return {
      speaker: msg.role,
      message: msg.content,
      timestamp: msg.createdAt,
    };
  }) as {
    speaker: "human" | "assistant";
    message: string;
    timestamp: Date;
  }[];

  console.log('[DEBUG] messages loaded');

  document.title = messages[0].content;

  const files = data.chat.files.map((file: any) => {
    return {
      fileName: file.name,
      fileExtension: file.name.split('.').pop(),
      fileId: file.fileId,
    };
  });

  setFiles(files);
  setFileIds(files.map((file: File) => file.fileId));

  setChatHistory(history);
  setFocusMode(data.chat.focusMode);
  setIsMessagesLoaded(true);
};

const ChatWindow = ({ id }: { id?: string }) => {
  const searchParams = useSearchParams();
  const initialMessage = searchParams.get('q');

  const [chatId, setChatId] = useState<string | undefined>(id);
  const [newChatCreated, setNewChatCreated] = useState(false);

  const [hasError, setHasError] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const [isWSReady, setIsWSReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messageAppeared, setMessageAppeared] = useState(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const [chatHistory, setChatHistory] = useState<{
    speaker: "human" | "assistant";
    message: string;
    timestamp: Date;
  }[]>([]);

  const [files, setFiles] = useState<File[]>([]);
  const [fileIds, setFileIds] = useState<string[]>([]);

  const [focusMode, setFocusMode] = useState('webSearch');
  const [optimizationMode, setOptimizationMode] = useState('speed');

  const [isMessagesLoaded, setIsMessagesLoaded] = useState(false);

  const [notFound, setNotFound] = useState(false);

  const [open, setOpen] = useState(false);
  const [slides, setSlides] = useState<any[]>([]);

  useEffect(() => {
    if (
      chatId &&
      !newChatCreated &&
      !isMessagesLoaded &&
      messages.length === 0
    ) {
      loadMessages(
        chatId,
        setMessages,
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
  }, []);

  useEffect(() => {
    return () => {
      if (ws?.readyState === 1) {
        ws.close();
        console.log('[DEBUG] closed');
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const messagesRef = useRef<Message[]>([]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    if (isMessagesLoaded && isWSReady) {
      setIsReady(true);
      console.log('[DEBUG] ready');
    }
    console.log('[DEBUG] Readiness Check:', {
      isMessagesLoaded,
      isWSReady,
      chatId,
      messages: messages.length,
      newChatCreated
    });
  }, [isMessagesLoaded, isWSReady]);

  const handleWebSocketMessage = useCallback((event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);
      console.log('[STREAMING DEBUG] Received message type:', data.type);
      console.log('[STREAMING DEBUG] Message data:', data);
      
      switch (data.type) {
        case 'message':
          if (data.content) {
            console.log('[STREAMING DEBUG] Processing message content:', data.content);
            
            setMessages((prevMessages) => {
              // If it's the first message or a new message
              if (prevMessages.length === 0 || prevMessages[prevMessages.length - 1].role === 'user') {
                console.log('[STREAMING DEBUG] Creating new assistant message');
                return [
                  ...prevMessages,
                  {
                    messageId: crypto.randomBytes(16).toString('hex'),
                    chatId: chatId || '',
                    createdAt: new Date(),
                    content: data.content,
                    role: 'assistant',
                    sources: data.sources || [],
                    suggestions: data.suggestions || []
                  }
                ];
              } else {
                // Update the last message if it's a continuation
                console.log('[STREAMING DEBUG] Appending to existing message');
                const updatedMessages = [...prevMessages];
                const lastMessage = updatedMessages[updatedMessages.length - 1];
                
                // Ensure we're only appending to an assistant message
                if (lastMessage.role === 'assistant') {
                  // Avoid appending duplicate content
                  if (!lastMessage.content.endsWith(data.content)) {
                    lastMessage.content += data.content;
                  }
                  lastMessage.sources = data.sources || lastMessage.sources;
                  return updatedMessages;
                }
                
                // If last message is not an assistant message, create a new one
                return [
                  ...prevMessages,
                  {
                    messageId: crypto.randomBytes(16).toString('hex'),
                    chatId: chatId || '',
                    createdAt: new Date(),
                    content: data.content,
                    role: 'assistant',
                    sources: data.sources || [],
                    suggestions: data.suggestions || []
                  }
                ];
              }
            });

            setChatHistory(prevHistory => [
              ...prevHistory, 
              { 
                speaker: 'assistant', 
                message: data.content, 
                timestamp: new Date() 
              }
            ]);

            setLoading(false);
            setMessageAppeared(true);
          }
          break;

        case 'sources':
          console.log('[STREAMING DEBUG] Processing sources:', data.sources);
          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages];
            const lastMessage = updatedMessages[updatedMessages.length - 1];
            
            if (lastMessage.role === 'assistant') {
              // Update to match backend structure
              lastMessage.sources = data.data.sources ? data.data.sources.map((source: ImageData) => ({
                metadata: {
                  url: source.product_url,        // Product URL from backend
                  img_src: source.image_url,      // Image URL from backend
                  title: source.title,            // Title from backend
                  // description: source.description // Optional description
                }
              })) : [];
              
              setMessages((prevMessages) => {
                const updatedMessages = [...prevMessages];
                updatedMessages[updatedMessages.length - 1] = lastMessage;
                return updatedMessages;
              });
            }
            
            return updatedMessages;
          });
          
          break;

        case 'messageEnd':
          console.log('[STREAMING DEBUG] Message streaming completed');
          setLoading(false);
          setMessageAppeared(true);
          break;

        case 'error':
          console.error('[STREAMING DEBUG] Error received:', data.message);
          toast.error(data.message || 'An error occurred');
          setLoading(false);
          break;
        
        default:
          console.log('[STREAMING DEBUG] Unhandled message type:', data.type);
      }
    } catch (error) {
      console.error('[STREAMING DEBUG] Error parsing WebSocket message:', error);
      setLoading(false);
    }
  }, [chatId, setMessages, setChatHistory, setLoading, setMessageAppeared]);

  const ws = useSocket(
    process.env.NEXT_PUBLIC_WS_URL!,
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
    
    setLoading(true);
    setMessageAppeared(false);
    
    const newMessage: Message = {
      messageId: messageId,
      chatId: chatIdToUse,
      content: message,
      role: 'user',
      createdAt: new Date(),
    };
  
    setMessages((prevMessages) => [...prevMessages, newMessage]);
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
      const index = messages.findIndex((msg) => msg.messageId === messageId);
  
      if (index === -1) return;
  
      const message = messages[index - 1];
  
      setMessages((prev) => {
        return [...prev.slice(0, messages.length > 2 ? index - 1 : 0)];
      });
      setChatHistory((prev) => {
        return [...prev.slice(0, messages.length > 2 ? index - 1 : 0)];
      });
  
      sendMessage(message.content, message.messageId);
    };
  
    useEffect(() => {
      if (isReady && initialMessage && ws?.readyState === 1) {
        sendMessage(initialMessage);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ws?.readyState, isReady, initialMessage, isWSReady]);
  
    if (hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <p className="dark:text-white/70 text-black/70 text-sm">
            Failed to connect to the server. Please try again later.
          </p>
        </div>
      );
    }
    return isReady ? (
      notFound ? (
        <Error statusCode={404} />
      ) : (
        <div>
          {messages.length > 0 ? (
            <>
              <Navbar chatId={chatId!} messages={messages} />
              <Chat
                loading={loading}
                messages={messages}
                sendMessage={sendMessage}
                messageAppeared={messageAppeared}
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
  ;
  };



export default ChatWindow;