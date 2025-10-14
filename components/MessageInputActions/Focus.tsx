import { cn } from '@/lib/utils';

const Focus = ({
  focusMode,
  setFocusMode,
}: {
  focusMode: string;
  setFocusMode: (mode: string) => void;
}) => {
  const isUltraSearch = focusMode === 'ultrasearch';
  
  const toggleFocusMode = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent form submission
    e.stopPropagation(); // Stop event propagation
    setFocusMode(isUltraSearch ? 'all' : 'ultrasearch');
  };

  return (
    <button
      type="button" // Explicitly set button type to prevent form submission
      onClick={toggleFocusMode}
      className={cn(
        'flex items-center px-3 py-1.5 rounded-lg transition-all duration-200',
        'text-xs font-medium',
        isUltraSearch
          ? 'bg-[#4CAF50]/10 text-[#4CAF50] border border-[#4CAF50]/20'
          : 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300'
      )}
    >
      <span>Ultra Search</span>
    </button>
  );
};

export default Focus;
