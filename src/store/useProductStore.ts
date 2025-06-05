import { create } from 'zustand';
import { productService, Product, ProductDetails } from '../services/productService';

type ProductState = {
  products: Product[];
  allSearchResults: Product[]; // <-- Add this line
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

const PAGE_SIZE = 5;

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  allSearchResults: [], // <-- Add this line
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
      const response = await productService.getProducts(1, PAGE_SIZE, options);

      const pagination = response.pagination || {
        currentPage: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
        totalItems: response.data.length,
        limit: PAGE_SIZE,
      };

      set({
        products: response.data,
        allSearchResults: [],
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
    const { currentPage, totalPages, loading, searchQuery, allSearchResults, sortOrder } = get();
    if (loading || currentPage >= totalPages) { return; }

    set({ loading: true });
    try {
      if (searchQuery && searchQuery.trim() && allSearchResults.length > 0) {
        // Manual pagination for search results
        const page = currentPage + 1;
        const totalItems = allSearchResults.length;
        const searchTotalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
        const paginated = allSearchResults.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

        set({
          products: paginated,
          currentPage: page,
          totalPages: searchTotalPages,
        });
      } else {
        // Normal backend pagination
        const options = sortOrder ? { sortBy: 'price', order: sortOrder } : undefined;
        const response = await productService.getProducts(currentPage + 1, PAGE_SIZE, options);
        const pagination = response.pagination || {
          currentPage: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
          totalItems: response.data.length,
          limit: PAGE_SIZE,
        };
        set({
          products: response.data,
          allSearchResults: [],
          currentPage: pagination.currentPage,
          totalPages: pagination.totalPages,
        });
      }
    } catch (err: any) {
      set({ error: err.message || 'Failed to load next page' });
    } finally {
      set({ loading: false });
    }
  },

  loadPreviousPage: async () => {
    const { currentPage, loading, searchQuery, allSearchResults, sortOrder } = get();
    if (loading || currentPage <= 1) { return; }

    set({ loading: true });
    try {
      if (searchQuery && searchQuery.trim() && allSearchResults.length > 0) {
        // Manual pagination for search results
        const page = currentPage - 1;
        const totalItems = allSearchResults.length;
        const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
        const paginated = allSearchResults.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

        set({
          products: paginated,
          currentPage: page,
          totalPages,
        });
      } else {
        // Normal backend pagination
        const options = sortOrder ? { sortBy: 'price', order: sortOrder } : undefined;
        const response = await productService.getProducts(currentPage - 1, PAGE_SIZE, options);
        const pagination = response.pagination || {
          currentPage: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
          totalItems: response.data.length,
          limit: PAGE_SIZE,
        };
        set({
          products: response.data,
          allSearchResults: [],
          currentPage: pagination.currentPage,
          totalPages: pagination.totalPages,
        });
      }
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
      let response;
      let allResults: Product[] = [];
      if (trimmedQuery) {
        // Fetch all search results and paginate manually
        response = await productService.searchProducts(trimmedQuery);
        allResults = response.data;

        // Manual pagination for search results
        const page = 1;
        const totalItems = allResults.length;
        const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
        const paginated = allResults.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

        set({
          allSearchResults: allResults,
          products: paginated,
          currentPage: page,
          totalPages,
        });
      } else {
        // Use backend pagination for all products
        response = await productService.getProducts(1, PAGE_SIZE);
        const pagination = response.pagination || {
          currentPage: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
          totalItems: response.data.length,
          limit: PAGE_SIZE,
        };

        set({
          allSearchResults: [],
          products: response.data,
          currentPage: pagination.currentPage,
          totalPages: pagination.totalPages,
        });
      }
    } catch (err: any) {
      set({
        error: err.message || 'Failed to search products',
        products: [],
        allSearchResults: [],
        currentPage: 1,
        totalPages: 1,
      });
    } finally {
      set({ loading: false });
    }
  },

  sortProducts: async (order: 'asc' | 'desc') => {
    const { searchQuery, allSearchResults } = get();
    set({ loading: true, error: null, sortOrder: order });

    try {
      let response;
      const trimmedQuery = searchQuery.trim();
      if (trimmedQuery && allSearchResults.length > 0) {
        // Sort and re-paginate the already fetched search results
        const sorted = [...allSearchResults].sort((a, b) =>
          order === 'asc' ? a.price - b.price : b.price - a.price
        );
        const page = 1;
        const totalItems = sorted.length;
        const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
        const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

        set({
          allSearchResults: sorted,
          products: paginated,
          currentPage: page,
          totalPages,
        });
      } else if (trimmedQuery) {
        // If for some reason allSearchResults is empty, fetch and sort
        response = await productService.searchProducts(trimmedQuery);
        const sorted = [...response.data].sort((a, b) =>
          order === 'asc' ? a.price - b.price : b.price - a.price
        );
        const page = 1;
        const totalItems = sorted.length;
        const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
        const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

        set({
          allSearchResults: sorted,
          products: paginated,
          currentPage: page,
          totalPages,
        });
      } else {
        // Normal backend sort
        response = await productService.getProducts(1, PAGE_SIZE, {
          sortBy: 'price',
          order,
        });
        const pagination = response.pagination || {
          currentPage: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
          totalItems: response.data.length,
          limit: PAGE_SIZE,
        };
        set({
          products: response.data,
          allSearchResults: [],
          currentPage: pagination.currentPage,
          totalPages: pagination.totalPages,
        });
      }
    } catch (err: any) {
      set({ error: err.message || 'Failed to sort products' });
    } finally {
      set({ loading: false });
    }
  },

  refreshProducts: async () => {
    const { searchQuery, sortOrder, allSearchResults } = get();
    set({ loading: true, error: null });
    try {
      if (searchQuery && searchQuery.trim() && allSearchResults.length > 0) {
        // Just re-paginate the already fetched search results
        const page = 1;
        const totalItems = allSearchResults.length;
        const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
        const paginated = allSearchResults.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

        set({
          products: paginated,
          currentPage: page,
          totalPages,
        });
      } else if (searchQuery && searchQuery.trim()) {
        // If for some reason allSearchResults is empty, fetch again
        const response = await productService.searchProducts(searchQuery, 1, PAGE_SIZE);
        const allResults = response.data;
        const page = 1;
        const totalItems = allResults.length;
        const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
        const paginated = allResults.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

        set({
          allSearchResults: allResults,
          products: paginated,
          currentPage: page,
          totalPages,
        });
      } else {
        const options = sortOrder ? { sortBy: 'price', order: sortOrder } : undefined;
        const response = await productService.getProducts(1, PAGE_SIZE, options);
        const pagination = response.pagination || {
          currentPage: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
          totalItems: response.data.length,
          limit: PAGE_SIZE,
        };

        set({
          products: response.data,
          allSearchResults: [],
          currentPage: pagination.currentPage,
          totalPages: pagination.totalPages,
        });
      }
    } catch (err: any) {
      set({
        error: err.message || 'Failed to refresh products',
        products: [],
        allSearchResults: [],
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
