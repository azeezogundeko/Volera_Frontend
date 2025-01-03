'use client';

import { ArrowRight, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import Focus from './MessageInputActions/Focus';
import Optimization from './MessageInputActions/Optimization';
import Attach from './MessageInputActions/Attach';
import { File } from './ChatWindow';
import { clsx } from 'clsx';
import LoadingSpinner from './LoadingSpinner';

// Dummy search suggestions
const DUMMY_SUGGESTIONS = [
  "What's the best smartphone under $500?",
  "Compare MacBook Pro vs Dell XPS",
  "Best noise cancelling headphones",
  "Gaming laptop recommendations",
  "Smart home devices for beginners",
  "Best budget 4K TV",
  "Wireless earbuds comparison",
  "Robot vacuum cleaners review",
  "Best smartwatch for fitness",
  "Mechanical keyboard recommendations"
];

const EmptyChatMessageInput = ({
  sendMessage,
  focusMode,
  setFocusMode,
  optimizationMode,
  setOptimizationMode,
  fileIds,
  setFileIds,
  files,
  setFiles,
}: {
  sendMessage: (message: string) => void;
  focusMode: string;
  setFocusMode: (mode: string) => void;
  optimizationMode: string;
  setOptimizationMode: (mode: string) => void;
  fileIds: string[];
  setFileIds: (fileIds: string[]) => void;
  files: File[];
  setFiles: (files: File[]) => void;
}) => {
  const [message, setMessage] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);

    inputRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (message.trim()) {
      const filtered = DUMMY_SUGGESTIONS.filter(suggestion =>
        suggestion.toLowerCase().includes(message.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
      setSelectedIndex(-1);
    } else {
      setShowSuggestions(false);
    }
  }, [message]);

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    sendMessage(message);
    setMessage('');
    setShowSuggestions(false);
    setLoading(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        if (selectedIndex >= 0 && !e.shiftKey) {
          e.preventDefault();
          handleSuggestionClick(filteredSuggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        break;
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (message.trim()) {
          setLoading(true);
          sendMessage(message);
          setMessage('');
          setShowSuggestions(false);
          setLoading(false);
        }
      }}
      onKeyDown={(e) => {
        if (!showSuggestions) {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (message.trim()) {
              setLoading(true);
              sendMessage(message);
              setMessage('');
              setShowSuggestions(false);
              setLoading(false);
            }
          }
        } else {
          handleKeyDown(e);
        }
      }}
      className="w-full relative"
    >
      <div
        className={clsx(
          'bg-white dark:bg-[#111111] p-4 flex items-center overflow-hidden border-2 border-[#4ade80]/30 shadow-[0_0_15px_rgba(74,222,128,0.1)]',
          'flex-col rounded-2xl',
        )}
      >
        <TextareaAutosize
          ref={inputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          minRows={2}
          className={clsx(
            'bg-transparent placeholder:text-black/200 dark:placeholder:text-white/50 text-sm text-black dark:text-white resize-none focus:outline-none w-full max-h-24 lg:max-h-36 xl:max-h-48',
          )}
          placeholder="What do you want to buy?"
        />
        <div className={clsx(
          "flex flex-row items-center justify-between w-full mt-4 px-2",
          "space-x-2"
        )}>
          <div className="flex items-center space-x-2">
            <Focus focusMode={focusMode} setFocusMode={setFocusMode} />
            <Attach fileIds={fileIds} setFileIds={setFileIds} files={files} setFiles={setFiles} />
          </div>
          <div className="flex items-center space-x-2">
            <Optimization
              optimizationMode={optimizationMode}
              setOptimizationMode={setOptimizationMode}
            />
            <button
              onClick={handleSubmit}
              disabled={!message.trim() || loading}
              className={clsx(
                'p-2 rounded-lg',
                'bg-[#4ade80] hover:bg-[#4ade80]/90',
                'disabled:opacity-50 disabled:cursor-not-allowed',
              )}
            >
              {loading ? (
                <LoadingSpinner size="sm" className="border-white" />
              ) : (
                <ArrowRight className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Search Suggestions Dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-[#111111] rounded-lg shadow-lg border border-light-200 dark:border-dark-200 overflow-hidden">
          <div className="max-h-60 overflow-y-auto scrollbar-hide" style={{ 
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch'
          }}>
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            {filteredSuggestions.map((suggestion, index) => (
              <div
                key={suggestion}
                className={clsx(
                  'px-4 py-2 cursor-pointer text-sm',
                  'hover:bg-light-100 dark:hover:bg-dark-100',
                  'text-black dark:text-white',
                  selectedIndex === index && 'bg-light-100 dark:bg-dark-100'
                )}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </div>
            ))}
          </div>
        </div>
      )}
    </form>
  );
};

export default EmptyChatMessageInput;
