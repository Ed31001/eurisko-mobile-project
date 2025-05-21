import { create } from 'zustand';
import { productService, Product } from '../services/productService';

type ProductState = {
  products: Product[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  hasNextPage: boolean;
  fetchProducts: () => Promise<void>;
  loadMoreProducts: () => Promise<void>;
  refreshProducts: () => Promise<void>;
};

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  loading: false,
  error: null,
  currentPage: 1,
  hasNextPage: false,

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await productService.getProducts(1);
      set({
        products: response.data,
        currentPage: response.pagination.currentPage,
        hasNextPage: response.pagination.hasNextPage,
      });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch products' });
    } finally {
      set({ loading: false });
    }
  },

  loadMoreProducts: async () => {
    const { currentPage, loading, hasNextPage } = get();
    if (loading || !hasNextPage){ return; }

    set({ loading: true });
    try {
      const response = await productService.getProducts(currentPage + 1);
      set((state) => ({
        products: [...state.products, ...response.data],
        currentPage: response.pagination.currentPage,
        hasNextPage: response.pagination.hasNextPage,
      }));
    } catch (err: any) {
      set({ error: err.message || 'Failed to load more products' });
    } finally {
      set({ loading: false });
    }
  },

  refreshProducts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await productService.getProducts(1);
      set({
        products: response.data,
        currentPage: response.pagination.currentPage,
        hasNextPage: response.pagination.hasNextPage,
      });
    } catch (err: any) {
      set({ error: err.message || 'Failed to refresh products' });
    } finally {
      set({ loading: false });
    }
  },
}));
