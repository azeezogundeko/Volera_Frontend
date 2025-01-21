'use client';

import { cn } from '@/lib/utils';
import { ArrowUp } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import Attach from './MessageInputActions/Attach';
import CopilotToggle from './MessageInputActions/Copilot';
import { File } from './ChatWindow';
import AttachSmall from './MessageInputActions/AttachSmall';
import AuthDialog from './AuthDialog';
import { Loader2, Send } from 'lucide-react';

interface MessageInputProps {
  sendMessage: (message: string) => void;
  loading: boolean;
  fileIds: string[];
  setFileIds: (fileIds: string[]) => void;
  files: File[];
  setFiles: (files: File[]) => void;
  isError?: boolean;
}

const MessageInput = ({
  sendMessage,
  loading,
  fileIds,
  setFileIds,
  files,
  setFiles,
  isError = false,
}: MessageInputProps) => {
  const [copilotEnabled, setCopilotEnabled] = useState(false);
  const [message, setMessage] = useState('');
  const [textareaRows, setTextareaRows] = useState(1);
  const [mode, setMode] = useState<'multi' | 'single'>('single');
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

  useEffect(() => {
    if (textareaRows >= 2 && message && mode === 'single') {
      setMode('multi');
    } else if (!message && mode === 'multi') {
      setMode('single');
    }
  }, [textareaRows, mode, message]);

  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;

      const isInputFocused =
        activeElement?.tagName === 'INPUT' ||
        activeElement?.tagName === 'TEXTAREA' ||
        activeElement?.hasAttribute('contenteditable');

      if (e.key === '/' && !isInputFocused) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSubmit = () => {
    if (message.trim()) {
      // Check if user is authenticated
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setIsAuthDialogOpen(true);
        return;
      }

      sendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <textarea
          ref={inputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && !loading && !isError) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder={isError ? "Please try again..." : "Type your message..."}
          rows={1}
          className={cn(
            "w-full resize-none bg-white dark:bg-[#1a1a1a]",
            "rounded-xl border border-light-200 dark:border-dark-200",
            "py-3 pl-3 pr-20 sm:pr-24",
            "text-sm sm:text-base placeholder:text-black/30 dark:placeholder:text-white/30",
            "focus:outline-none focus:ring-2 focus:ring-emerald-500/50",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "transition-all duration-200"
          )}
          disabled={loading || isError}
        />
        <div className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1 sm:space-x-2">
          <button
            onClick={handleSubmit}
            disabled={!message.trim() || loading || isError}
            className={cn(
              "p-1.5 sm:p-2 rounded-lg",
              "bg-emerald-500 hover:bg-emerald-600",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "transition-all duration-200"
            )}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 text-white animate-spin" />
            ) : (
              <Send className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
