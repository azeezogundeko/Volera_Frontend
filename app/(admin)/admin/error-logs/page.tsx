'use client';

import { useState, useEffect } from 'react';
import { 
  AlertCircle, 
  Search, 
  Filter, 
  Clock, 
  Terminal, 
  FileCode, 
  Copy, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/app/contexts/ThemeContext';
import toast from 'react-hot-toast';

interface ErrorLog {
  id: string;
  timestamp: string;
  level: 'error' | 'warning' | 'critical';
  message: string;
  stack?: string;
  path?: string;
  userAgent?: string;
  userId?: string;
}

export default function ErrorLogsPage() {
  const { theme } = useTheme();
  const [logs, setLogs] = useState<ErrorLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'error' | 'warning' | 'critical'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/error-logs`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLogs(data);
      }
    } catch (error) {
      toast.error('Failed to fetch error logs');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLogExpansion = (logId: string) => {
    const newExpanded = new Set(expandedLogs);
    if (expandedLogs.has(logId)) {
      newExpanded.delete(logId);
    } else {
      newExpanded.add(logId);
    }
    setExpandedLogs(newExpanded);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const filteredLogs = logs
    .filter(log => filter === 'all' || log.level === filter)
    .filter(log => 
      searchTerm === '' || 
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.path?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const getLevelColor = (level: ErrorLog['level']) => {
    switch (level) {
      case 'critical':
        return 'text-red-500 bg-red-500/10';
      case 'error':
        return 'text-orange-500 bg-orange-500/10';
      case 'warning':
        return 'text-yellow-500 bg-yellow-500/10';
      default:
        return '';
    }
  };

  return (
    <div className={cn(
      "min-h-screen p-6",
      theme === 'dark' ? "bg-[#0a0a0a] text-white" : "bg-gray-50 text-gray-900"
    )}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Error Logs</h1>
          <div className="flex items-center gap-2">
            <AlertCircle className={cn(
              "w-5 h-5",
              theme === 'dark' ? "text-white/70" : "text-gray-600"
            )} />
            <span className={theme === 'dark' ? "text-white/70" : "text-gray-600"}>
              System Errors
            </span>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-4">
            <Filter className={cn(
              "w-4 h-4",
              theme === 'dark' ? "text-white/70" : "text-gray-600"
            )} />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className={cn(
                'px-3 py-2 rounded-lg transition-colors',
                theme === 'dark'
                  ? "bg-[#1a1a1a] border-white/10 text-white"
                  : "bg-white border-gray-200 text-gray-900",
                'border focus:outline-none focus:ring-2 focus:ring-emerald-500/50'
              )}
            >
              <option value="all">All Levels</option>
              <option value="critical">Critical</option>
              <option value="error">Error</option>
              <option value="warning">Warning</option>
            </select>
          </div>

          <div className="relative w-full sm:w-auto">
            <Search className={cn(
              "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4",
              theme === 'dark' ? "text-white/50" : "text-gray-400"
            )} />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={cn(
                'w-full sm:w-64 pl-10 pr-4 py-2 rounded-lg transition-colors',
                theme === 'dark'
                  ? "bg-[#1a1a1a] border-white/10 text-white placeholder-white/30"
                  : "bg-white border-gray-200 text-gray-900 placeholder-gray-400",
                'border focus:outline-none focus:ring-2 focus:ring-emerald-500/50'
              )}
            />
          </div>
        </div>

        {/* Error Logs List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-6 h-6 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto"></div>
              <p className={cn(
                "mt-2",
                theme === 'dark' ? "text-white/70" : "text-gray-600"
              )}>Loading logs...</p>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className={cn(
              "text-center py-12 rounded-xl border",
              theme === 'dark'
                ? "bg-[#1a1a1a] border-white/10"
                : "bg-white border-gray-200"
            )}>
              <AlertCircle className={cn(
                "w-12 h-12 mx-auto mb-4",
                theme === 'dark' ? "text-white/30" : "text-gray-400"
              )} />
              <p className={theme === 'dark' ? "text-white/70" : "text-gray-600"}>
                No error logs found
              </p>
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className={cn(
                  "rounded-xl border",
                  theme === 'dark'
                    ? "bg-[#1a1a1a] border-white/10"
                    : "bg-white border-gray-200"
                )}
              >
                <div
                  className="p-4 cursor-pointer"
                  onClick={() => toggleLogExpansion(log.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          getLevelColor(log.level)
                        )}>
                          {log.level.toUpperCase()}
                        </span>
                        <span className={cn(
                          "text-sm",
                          theme === 'dark' ? "text-white/70" : "text-gray-600"
                        )}>
                          <Clock className="w-4 h-4 inline-block mr-1" />
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className={cn(
                        "font-mono text-sm",
                        theme === 'dark' ? "text-white" : "text-gray-900"
                      )}>
                        {log.message}
                      </p>
                    </div>
                    {expandedLogs.has(log.id) ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                </div>

                {expandedLogs.has(log.id) && (
                  <div className={cn(
                    "p-4 border-t",
                    theme === 'dark' ? "border-white/10" : "border-gray-200"
                  )}>
                    {log.path && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <FileCode className="w-4 h-4" />
                          <span className="text-sm font-medium">Path</span>
                        </div>
                        <code className={cn(
                          "block p-2 rounded text-sm font-mono",
                          theme === 'dark' ? "bg-black/30" : "bg-gray-50"
                        )}>
                          {log.path}
                        </code>
                      </div>
                    )}
                    
                    {log.stack && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <Terminal className="w-4 h-4" />
                            <span className="text-sm font-medium">Stack Trace</span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(log.stack!);
                            }}
                            className={cn(
                              "p-1 rounded-lg transition-colors",
                              theme === 'dark'
                                ? "hover:bg-white/10"
                                : "hover:bg-gray-100"
                            )}
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                        <pre className={cn(
                          "p-2 rounded overflow-x-auto text-sm font-mono",
                          theme === 'dark' ? "bg-black/30" : "bg-gray-50"
                        )}>
                          {log.stack}
                        </pre>
                      </div>
                    )}

                    {log.userAgent && (
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Terminal className="w-4 h-4" />
                          <span className="text-sm font-medium">User Agent</span>
                        </div>
                        <code className={cn(
                          "block p-2 rounded text-sm font-mono",
                          theme === 'dark' ? "bg-black/30" : "bg-gray-50"
                        )}>
                          {log.userAgent}
                        </code>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 