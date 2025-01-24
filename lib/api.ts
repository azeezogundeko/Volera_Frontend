import { getBaseURL } from './config';

export interface PriceHistory {
  date: string;
  price: number;
}

export interface Chat {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
}

interface ProductResponse {
  name: string;
  current_price: number;
  original_price: number;
  brand: string;
  discount: number;
  rating: number;
  reviews_count: number;
  product_id: string;
  image: string;
  relevance_score: number;
  url: string;
  currency: string;
  source: string;
}

export interface TrackedItem {
  id: string;
  currentPrice: number;
  targetPrice: number;
  product: ProductResponse;
  dateAdded: string;
  notificationsEnabled: boolean;
}

export interface TrendingProduct {
  id: string;
  title: string;
  price: number;
  image: string;
  trend: 'up' | 'down';
  trendValue: string;
}

export interface DashboardStats {
  activeChats: number;
  trackedItems: number;
  priceAlerts: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const response = await fetch(
    `${getBaseURL()}/track/stats`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem('token_type')} ${localStorage.getItem('auth_token')}`
      },  
    }
  );
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard stats');
  }
  return response.json();
}

export async function getPriceHistory(): Promise<PriceHistory[]> {
  const response = await fetch(
    `${getBaseURL()}/track/price-history`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem('token_type')} ${localStorage.getItem('auth_token')}`
      },
      
      
    }
  );
  if (!response.ok) {
    throw new Error('Failed to fetch price history');
  }
  return response.json();
}

export async function getRecentChats(): Promise<Chat[]> {
  const params = new URLSearchParams();
  
  // Add limit and page parameters
  params.append('limit', '3');
  params.append('page', '1');

  const response = await fetch(
    `${getBaseURL()}/chats?${params.toString()}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem('token_type')} ${localStorage.getItem('auth_token')}`
      }
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch recent chats');
  }
  return response.json();
}


export async function getTrackedItems(): Promise<TrackedItem[]> {
  const response = await fetch(
    `${getBaseURL()}/track`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem('token_type')} ${localStorage.getItem('auth_token')}`
      }, 
    }
  );
  if (!response.ok) {
    throw new Error('Failed to fetch tracked items');
  }
  return response.json();
}

export async function getTrendingProducts(): Promise<TrendingProduct[]> {
  const params = new URLSearchParams({
    page: '1',
    limit: '3'
  });
  const response = await fetch(
    `${getBaseURL()}/product/trending-products?${params.toString()}`, 
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem('token_type')} ${localStorage.getItem('auth_token')}`
      }, 
    }
  );
  if (!response.ok) {
    throw new Error('Failed to fetch trending products');
  }
  return response.json();
}

export async function getAllTrackedItems(): Promise<TrackedItem[]> {
  const response = await fetch(
    `${getBaseURL()}/track`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem('token_type')} ${localStorage.getItem('auth_token')}`
      },
      
      
    }
  
  );
  if (!response.ok) {
    throw new Error('Failed to fetch tracked items');
  }
  return response.json();
}
