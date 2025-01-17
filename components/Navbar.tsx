import { Clock, Edit, Share, Trash, Share2, Bookmark, MoreHorizontal } from 'lucide-react';
import { Message } from './ChatWindow';
import { useEffect, useState } from 'react';
import { formatTimeDifference } from '@/lib/utils';
import DeleteChat from './DeleteChat';
import { useRouter } from 'next/navigation';

import process from 'process';

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
  const [isMobile, setIsMobile] = useState(false);
  
  // const BookmarkButton = () => {
    const handleClick = async () => {
      try {
        const params = new URLSearchParams();
        params.set('chat_id', chatId);
        const token = localStorage.getItem('auth_token'); 
        const productsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chats/star_chat?${params.toString()}`, {
          headers: {
            'Authorization': `Bearer ${token}`, 
          },
        });
      } catch (error) {
        console.error("Error adding bookmark:", error);
      }
    };

  useEffect(() => {
    // Check if window is available (client-side)
    if (typeof window !== 'undefined') {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 640); // 640px is the 'sm' breakpoint
      };
      
      checkMobile();
      window.addEventListener('resize', checkMobile);
      
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      // Filter out ping messages when setting title
      const firstValidMessage = messages.find(msg => 
        typeof msg.content === 'string' && 
        !msg.content.includes('"type":"ping"') &&
        msg.content.trim() !== ''
      );
      
      if (firstValidMessage) {
        // Truncate title based on screen size
        const maxLength = isMobile ? 20 : 30;
        const truncatedTitle = firstValidMessage.content.length > maxLength
          ? firstValidMessage.content.substring(0, maxLength) + '...'
          : firstValidMessage.content;
        
        setTitle(truncatedTitle);
        setTimeAgo(formatTimeDifference(new Date(), messages[messages.length - 1].createdAt));
      }
    }
  }, [messages, isMobile]);

  return (
    <div className="sticky top-0 z-30 bg-white/80 dark:bg-[#111111]/80 backdrop-blur-sm border-b border-light-200 dark:border-dark-200">
      <div className="max-w-[800px] lg:max-w-[1000px] mx-auto px-4 sm:px-6 py-2.5 sm:py-4">
        <div className="flex items-center justify-between relative">
          {/* Left side - User info */}
          <div className="flex items-center space-x-2 sm:space-x-3 ml-10 sm:ml-0 min-w-[80px] sm:w-[200px]">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="text-white text-xs sm:text-sm font-medium">
                {userEmail.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="hidden sm:inline text-sm font-medium text-black/90 dark:text-white/90 truncate">
              {userEmail}
            </span>
          </div>

          {/* Center - Title */}
          <div className="flex flex-col items-center max-w-[130px] sm:max-w-[300px] lg:max-w-[400px] mx-2">
            <h1 className="text-xs sm:text-sm font-medium text-black/90 dark:text-white/90 truncate">
              {title || 'New Chat'}
            </h1>
            <span className="text-[10px] sm:text-xs text-black/50 dark:text-white/50 truncate">
              {timeAgo && `Last updated ${timeAgo}`}
            </span>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center min-w-[80px] sm:w-[200px] justify-end">
            <div className="flex space-x-0.5 sm:-space-x-1">
              <button className="hidden sm:flex p-1.5 sm:p-2 text-black/70 dark:text-white/70 hover:bg-light-200 dark:hover:bg-dark-200 rounded-full transition-colors">
                <Share2 size={16} className="sm:w-[18px] sm:h-[18px]" />
              </button>
              <button className="hidden sm:flex p-1.5 sm:p-2 text-black/70 dark:text-white/70 hover:bg-light-200 dark:hover:bg-dark-200 rounded-full transition-colors"
                onClick={handleClick}
              >
                <Bookmark size={16} className="sm:w-[18px] sm:h-[18px]" />
              </button>
              <button className="p-1.5 sm:p-2 text-black/70 dark:text-white/70 hover:bg-light-200 dark:hover:bg-dark-200 rounded-full transition-colors">
                <MoreHorizontal size={14} className="sm:w-[18px] sm:h-[18px]" />
              </button>
              <DeleteChat redirect chatId={chatId} chats={[]} setChats={() => {}} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
