import { Clock, Edit, Share, Trash, Share2, Bookmark, MoreHorizontal } from 'lucide-react';
import { Message } from './ChatWindow';
import { useEffect, useState } from 'react';
import { formatTimeDifference } from '@/lib/utils';
import DeleteChat from './DeleteChat';
import { useRouter } from 'next/navigation';

const Navbar = ({
  chatId,
  messages,
  userEmail = 'user@example.com',
}: {
  messages: Message[];
  chatId: string;
  userEmail?: string;
}) => {
  const router = useRouter();
  const [title, setTitle] = useState<string>('');
  const [timeAgo, setTimeAgo] = useState<string>('');

  useEffect(() => {
    if (messages.length > 0) {
      const newTitle =
        messages[0].content.length > 20
          ? `${messages[0].content.substring(0, 20).trim()}...`
          : messages[0].content;
      setTitle(newTitle);
      const newTimeAgo = formatTimeDifference(
        new Date(),
        messages[0].createdAt,
      );
      setTimeAgo(newTimeAgo);
    }
  }, [messages]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (messages.length > 0) {
        const newTimeAgo = formatTimeDifference(
          new Date(),
          messages[0].createdAt,
        );
        setTimeAgo(newTimeAgo);
      }
    }, 1000);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="sticky top-0 z-50 bg-white dark:bg-[#111111] border-b border-light-200 dark:border-dark-200">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {userEmail.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-sm font-medium text-black/90 dark:text-white/90">
              {userEmail}
            </span>
          </div>
        </div>

        <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center">
          <h1 className="text-sm font-medium text-black/90 dark:text-white/90">
            {title || 'New Chat'}
          </h1>
          <span className="text-xs text-black/50 dark:text-white/50">
            {timeAgo && `Last updated ${timeAgo}`}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button className="p-2 text-black/70 dark:text-white/70 hover:bg-light-200 dark:hover:bg-dark-200 rounded-full transition-colors">
            <Share2 size={18} />
          </button>
          <button className="p-2 text-black/70 dark:text-white/70 hover:bg-light-200 dark:hover:bg-dark-200 rounded-full transition-colors">
            <Bookmark size={18} />
          </button>
          <button className="p-2 text-black/70 dark:text-white/70 hover:bg-light-200 dark:hover:bg-dark-200 rounded-full transition-colors">
            <MoreHorizontal size={18} />
          </button>
          <DeleteChat redirect chatId={chatId} chats={[]} setChats={() => {}} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
