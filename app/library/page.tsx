'use client';

import DeleteChat from '@/components/DeleteChat';
import { cn, formatTimeDifference } from '@/lib/utils';
import { BookOpenText, ClockIcon, Search, Filter, MessageSquare, Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ChatThreads from '@/components/ChatThreads';

export interface Chat {
  title: string;
  user_id: string;
  focus_mode: string;
  files: any[];
  end_time: string;
  start_time: string;
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: any[];
  $databaseId: string;
  $collectionId: string;
}

const Page = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      setChats(data.chats);
      setLoading(false);
    };

    fetchChats();
  }, []);

  const filteredChats = chats.filter(chat => 
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group chats by date
  const groupedChats = filteredChats.reduce((groups: { [key: string]: Chat[] }, chat) => {
    const date = new Date(chat.$createdAt).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(chat);
    return groups;
  }, {});

  return loading ? (
    <div className="flex flex-row items-center justify-center min-h-screen">
      <svg
        aria-hidden="true"
        className="w-8 h-8 text-light-200 fill-light-secondary dark:text-[#202020] animate-spin dark:fill-[#ffffff3b]"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100.003 78.2051 78.1951 100.003 50.5908 100C22.9765 99.9972 0.997224 78.018 1 50.4037C1.00281 22.7993 22.8108 0.997224 50.4251 1C78.0395 1.00281 100.018 22.8108 100 50.4251ZM9.08164 50.594C9.06312 73.3997 27.7909 92.1272 50.5966 92.1457C73.4023 92.1642 92.1298 73.4365 92.1483 50.6308C92.1669 27.8251 73.4392 9.0973 50.6335 9.07878C27.8278 9.06026 9.10003 27.787 9.08164 50.594Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4037 97.8624 35.9116 96.9801 33.5533C95.1945 28.8227 92.871 24.3692 90.0681 20.348C85.6237 14.1775 79.4473 9.36872 72.0454 6.45794C64.6435 3.54717 56.3134 2.65431 48.3133 3.89319C45.869 4.27179 44.3768 6.77534 45.014 9.20079C45.6512 11.6262 48.1343 13.0956 50.5786 12.717C56.5073 11.8281 62.5542 12.5399 68.0406 14.7911C73.527 17.0422 78.2187 20.7487 81.5841 25.4923C83.7976 28.5886 85.4467 32.059 86.4416 35.7474C87.1273 38.1189 89.5423 39.6781 91.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
    </div>
  ) : (
    <div className="min-h-screen bg-light-50 dark:bg-dark-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-black/90 dark:text-white/90">Library</h1>
            <p className="text-sm text-black/60 dark:text-white/60 mt-1">
              Browse and search through your conversation history
            </p>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black/40 dark:text-white/40" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "w-full pl-10 pr-4 py-2 rounded-xl",
                "bg-light-100 dark:bg-dark-100",
                "border border-light-200 dark:border-dark-200",
                "focus:outline-none focus:ring-2 focus:ring-green-500/50",
                "text-black/90 dark:text-white/90",
                "placeholder-black/40 dark:placeholder-white/40"
              )}
            />
          </div>
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className={cn(
              "p-2 rounded-xl",
              "bg-light-100 dark:bg-dark-100",
              "border border-light-200 dark:border-dark-200",
              "hover:bg-light-200 dark:hover:bg-dark-200",
              "transition-colors duration-200",
              "focus:outline-none focus:ring-2 focus:ring-green-500/50"
            )}
          >
            <Filter className="w-5 h-5 text-black/60 dark:text-white/60" />
          </button>
        </div>

        {/* Filters Panel - conditionally rendered */}
        {filterOpen && (
          <div className={cn(
            "mb-8 p-4 rounded-xl",
            "bg-light-100 dark:bg-dark-100",
            "border border-light-200 dark:border-dark-200"
          )}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-black/60 dark:text-white/60 mb-2">
                  Date Range
                </label>
                <select className={cn(
                  "w-full p-2 rounded-lg",
                  "bg-light-50 dark:bg-dark-50",
                  "border border-light-200 dark:border-dark-200",
                  "text-sm text-black/90 dark:text-white/90"
                )}>
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Past Week</option>
                  <option value="month">Past Month</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-black/60 dark:text-white/60 mb-2">
                  Sort By
                </label>
                <select className={cn(
                  "w-full p-2 rounded-lg",
                  "bg-light-50 dark:bg-dark-50",
                  "border border-light-200 dark:border-dark-200",
                  "text-sm text-black/90 dark:text-white/90"
                )}>
                  <option value="recent">Most Recent</option>
                  <option value="oldest">Oldest First</option>
                  <option value="messages">Most Messages</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-black/60 dark:text-white/60 mb-2">
                  Focus Mode
                </label>
                <select className={cn(
                  "w-full p-2 rounded-lg",
                  "bg-light-50 dark:bg-dark-50",
                  "border border-light-200 dark:border-dark-200",
                  "text-sm text-black/90 dark:text-white/90"
                )}>
                  <option value="all">All Modes</option>
                  <option value="default">Default</option>
                  <option value="focused">Focused</option>
                  <option value="creative">Creative</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Chat Threads */}
        {filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <MessageSquare className="w-12 h-12 text-black/20 dark:text-white/20 mb-4" />
            <p className="text-black/50 dark:text-white/50 text-sm">No messages found</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedChats).map(([date, dateChats]) => (
              <div key={date} className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <h2 className="text-sm font-medium text-black/70 dark:text-white/70">{date}</h2>
                </div>
                <div className="space-y-3">
                  {dateChats.map((chat) => (
                    <Link 
                      key={chat.$id} 
                      href={`/c/${chat.$id}`}
                      className="block group"
                    >
                      <div className="bg-white dark:bg-dark-100 rounded-xl border border-light-200 dark:border-dark-200 p-4 hover:shadow-lg transition-all duration-200 hover:border-blue-500/30">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-medium text-black dark:text-white group-hover:text-blue-500 transition-colors line-clamp-2">
                              {chat.title}
                            </h3>
                            <div className="mt-1 flex items-center space-x-3 text-sm">
                              <div className="flex items-center space-x-1.5 text-black/50 dark:text-white/50">
                                <ClockIcon className="w-4 h-4" />
                                <span>{formatTimeDifference(new Date(), chat.$createdAt)} ago</span>
                              </div>
                              <div className="flex items-center space-x-1.5 text-black/50 dark:text-white/50">
                                <MessageSquare className="w-4 h-4" />
                                <span>{chat.focus_mode || 'Standard'}</span>
                              </div>
                            </div>
                          </div>
                          <div className="ml-4 flex items-center space-x-2">
                            <ArrowRight className="w-5 h-5 text-black/30 dark:text-white/30 group-hover:text-blue-500 transition-colors" />
                            <DeleteChat
                              chatId={chat.$id}
                              chats={chats}
                              setChats={setChats}
                            />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        <ChatThreads />
      </div>
    </div>
  );
};

export default Page;
