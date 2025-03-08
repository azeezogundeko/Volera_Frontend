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
  selectedModel,
  setSelectedModel,
  fileIds,
  setFileIds,
  files,
  setFiles,
}: {
  sendMessage: (message: string) => void;
  focusMode: string;
  setFocusMode: (mode: string) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
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
    // const initializeChat = async () => {
    //   if (chatId && !isChatCreated) {
    //     try {
    //       await createNewChat(); // Ensure this is called only once
    //       setIsChatCreated(true); // Update the state to indicate chat has been created
    //     } catch (error) {
    //       console.error('Error creating chat:', error);
    //       toast.error('Failed to create chat');
    //     }
    //   }
    // };

    // initializeChat();
  }, [chatId, createNewChat, isChatCreated]);

  const handleSendMessage = async (message: string) => {
    try {
      sendMessage(message);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  return (
    <div className="relative h-screen overflow-hidden">
      <SettingsDialog isOpen={isSettingsOpen} setIsOpen={setIsSettingsOpen} />
      <div className="flex flex-col items-center justify-center h-full max-w-screen-sm mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-4 sm:space-y-8">
        <div className="flex flex-col items-center space-y-4 -mt-4 sm:-mt-8">
          <p className="text-black/50 dark:text-white/50 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center">
            What do you want to buy?
          </p>
        </div>
        <EmptyChatMessageInput
          sendMessage={handleSendMessage}
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
    </div>
  );
};

export default EmptyChat;
