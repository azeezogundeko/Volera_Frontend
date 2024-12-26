'use client';

import { ArrowRight, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import Focus from './MessageInputActions/Focus';
import Optimization from './MessageInputActions/Optimization';
import Attach from './MessageInputActions/Attach';
import { File } from './ChatWindow';
import { clsx } from 'clsx';

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
    sendMessage(message);
    setMessage('');
    setShowSuggestions(false);
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
        sendMessage(message);
        setMessage('');
        setShowSuggestions(false);
      }}
      onKeyDown={handleKeyDown}
      className="w-full relative"
    >
      <div
        className={clsx(
          'bg-[#111111] p-4 flex items-center overflow-hidden border-2 border-[#4ade80]/30 shadow-[0_0_15px_rgba(74,222,128,0.1)]',
          'flex-col rounded-2xl',
        )}
      >
        <TextareaAutosize
          ref={inputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          minRows={2}
          className={clsx(
            'bg-transparent placeholder:text-white/50 text-sm text-white resize-none focus:outline-none w-full max-h-24 lg:max-h-36 xl:max-h-48',
          )}
          placeholder="Ask anything..."
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
              disabled={!message.trim()}
              className={clsx(
                'p-2 rounded-lg',
                'bg-[#4ade80] hover:bg-[#4ade80]/90',
                'disabled:opacity-50 disabled:cursor-not-allowed',
              )}
            >
              <ArrowRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Search Suggestions Dropdown */}
      {showSuggestions && (
        <div 
          ref={dropdownRef}
          className={clsx(
            "absolute w-full mt-2 rounded-xl",
            "bg-[#111111]",
            "border border-[#4ade80]/20",
            "shadow-lg shadow-[#4ade80]/5",
            "backdrop-blur-sm",
            "z-50",
            "transition-all duration-200 ease-in-out",
          )}
          style={{
            maxHeight: `${Math.min(filteredSuggestions.length * 48 + 40, 320)}px`,
            overflow: 'hidden'
          }}
        >
          <div className="px-4 py-2 border-b border-[#4ade80]/10">
            <div className="flex items-center text-white/50 text-sm">
              <Search className="w-4 h-4 mr-2" />
              <span>Suggested searches</span>
            </div>
          </div>
          <div 
            className="overflow-y-auto" 
            style={{ 
              maxHeight: `${Math.min(filteredSuggestions.length * 48, 280)}px`,
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            {filteredSuggestions.map((suggestion, index) => (
              <div
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className={clsx(
                  "px-4 py-3 cursor-pointer text-sm",
                  "transition-colors duration-150",
                  "text-white/80",
                  "hover:bg-[#4ade80]/5",
                  index === selectedIndex && "bg-[#4ade80]/10",
                  "flex items-center"
                )}
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
