export interface ProductImage {
    url: string;
    zoom_url?: string;
    alt?: string;
  }
  
export interface Seller {
    name?: string;
    rating?: number;
  }
  
export interface Specification {
    label?: string;
    value?: string;
  }
  
export interface Review {
    rating?: number;
    title?: string;
    comment?: string;
    date?: string;
    author?: string;
    verified?: boolean;
  }
  
export interface Stock {
    in_stock?: boolean;
    quantity?: number;
    quantity_sold?: number;
    min_sale_qty?: number;
    max_sale_qty?: number;
  }
  


export interface ProductDetail {
    name: string;
    brand?: string;
    category?: string;
    currency: string;
    description?: string;
    current_price: number;
    original_price?: number;
    discount?: number;
    url: string;
    image: string;
    images?: ProductImage[];
    source?: string;
    rating?: number;
    rating_count?: number;
    seller?: Seller;
    specifications?: Record<string, any>;
    features?: string[];
    reviews?: Review[];
    stock?: Stock;
    is_free_shipping?: boolean;
    is_pay_on_delivery?: boolean;
    express_delivery?: boolean;
    is_official_store?: boolean;
    product_id: string;
  }
  