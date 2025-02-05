import { useSession } from '@/components/providers/SessionProvider';

interface FetchOptions extends RequestInit {
  requiresAuth?: boolean;
}

export function useApi() {
  const { handleAuthError } = useSession();

  const fetchWithAuth = async (url: string, options: FetchOptions = {}) => {
    const { requiresAuth = true, ...fetchOptions } = options;

    try {
      // Add auth header if required
      if (requiresAuth) {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          handleAuthError(401);
          throw new Error('No auth token available');
        }

        fetchOptions.headers = {
          ...fetchOptions.headers,
          'Authorization': `Bearer ${token}`
        };
      }

      const response = await fetch(url, fetchOptions);

      // Handle unauthorized responses
      if (response.status === 401) {
        handleAuthError(401);
        throw new Error('Unauthorized');
      }

      return response;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  };

  return { fetchWithAuth };
} 