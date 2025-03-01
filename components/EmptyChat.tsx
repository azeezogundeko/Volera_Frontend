import { Settings } from 'lucide-react';
import EmptyChatMessageInput from './EmptyChatMessageInput';
import SettingsDialog from './SettingsDialog';
import { useState, useEffect } from 'react';
import { File } from './ChatWindow';
import { useChat } from '@/hooks/useChat';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';

const EmptyChat = ({
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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { createNewChat, isCreatingChat } = useChat();
  const router = useRouter();
  const params = useParams();
  const chatId = params?.chatId as string;
  const [isChatCreated, setIsChatCreated] = useState(false);

  useEffect(() => {
    const initializeChat = async () => {
      if (chatId && !isChatCreated) {
        try {
          const chatData = await createNewChat();
          if (chatData) {
            setIsChatCreated(true);
          }
        } catch (error) {
          console.error('Error initializing chat:', error);
        }
      }
    };

    initializeChat();
  }, [chatId, createNewChat, isChatCreated]);

  const handleSendMessage = async (message: string) => {
    try {
      if (!isChatCreated) {
        throw new Error('Chat not initialized');
      }
      
      // Send the message since chat is already created
      sendMessage(message);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  return (
    <div className="relative h-screen overflow-hidden">
      <SettingsDialog isOpen={isSettingsOpen} setIsOpen={setIsSettingsOpen} />
      <div className="flex flex-col items-center justify-center h-full max-w-screen-sm mx-auto p-2 space-y-8">
        <div className="flex flex-col items-center space-y-4 -mt-8">
          <p className="text-black/50 dark:text-white/50 text-2xl sm:text-3xl md:text-4xl font-bold text-center px-4">
            What do you want to buy?
          </p>
        </div>
        <EmptyChatMessageInput
          sendMessage={handleSendMessage}
          focusMode={focusMode}
          setFocusMode={setFocusMode}
          optimizationMode={optimizationMode}
          setOptimizationMode={setOptimizationMode}
          fileIds={fileIds}
          setFileIds={setFileIds}
          files={files}
          setFiles={setFiles}
        />
      </div>
    </div>
  );
};

export default EmptyChat;
