import { Search } from 'lucide-react';
import { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400 dark:text-white/40" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="block w-full pl-9 pr-4 py-2 text-sm text-gray-900 dark:text-white bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#222] rounded-lg focus:ring-2 focus:ring-[#17B1B1]/20 focus:border-[#17B1B1] dark:focus:border-[#17B1B1] transition-colors placeholder:text-gray-500 dark:placeholder:text-white/40"
          placeholder="Search articles, topics, or users..."
        />
      </div>
    </form>
  );
};
