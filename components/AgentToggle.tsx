import React from 'react';
import { Bot, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AgentToggleProps {
  agentType: 'default' | 'copilot';
  setAgentType: (type: 'default' | 'copilot') => void;
}

export function AgentToggle({ agentType, setAgentType }: AgentToggleProps) {
  return (
    <div className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <button
        onClick={() => setAgentType('default')}
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors',
          'text-sm font-medium',
          agentType === 'default'
            ? 'bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-700/50'
        )}
      >
        <Bot className="w-4 h-4" />
        <span>Normal</span>
      </button>
      <button
        onClick={() => setAgentType('copilot')}
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors',
          'text-sm font-medium',
          agentType === 'copilot'
            ? 'bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-700/50'
        )}
      >
        <Sparkles className="w-4 h-4" />
        <span>Agent</span>
      </button>
    </div>
  );
} 