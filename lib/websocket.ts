import { toast } from 'sonner';

export interface WebSocketMessage {
  message: any;
  type: 'FILTER_REQUEST' | 'FILTER_RESPONSE' | 'ERROR' | 'PRODUCT_DETAILS_RESPONSE' | 'PRODUCT_DETAILS_REQUEST' | 'COMPARE_REQUEST' | 'COMPARE_RESPONSE';
  data: any;
}

interface FilterResponse {
  filters: Array<any>;
  aiResponse: string;
}

export interface ProductDetailsResponse extends WebSocketMessage {
  type: 'PRODUCT_DETAILS_RESPONSE';
  productId: string;
  aiResponse?: string;
}

export interface CompareResponse extends WebSocketMessage {
  type: 'COMPARE_RESPONSE';
  response?: string;
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
      console.log('Connecting to WebSocket:', wsUrl);
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
            console.log('Raw WebSocket message received:', event.data);
            let parsedData: any;
            
            try {
              parsedData = JSON.parse(event.data);
            } catch (parseError) {
              console.error('Failed to parse WebSocket message:', parseError);
              return;
            }

            // Determine message structure based on type
            let message: WebSocketMessage;
            switch (parsedData.type) {
              case 'PRODUCT_DETAILS_RESPONSE':
                message = {
                  type: 'PRODUCT_DETAILS_RESPONSE',
                  data: {
                    productId: parsedData.productId,
                    aiResponse: parsedData.aiResponse
                  },
                  message: null
                };
                break;
              case 'COMPARE_RESPONSE':
                message = {
                  type: 'COMPARE_RESPONSE',
                  data: {
                    response: parsedData.response
                  },
                  message: null
                };
                break;
              case 'FILTER_RESPONSE':
                message = {
                  type: 'FILTER_RESPONSE',
                  data: parsedData.data || parsedData,
                  message: null
                };

                // Validate FILTER_RESPONSE structure
                if (!message.data.filters || !Array.isArray(message.data.filters)) {
                  console.error('Invalid filter response structure:', message.data);
                  message = {
                    type: 'ERROR',
                    data: { message: 'Invalid response format from server' },
                    message: null
                  };
                }
                break;
              
              default:
                message = {
                  type: parsedData.type || 'ERROR',
                  data: parsedData.data || parsedData,
                  message: null
                };
            }

            console.log('Processed WebSocket message:', message);
            this.messageCallbacks.forEach(callback => callback(message));
          } catch (error) {
            console.error('Error processing WebSocket message:', error);
          }
        };

        this.ws.onclose = (event) => {
          this.connecting = false;
          console.log('WebSocket Disconnected:', {
            code: event.code,
            reason: event.reason,
            wasClean: event.wasClean
          });
          
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
      console.log(`Attempting reconnect in ${timeout}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      setTimeout(() => this.connect(), timeout);
    } else {
      toast.error('Failed to connect to server. Please refresh the page.');
    }
  }

  public async sendMessage(message: WebSocketMessage): Promise<boolean> {
    console.log('Sending WebSocket message:', message);
    
    // If not connected, try to connect first
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.log('WebSocket not connected, attempting to connect...');
      if (await this.connect()) {
        try {
          this.ws?.send(JSON.stringify(message));
          console.log('Message sent successfully after connecting');
          return true;
        } catch (error) {
          console.error('Failed to send message after connecting:', error);
          this.messageQueue.push(message);
          return false;
        }
      } else {
        console.log('Failed to connect, queueing message');
        this.messageQueue.push(message);
        return false;
      }
    }

    try {
      this.ws.send(JSON.stringify(message));
      console.log('Message sent successfully');
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