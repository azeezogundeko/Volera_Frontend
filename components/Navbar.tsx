import { Clock, Edit, Share, Trash, Share2, Bookmark, MoreHorizontal } from 'lucide-react';
import { Message } from './ChatWindow';
import { useEffect, useState } from 'react';
import { formatTimeDifference } from '@/lib/utils';
import DeleteChat from './DeleteChat';
import { useRouter } from 'next/navigation';
import { ShareDialog } from './ShareDialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import  cn  from 'classnames';


interface NavbarProps {
  messages: Message[];
  chatId: string;
  userEmail?: string;
}

const Navbar = ({ chatId, messages, userEmail = 'user@example.com' }: NavbarProps) => {
  const router = useRouter();
  const [title, setTitle] = useState<string>('');
  const [timeAgo, setTimeAgo] = useState<string>('');
  const [isMobile, setIsMobile] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks');
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
              <button 
                className="hidden sm:flex p-1.5 sm:p-2 text-black/70 dark:text-white/70 hover:bg-light-200 dark:hover:bg-dark-200 rounded-full transition-colors"
                onClick={() => setShareDialogOpen(true)}
              >
                <Share2 size={16} className="sm:w-[18px] sm:h-[18px]" />
              </button>
              <button 
                className={cn(
                  "hidden sm:flex p-1.5 sm:p-2 rounded-full transition-colors",
                  isBookmarked 
                    ? "text-emerald-400 hover:bg-emerald-400/10" 
                    : "text-black/70 dark:text-white/70 hover:bg-light-200 dark:hover:bg-dark-200"
                )}
                onClick={handleBookmark}
              >
                <Bookmark size={16} className="sm:w-[18px] sm:h-[18px]" />
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-1.5 sm:p-2 text-black/70 dark:text-white/70 hover:bg-light-200 dark:hover:bg-dark-200 rounded-full transition-colors">
                    <MoreHorizontal size={14} className="sm:w-[18px] sm:h-[18px]" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => setShareDialogOpen(true)}>
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleBookmark}>
                    <Bookmark className="mr-2 h-4 w-4" />
                    {isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    Delete chat
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
      <ShareDialog 
        open={shareDialogOpen} 
        onOpenChange={setShareDialogOpen}
        chatId={chatId}
      />
    </div>
  );
};

export default Navbar;
