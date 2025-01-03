'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AuthDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function AuthDialog({ isOpen, setIsOpen }: AuthDialogProps) {
  const router = useRouter();

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className={cn(
                'w-full max-w-md transform overflow-hidden rounded-2xl',
                'bg-white dark:bg-dark-primary p-6',
                'text-left align-middle shadow-xl transition-all'
              )}>
                <Dialog.Title
                  as="h3"
                  className="text-lg font-semibold leading-6 text-black/90 dark:text-white/90"
                >
                  Sign in to Continue
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-black/70 dark:text-white/70">
                    To use the chat feature, you need to be signed in. Create an account or sign in to continue.
                  </p>
                </div>

                <div className="mt-4 space-y-3">
                  <button
                    type="button"
                    className={cn(
                      'w-full px-4 py-2 rounded-lg',
                      'bg-primary text-white',
                      'text-sm font-medium',
                      'hover:bg-primary/90',
                      'transition-colors duration-200'
                    )}
                    onClick={() => {
                      setIsOpen(false);
                      router.push('/signup');
                    }}
                  >
                    Create Account
                  </button>
                  <button
                    type="button"
                    className={cn(
                      'w-full px-4 py-2 rounded-lg',
                      'border border-light-200 dark:border-dark-200',
                      'text-sm font-medium',
                      'text-black/90 dark:text-white/90',
                      'hover:bg-light-100 dark:hover:bg-dark-100',
                      'transition-colors duration-200'
                    )}
                    onClick={() => {
                      setIsOpen(false);
                      router.push('/login');
                    }}
                  >
                    Sign In
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
