import LoadingSpinner from './LoadingSpinner';

const LoadingPage = () => {
  return (
    <div className="fixed inset-0 bg-white dark:bg-[#111111] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" className="border-[#4ade80]" />
        <p className="text-black/50 dark:text-white/50 text-sm animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
};

export default LoadingPage;
