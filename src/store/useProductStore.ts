import { create } from 'zustand';
import { productService, Product } from '../services/productService';

type ProductState = {
  products: Product[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  searchQuery: string;
  sortOrder: 'asc' | 'desc' | null;
  fetchProducts: () => Promise<void>;
  loadNextPage: () => Promise<void>;
  loadPreviousPage: () => Promise<void>;
  refreshProducts: () => Promise<void>;
  searchProducts: (query: string) => Promise<void>;
  sortProducts: (order: 'asc' | 'desc') => Promise<void>;
};

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  searchQuery: '',
  sortOrder: null,

  fetchProducts: async () => {
    const { sortOrder } = get();
    set({ loading: true, error: null, searchQuery: '' });
    try {
      const options = sortOrder ? { sortBy: 'price', order: sortOrder } : undefined;
      const response = await productService.getProducts(1, 5, options);
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
    const { currentPage, totalPages, loading, searchQuery, sortOrder } = get();
    if (loading || currentPage >= totalPages){ return; }

    set({ loading: true });
    try {
      let response;
      if (searchQuery) {
        response = await productService.searchProducts(
          searchQuery,
          currentPage + 1,
          5,
          sortOrder
        );
      } else {
        const options = sortOrder ? { sortBy: 'price', order: sortOrder } : undefined;
        response = await productService.getProducts(currentPage + 1, 5, options);
      }

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
    const { currentPage, loading, searchQuery, sortOrder } = get();
    if (loading || currentPage <= 1){ return; }

    set({ loading: true });
    try {
      let response;
      if (searchQuery) {
        response = await productService.searchProducts(
          searchQuery,
          currentPage - 1,
          5,
          sortOrder
        );
      } else {
        const options = sortOrder ? { sortBy: 'price', order: sortOrder } : undefined;
        response = await productService.getProducts(currentPage - 1, 5, options);
      }

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

  searchProducts: async (query: string) => {
    const trimmedQuery = query.trim();
    set({ loading: true, error: null, searchQuery: trimmedQuery });

    try {
      // Always execute the search, even with empty query
      const response = await productService.searchProducts(trimmedQuery, 1, 5);
      console.log('Search response:', response);

      set({
        products: response.data,
        currentPage: response.pagination.currentPage,
        totalPages: response.pagination.totalPages,
      });

    } catch (err: any) {
      console.error('Search error:', err);
      set({
        error: err.message || 'Failed to search products',
        products: [],
        currentPage: 1,
        totalPages: 1,
      });
    } finally {
      set({ loading: false });
    }
  },

  sortProducts: async (order: 'asc' | 'desc') => {
    const { searchQuery } = get();
    set({ loading: true, error: null, sortOrder: order });

    try {
      let response;
      if (searchQuery) {
        response = await productService.searchProducts(searchQuery, 1, 5, order);
      } else {
        response = await productService.getProducts(1, 5, {
          sortBy: 'price',
          order,
        });
      }

      set({
        products: response.data,
        currentPage: response.pagination.currentPage,
        totalPages: response.pagination.totalPages,
      });
    } catch (err: any) {
      set({ error: err.message || 'Failed to sort products' });
    } finally {
      set({ loading: false });
    }
  },

  refreshProducts: async () => {
    const { searchQuery, sortOrder } = get();
    set({ loading: true, error: null });
    try {
      let response;
      if (searchQuery) {
        response = await productService.searchProducts(searchQuery, 1, 5);
      } else {
        const options = sortOrder ? { sortBy: 'price', order: sortOrder } : undefined;
        response = await productService.getProducts(1, 5, options);
      }
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
