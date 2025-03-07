import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from '@headlessui/react';
import { Fragment } from 'react';

interface Model {
  key: string;
  title: string;
}

const Models: Model[] = [
  {
    key: 'deepseek',
    title: 'DeepSeek V3',
  },
  {
    key: 'gemini',
    title: 'Gemini 2.0 Flash',
  },
];

const ModelSelector = ({
  selectedModel,
  setSelectedModel,
}: {
  selectedModel: string;
  setSelectedModel: (model: string) => void;
}) => {
  const currentModel = Models.find((model) => model.key === selectedModel);

  return (
    <Popover className="relative">
      <PopoverButton
        type="button"
        className="flex items-center text-black/50 dark:text-white/50 rounded-xl hover:bg-light-secondary dark:hover:bg-dark-secondary transition duration-200 hover:text-black dark:hover:text-white px-2 py-1 focus:outline-none"
      >
        <div className="flex flex-row items-center space-x-1">
          <p className="text-xs font-medium">
            {currentModel ? currentModel.title : 'DeepSeek'}
          </p>
          <ChevronDown size={16} />
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
        <PopoverPanel className="absolute bottom-full mb-1 right-0 z-50">
          <div className="bg-light-primary dark:bg-dark-primary border rounded-lg border-light-200 dark:border-dark-200 shadow-lg">
            <div className="w-32 p-1">
              {Models.map((model, i) => (
                <PopoverButton
                  onClick={() => setSelectedModel(model.key)}
                  key={i}
                  className={cn(
                    'w-full px-3 py-1.5 rounded-md text-sm text-left transition-colors',
                    selectedModel === model.key
                      ? 'bg-light-secondary dark:bg-dark-secondary text-black dark:text-white'
                      : 'hover:bg-light-secondary dark:hover:bg-dark-secondary text-black/70 dark:text-white/70'
                  )}
                >
                  {model.title}
                </PopoverButton>
              ))}
            </div>
          </div>
        </PopoverPanel>
      </Transition>
    </Popover>
  );
};

export default ModelSelector;
