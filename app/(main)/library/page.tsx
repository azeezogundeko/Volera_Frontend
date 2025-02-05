'use client';

import DeleteChat from '@/components/DeleteChat';
import LoadingPage from '@/components/LoadingPage';
import { cn, formatTimeDifference } from '@/lib/utils';
import { BookOpenText, ClockIcon, Search, Filter, MessageSquare, Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ChatThreads from '@/components/ChatThreads';
import { useApi } from '@/lib/hooks/useApi';

export interface Chat {
  id: string;
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
  const { fetchWithAuth } = useApi();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [dateRange, setDateRange] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [focusMode, setFocusMode] = useState('all');
  const [libraryData, setLibraryData] = useState(null);

  useEffect(() => {
    setMounted(true);
    const fetchChats = async () => {
      setLoading(true);

      const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/chats`, {
        method: 'GET',
      });

      const data = await res.json();

      setChats(data.chats);
      setLoading(false);
    };

    fetchChats();
  }, []);

  useEffect(() => {
    const fetchLibraryData = async () => {
      try {
        const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/library/data`);
        const data = await response.json();
        setLibraryData(data);
      } catch (error) {
        console.error('Failed to fetch library data:', error);
      }
    };

    fetchLibraryData();
  }, []);

  const handleDateRangeChange = (e: { target: { value: string; }; }) => {
    setDateRange(e.target.value);
    fetchFilteredChats(e.target.value, sortBy, focusMode);
  };

  const handleSortByChange = (e: { target: { value: string; }; }) => {
    setSortBy(e.target.value);
    fetchFilteredChats(dateRange, e.target.value, focusMode);
  };

  const handleFocusModeChange = (e: { target: { value: string; }; }) => {
    setFocusMode(e.target.value);
    fetchFilteredChats(dateRange, sortBy, e.target.value);
  };

  const fetchFilteredChats = async (dateRange: string, sortBy: string, focusMode: string) => {
    setLoading(true);
    const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/chats/filter?dateRange=${dateRange}&sortBy=${sortBy}&focusMode=${focusMode}`, {
      method: 'GET',
    });
    const data = await res.json();
    setChats(data.chats);
    setLoading(false);
  };

  const filteredChats = chats.filter(chat => 
    chat.title && typeof chat.title === 'string' && chat.title.toLowerCase().includes(searchQuery.toLowerCase())
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

  if (!mounted || loading) {
    return <LoadingPage />;
  }

  return (
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
                <select 
                  value={dateRange} 
                  onChange={handleDateRangeChange} 
                  className={cn(
                    "w-full p-2 rounded-lg",
                    "bg-light-50 dark:bg-dark-50",
                    "border border-light-200 dark:border-dark-200",
                    "text-sm text-black/90 dark:text-white/90"
                  )}
                >
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
                <select 
                  value={sortBy} 
                  onChange={handleSortByChange} 
                  className={cn(
                    "w-full p-2 rounded-lg",
                    "bg-light-50 dark:bg-dark-50",
                    "border border-light-200 dark:border-dark-200",
                    "text-sm text-black/90 dark:text-white/90"
                  )}
                >
                  <option value="recent">Most Recent</option>
                  <option value="oldest">Oldest First</option>
                  {/* <option value="messages">Most Messages</option> */}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-black/60 dark:text-white/60 mb-2">
                  Focus Mode
                </label>
                <select 
                  value={focusMode} 
                  onChange={handleFocusModeChange} 
                  className={cn(
                    "w-full p-2 rounded-lg",
                    "bg-light-50 dark:bg-dark-50",
                    "border border-light-200 dark:border-dark-200",
                    "text-sm text-black/90 dark:text-white/90"
                  )}
                >
                  <option value="all">All Modes</option>
                  <option value="Q/A">Q/A</option>
                  {/* <option value="focused">Focused</option>
                  <option value="creative">Creative</option> */}
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
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                              }}
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
        {/* <ChatThreads /> */}
      </div>
    </div>
  );
};

export default Page;
