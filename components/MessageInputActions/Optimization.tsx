import { ChevronDown, Sliders, Star, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from '@headlessui/react';
import { Fragment } from 'react';

const OptimizationModes = [
  {
    key: 'fast',
    title: 'Speed',
    description: 'Prioritize speed and get the quickest possible answer.',
    icon: <Zap size={20} className="text-[#FF9800]" />,
  },
  {
    key: 'balanced',
    title: 'Balanced (Coming Soon)',
    description: 'Find the right balance between speed and accuracy',
    icon: <Sliders size={20} className="text-[#4CAF50]/50" />,
    disabled: true,
  },
  {
    key: 'quality',
    title: 'Quality (Coming Soon)',
    description: 'Get the most thorough and accurate answer',
    icon: <Star size={16} className="text-[#2196F3]/50" />,
    disabled: true,
  },
];

const Optimization = ({
  optimizationMode,
  setOptimizationMode,
}: {
  optimizationMode: string;
  setOptimizationMode: (mode: string) => void;
}) => {
  const currentMode = OptimizationModes.find((mode) => mode.key === optimizationMode);

  return (
    <Popover className="relative">
      <PopoverButton
        type="button"
        className="flex items-center text-black/50 dark:text-white/50 rounded-xl hover:bg-light-secondary dark:hover:bg-dark-secondary transition duration-200 hover:text-black dark:hover:text-white px-2 py-1 focus:outline-none"
      >
        <div className="flex flex-row items-center space-x-1">
          {currentMode ? currentMode.icon : <Zap size={20} />}
          <p className="text-xs font-medium hidden lg:block">
            {currentMode ? currentMode.title : 'Speed'}
          </p>
          <ChevronDown size={20} className="-translate-x-1" />
        </div>
      </PopoverButton>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-150"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <PopoverPanel className="fixed z-[100] transform -translate-x-1/2 left-1/2 bottom-32 lg:bottom-24">
          <div className="bg-light-primary dark:bg-dark-primary border rounded-lg border-light-200 dark:border-dark-200 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 w-64 md:w-[500px] p-4 max-h-[400px] overflow-y-auto">
              {OptimizationModes.map((mode, i) => (
                <PopoverButton
                  onClick={() => !mode.disabled && setOptimizationMode(mode.key)}
                  key={i}
                  disabled={mode.disabled}
                  className={cn(
                    'p-2 rounded-lg flex flex-col items-start justify-start text-start space-y-2 duration-200 transition',
                    optimizationMode === mode.key
                      ? 'bg-light-secondary dark:bg-dark-secondary'
                      : 'hover:bg-light-secondary dark:hover:bg-dark-secondary',
                    mode.disabled && 'opacity-50 cursor-not-allowed hover:bg-transparent dark:hover:bg-transparent'
                  )}
                >
                  <div className="flex flex-row items-center space-x-2">
                    {mode.icon}
                    <p className="text-sm font-medium">{mode.title}</p>
                  </div>
                  <p className="text-black/70 dark:text-white/70 text-xs">
                    {mode.description}
                  </p>
                </PopoverButton>
              ))}
            </div>
          </div>
        </PopoverPanel>
      </Transition>
    </Popover>
  );
};

export default Optimization;
