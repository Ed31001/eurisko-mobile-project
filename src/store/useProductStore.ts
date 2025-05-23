import { create } from 'zustand';
import { productService, Product, ProductDetails } from '../services/productService';

type ProductState = {
  products: Product[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  searchQuery: string;
  sortOrder: 'asc' | 'desc' | undefined;
  selectedProduct: ProductDetails | null;
  fetchProducts: () => Promise<void>;
  loadNextPage: () => Promise<void>;
  loadPreviousPage: () => Promise<void>;
  refreshProducts: () => Promise<void>;
  searchProducts: (query: string) => Promise<void>;
  sortProducts: (order: 'asc' | 'desc') => Promise<void>;
  getProductById: (id: string) => Promise<void>;
};

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  searchQuery: '',
  sortOrder: undefined,
  selectedProduct: null,

  fetchProducts: async () => {
    const { sortOrder } = get();
    set({ loading: true, error: null, searchQuery: '' });
    try {
      const options = sortOrder ? { sortBy: 'price', order: sortOrder } : undefined;
      const response = await productService.getProducts(1, 5, options);

      const pagination = response.pagination || {
        currentPage: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
        totalItems: response.data.length,
        limit: 5,
      };

      set({
        products: response.data,
        currentPage: pagination.currentPage,
        totalPages: pagination.totalPages,
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
      const response = await productService.searchProducts(trimmedQuery, 1, 5);

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
        error: null,
      });
    } catch (err: any) {
      set({
        error: err.message || 'Failed to refresh products',
        products: [],
      });
    } finally {
      set({ loading: false });
    }
  },

  getProductById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await productService.getProductById(id);
      if (response.success) {
        set({ selectedProduct: response.data });
      } else {
        throw new Error('Failed to fetch product details');
      }
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch product details' });
    } finally {
      set({ loading: false });
    }
  },
}));
