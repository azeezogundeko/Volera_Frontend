'use client';

import { cn } from '@/lib/utils';
import { Send, Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import AuthDialog from './AuthDialog';
import { File } from './ChatWindow';
import ModelSelector from './MessageInputActions/ModelSelector';

interface MessageInputProps {
  sendMessage: (message: string) => void;
  loading: boolean;
  fileIds: string[];
  setFileIds: (fileIds: string[]) => void;
  files: File[];
  setFiles: (files: File[]) => void;
  isError?: boolean;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
}

const MessageInput = ({
  sendMessage,
  loading,
  fileIds,
  setFileIds,
  files,
  setFiles,
  isError = false,
  selectedModel,
  setSelectedModel,
}: MessageInputProps) => {
  const [message, setMessage] = useState('');
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [rows, setRows] = useState(1);
  const maxRows = 6;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const isInputFocused =
        activeElement?.tagName === 'TEXTAREA' ||
        activeElement?.tagName === 'INPUT' ||
        activeElement?.hasAttribute('contenteditable');

      if (e.key === '/' && !isInputFocused) {
        e.preventDefault();
        textareaRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSubmit = () => {
    if (message.trim()) {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setIsAuthDialogOpen(true);
        return;
      }
      sendMessage(message);
      setMessage('');
      setRows(1); // Reset rows after submit
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize logic
    const textareaLineHeight = 24; // Match your line-height in CSS
    const previousRows = e.target.rows;
    e.target.rows = 1; // Reset rows
    
    const currentRows = Math.floor(e.target.scrollHeight / textareaLineHeight);
    
    if (currentRows === previousRows) {
      e.target.rows = currentRows;
    }
    
    if (currentRows >= maxRows) {
      e.target.rows = maxRows;
      e.target.scrollTop = e.target.scrollHeight;
    } else {
      e.target.rows = currentRows;
    }
    
    setRows(currentRows < maxRows ? currentRows : maxRows);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !loading && !isError) {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Enter' && e.shiftKey) {
      // Allow default behavior (new line)
      return;
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 sm:left-1/2 sm:transform sm:-translate-x-1/2 w-full max-w-3xl px-2 sm:px-4 pb-2 z-10">
      <div className="bg-white dark:bg-[#111111] rounded-xl shadow-xl border border-gray-200 dark:border-[#222222]">
        <div className="p-2 sm:p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 mb-1">
            <ModelSelector
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
            />
            <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
              AI-generated reference
            </span>
          </div>

          <div className="relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder={isError ? "Try again..." : "Ask anything..."}
              className={cn(
                "w-full bg-gray-50 dark:bg-[#222222]",
                "rounded-lg border border-gray-300 dark:border-[#333333]",
                "py-2 px-3 pr-12 sm:pr-14",
                "text-sm placeholder:text-gray-400",
                "focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-600",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "resize-none overflow-y-auto",
                "transition-all duration-200",
                "min-h-[40px]"
              )}
              disabled={loading || isError}
              rows={rows}
              style={{
                height: 'auto',
                maxHeight: `${maxRows * 24}px`,
              }}
            />

            <button
              onClick={handleSubmit}
              disabled={!message.trim() || loading || isError}
              className={cn(
                "absolute right-2 bottom-2 p-1.5 sm:p-2 rounded-md sm:rounded-lg",
                "bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700",
                "disabled:bg-gray-200 dark:disabled:bg-[#222222]",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "transition-colors duration-200"
              )}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 text-white animate-spin" />
              ) : (
                <Send className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              )}
            </button>
          </div>

          <div className="hidden sm:block mt-2 sm:mt-3 text-center">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              DeepThink (RI) Search · v2.4.1 · 
              <span className="text-emerald-500 ml-1">Privacy Policy</span>
            </div>
          </div>
        </div>
      </div>

      <AuthDialog
        isOpen={isAuthDialogOpen}
        setIsOpen={setIsAuthDialogOpen}
      />
    </div>
  );
};

export default MessageInput;