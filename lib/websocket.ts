import { toast } from 'sonner';

export interface WebSocketMessage {
  type: 'FILTER_REQUEST' | 'FILTER_RESPONSE' | 'ERROR';
  data: any;
}

class WebSocketService {
  private static instance: WebSocketService;
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout = 1000;
  private messageCallbacks: ((message: WebSocketMessage) => void)[] = [];
  private messageQueue: WebSocketMessage[] = [];
  private connecting = false;

  private constructor() {
    this.connect();
  }

  static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  private getWebSocketURL(): string {
    const wsBaseUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001';
    const url = new URL('/websocket', wsBaseUrl);
    
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const tokenType = typeof window !== 'undefined' ? localStorage.getItem('token_type') : null;
    
    if (token) {
      const fullToken = tokenType ? `${tokenType} ${token}` : token;
      url.searchParams.append('token', fullToken);
    }
    
    return url.toString();
  }

  private async connect(): Promise<boolean> {
    if (this.connecting) return false;
    this.connecting = true;

    try {
      const wsUrl = this.getWebSocketURL();
      this.ws = new WebSocket(wsUrl);
      
      return new Promise((resolve) => {
        if (!this.ws) {
          this.connecting = false;
          resolve(false);
          return;
        }

        this.ws.onopen = () => {
          console.log('WebSocket Connected');
          this.reconnectAttempts = 0;
          this.connecting = false;
          
          // Process any queued messages
          while (this.messageQueue.length > 0) {
            const message = this.messageQueue.shift();
            if (message) this.sendMessage(message);
          }
          
          resolve(true);
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.messageCallbacks.forEach(callback => callback(message));
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        };

        this.ws.onclose = (event) => {
          this.connecting = false;
          console.log('WebSocket Disconnected');
          
          if (event.code === 1000 || event.code === 1001 || event.code === 4401) {
            if (event.code === 4401) {
              toast.error('Authentication failed. Please log in again.');
            }
            resolve(false);
            return;
          }
          
          this.attemptReconnect();
          resolve(false);
        };

        this.ws.onerror = (error) => {
          this.connecting = false;
          console.error('WebSocket Error:', error);
          toast.error('Connection error occurred');
          resolve(false);
        };
      });
    } catch (error) {
      this.connecting = false;
      console.error('Failed to establish WebSocket connection:', error);
      this.attemptReconnect();
      return false;
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const timeout = this.reconnectTimeout * Math.pow(2, this.reconnectAttempts - 1);
      setTimeout(() => this.connect(), timeout);
    } else {
      toast.error('Failed to connect to server. Please refresh the page.');
    }
  }

  public async sendMessage(message: WebSocketMessage): Promise<boolean> {
    // If not connected, try to connect first
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      if (await this.connect()) {
        this.ws?.send(JSON.stringify(message));
        return true;
      } else {
        // Queue the message if connection failed
        this.messageQueue.push(message);
        return false;
      }
    }

    try {
      this.ws.send(JSON.stringify(message));
      return true;
    } catch (error) {
      console.error('Failed to send message:', error);
      this.messageQueue.push(message);
      return false;
    }
  }

  public subscribe(callback: (message: WebSocketMessage) => void) {
    this.messageCallbacks.push(callback);
    return () => {
      this.messageCallbacks = this.messageCallbacks.filter(cb => cb !== callback);
    };
  }

  public isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

export const websocketService = WebSocketService.getInstance();
