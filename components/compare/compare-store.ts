// lib/compare-store.ts
import { create } from 'zustand';

interface ProductResponse {
  name: string;
  current_price: number;
  original_price: number;
  brand: string;
  discount: number;
  rating: number;
  reviews_count: string;
  product_id: string;
  image: string;
  relevance_score: number;
  url: string;
  currency: string;
  source: string;
}


interface CompareState {
  compareProducts: ProductResponse[];
  addToCompare: (product: ProductResponse) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
}

export const useCompareProducts = create<CompareState>((set: (arg0: { (state: { compareProducts: any[]; }): { compareProducts: any[]; }; (state: any): { compareProducts: any; }; compareProducts?: never[]; }) => any) => ({
  compareProducts: [],
  addToCompare: (product: { product_id: any; }) => set((state: { compareProducts: any[]; }) => {
    if (state.compareProducts.length >= 4) return state;
    if (!state.compareProducts.some(p => p.product_id === product.product_id)) {
      return { compareProducts: [...state.compareProducts, product] };
    }
    return state;
  }),
  removeFromCompare: (productId: any) => set((state) => ({
    compareProducts: state.compareProducts.filter((p: { product_id: any; }) => p.product_id !== productId)
  })),
  clearCompare: () => set({ compareProducts: [] }),
}));