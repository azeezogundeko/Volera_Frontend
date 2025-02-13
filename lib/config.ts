// WebSocket configuration
import process from 'process'

const WS_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://server.volera.app';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://server.volera.app';

export const getBaseURL = () => {
  return API_BASE_URL;
};

export const getWebSocketURL = () => {
  // Ensure we're using 'wss' protocol for secure WebSocket
  const wsUrl = WS_BASE_URL.replace(/^http/, 'wss');
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
