import { ArrowRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import CopilotToggle from './MessageInputActions/Copilot';
import Focus from './MessageInputActions/Focus';
import Optimization from './MessageInputActions/Optimization';
import Attach from './MessageInputActions/Attach';
import { File } from './ChatWindow';
import { clsx } from 'clsx';

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
  const [copilotEnabled, setCopilotEnabled] = useState(false);
  const [message, setMessage] = useState('');

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

    inputRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    sendMessage(message);
    setMessage('');
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        sendMessage(message);
        setMessage('');
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          sendMessage(message);
          setMessage('');
        }
      }}
      className="w-full"
    >
      <div
        className={clsx(
          'bg-light-secondary dark:bg-dark-secondary p-4 flex items-center overflow-hidden border-2 border-[#4ade80]/30 shadow-[0_0_15px_rgba(74,222,128,0.1)]',
          'flex-col rounded-2xl',
        )}
      >
        <TextareaAutosize
          ref={inputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          minRows={2}
          className={clsx(
            'bg-transparent placeholder:text-black/50 dark:placeholder:text-white/50 text-sm text-black dark:text-white resize-none focus:outline-none w-full max-h-24 lg:max-h-36 xl:max-h-48',
          )}
          placeholder="Ask anything..."
        />
        <div className={clsx(
          "flex flex-row items-center justify-between w-full mt-4 px-2",
          "space-x-2"
        )}>
          {/* Left side icons */}
          <div className={clsx(
            "flex items-center space-x-3"
          )}>
            <Focus focusMode={focusMode} setFocusMode={setFocusMode} />
            <Attach
              fileIds={fileIds}
              setFileIds={setFileIds}
              files={files}
              setFiles={setFiles}
              showText
            />
          </div>

          {/* Right side icons */}
          <div className={clsx(
            "flex items-center space-x-3"
          )}>
            <Optimization
              optimizationMode={optimizationMode}
              setOptimizationMode={setOptimizationMode}
            />
            <button
              disabled={message.trim().length === 0}
              className={clsx(
                'bg-[#24A0ED] text-white',
                'disabled:text-black/50 dark:disabled:text-white/50',
                'disabled:bg-[#e0e0dc] dark:disabled:bg-[#ececec21]',
                'hover:bg-opacity-85 transition duration-100',
                'rounded-full p-2'
              )}
              onClick={handleSubmit}
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default EmptyChatMessageInput;
