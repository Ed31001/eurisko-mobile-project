import { create } from 'zustand';
import { productService, Product } from '../services/productService';

type ProductState = {
  products: Product[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  fetchProducts: () => Promise<void>;
  loadNextPage: () => Promise<void>;
  loadPreviousPage: () => Promise<void>;
  refreshProducts: () => Promise<void>;
};

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await productService.getProducts(1, 5);
      set({
        products: response.data,
        currentPage: response.pagination.currentPage,
        totalPages: response.pagination.totalPages,
      });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch products' });
    } finally {
      set({ loading: false });
    }
  },

  loadNextPage: async () => {
    const { currentPage, totalPages, loading } = get();
    if (loading || currentPage >= totalPages){ return; }

    set({ loading: true });
    try {
      const response = await productService.getProducts(currentPage + 1, 5);
      set({
        products: response.data,
        currentPage: response.pagination.currentPage,
        totalPages: response.pagination.totalPages,
      });
    } catch (err: any) {
      set({ error: err.message || 'Failed to load next page' });
    } finally {
      set({ loading: false });
    }
  },

  loadPreviousPage: async () => {
    const { currentPage, loading } = get();
    if (loading || currentPage <= 1){ return; }

    set({ loading: true });
    try {
      const response = await productService.getProducts(currentPage - 1, 5);
      set({
        products: response.data,
        currentPage: response.pagination.currentPage,
        totalPages: response.pagination.totalPages,
      });
    } catch (err: any) {
      set({ error: err.message || 'Failed to load previous page' });
    } finally {
      set({ loading: false });
    }
  },

  refreshProducts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await productService.getProducts(1, 5);
      set({
        products: response.data,
        currentPage: response.pagination.currentPage,
        totalPages: response.pagination.totalPages,
      });
    } catch (err: any) {
      set({ error: err.message || 'Failed to refresh products' });
    } finally {
      set({ loading: false });
    }
  },
}));
