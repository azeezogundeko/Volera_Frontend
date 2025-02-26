'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import SessionExpired from '@/components/SessionExpired';

interface SessionContextType {
  setSessionExpired: (value: boolean) => void;
  handleAuthError: (status: number) => boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}

interface SessionProviderProps {
  children: ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
  const [isSessionExpired, setSessionExpired] = useState(false);

  // Function to handle auth errors
  const handleAuthError = useCallback((status: number): boolean => {
    if (status === 401) {
      setSessionExpired(true);
      return true;
    }
    return false;
  }, []);

  // Check for auth token on mount and when isSessionExpired changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (!token && window.location.pathname !== '/login') {
        setSessionExpired(true);
      }
    }
  }, []);

  return (
    <SessionContext.Provider value={{ setSessionExpired, handleAuthError }}>
      {isSessionExpired ? <SessionExpired /> : children}
    </SessionContext.Provider>
  );
} 