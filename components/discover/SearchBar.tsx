import { useState, useEffect, useRef } from 'react';
import { Search, Command, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const popularSearches = [
    'Nike shoes',
    'Wireless headphones',
    'Gaming laptop',
    'Smart watch',
    'Running shoes',
    'Bluetooth speaker',
    'Backpack',
    'Sunglasses'
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        inputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (query.trim()) {
      const filtered = popularSearches.filter(item =>
        item.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleSubmit = (searchQuery: string = query) => {
    onSearch(searchQuery);
    setSuggestions([]);
    if (searchQuery !== query) {
      setQuery(searchQuery);
    }
  };

  return (
    <div className="relative">
      <div
        className={`flex items-center gap-2 px-4 h-12 bg-white dark:bg-black rounded-xl border transition-all duration-200 ${
          focused
            ? 'border-emerald-500 shadow-lg shadow-emerald-500/10'
            : 'border-light-200 dark:border-dark-200'
        }`}
      >
        <Search className="w-5 h-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSubmit();
            }
          }}
          placeholder="Search products..."
          className="flex-1 h-full bg-transparent outline-none placeholder:text-gray-400"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              onSearch('');
            }}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
        <div className="hidden md:flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs text-gray-500">
          <Command className="w-3 h-3" />
          <span>K</span>
        </div>
      </div>

      {focused && (suggestions.length > 0 || !query) && (
        <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-white dark:bg-black rounded-xl border border-light-200 dark:border-dark-200 shadow-xl">
          {!query && (
            <div className="px-2 py-1.5">
              <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                Popular Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                {popularSearches.slice(0, 6).map((search) => (
                  <button
                    key={search}
                    onClick={() => handleSubmit(search)}
                    className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}
          {suggestions.length > 0 && (
            <div className="px-2 py-1.5">
              <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                Suggestions
              </h3>
              <div className="space-y-1">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSubmit(suggestion)}
                    className="w-full px-2 py-1.5 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
