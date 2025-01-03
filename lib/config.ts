// WebSocket configuration
const WS_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'ws://localhost:8000';

export const getWebSocketURL = () => {
  // Ensure we're using 'ws' protocol
  const wsUrl = WS_BASE_URL.replace(/^http/, 'ws');
  const url = new URL('/websocket', wsUrl);
  
  // Get auth token with correct structure
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  const tokenType = typeof window !== 'undefined' ? localStorage.getItem('token_type') : null;
  
  if (token) {
    // Use the full token with type if available
    const fullToken = tokenType ? `${tokenType} ${token}` : token;
    url.searchParams.append('token', fullToken);
  }
  
  console.log('WebSocket URL:', url.toString()); // Add logging to debug the URL
  return url.toString();
};
