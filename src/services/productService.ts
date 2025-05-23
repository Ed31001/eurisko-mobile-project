import { api } from '../api/axios';

export interface Product {
  _id: string;
  title: string;
  price: number;
  images: Array<{ url: string }>;
  description: string;
  location: {
    name: string;
    latitude: number;
  };
}

export interface ProductsResponse {
  success: boolean;
  data: Product[];
  pagination: {
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    totalItems: number;
    limit: number;
  };
}

export interface ProductDetails {
  _id: string;
  title: string;
  price: number;
  description: string;
  images: Array<{ url: string }>;
  location: {
    name: string;
    latitude: number;
  };
  user: {
    _id: string;
    firstName?: string;
    lastName?: string;
    email: string;
    profileImage?: {
      url: string;
    };
  };
  updatedAt: string;
}

export const productService = {
  searchProducts: async (query: string, page = 1, limit = 5, sortOrder?: 'asc' | 'desc') => {
    try {
      // Always fetch products, regardless of query
      const response = await api.get<ProductsResponse>(
        '/products?page=1&limit=100'
      );

      let filteredData = response.data.data || [];

      // Filter only if there's a query
      if (query) {
        filteredData = filteredData.filter(product =>
          product.title.toLowerCase().includes(query.toLowerCase())
        );
      }

      // Sort if needed
      if (sortOrder) {
        filteredData.sort((a, b) => {
          return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
        });
      }

      // Calculate proper pagination
      const totalItems = filteredData.length;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;

      return {
        success: true,
        data: filteredData.slice(startIndex, endIndex),
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalItems / limit),
          hasNextPage: endIndex < totalItems,
          hasPrevPage: page > 1,
          totalItems: totalItems,
          limit,
        },
      };
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  },

  getProducts: async (page = 1, limit = 5, options?: { sortBy?: string; order?: 'asc' | 'desc' }) => {
    try {
      let url = `/products?page=${page}&limit=${limit}`;
      if (options?.sortBy && options?.order) {
        url += `&sortBy=${options.sortBy}&order=${options.order}`;
      }
      console.log('Fetching products:', url);
      const response = await api.get<ProductsResponse>(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  getProductById: async (id: string) => {
    try {
      console.log('Fetching product details for ID:', id);
      const response = await api.get<{
        success: boolean;
        data: ProductDetails;
      }>(`/products/${id}`);

      // Transform image URLs to full URLs if needed
      if (response.data.data.images) {
        response.data.data.images = response.data.data.images.map(img => {
          const url = img.url.startsWith('http')
            ? img.url
            : `https://backend-practice.eurisko.me/${img.url.replace(/^\/+/, '').replace(/^api\//, '')}`;
          return { url };
        });
      }

      console.log('Product details response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching product details:', error);
      throw error;
    }
  },
};
