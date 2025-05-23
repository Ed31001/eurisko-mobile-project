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
    longitude: number;
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
    longitude: number;
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
      const response = await api.get<ProductsResponse>(
        '/products?page=1&limit=100'
      );

      let filteredData = response.data.data || [];

      if (query) {
        filteredData = filteredData.filter(product =>
          product.title.toLowerCase().includes(query.toLowerCase())
        );
      }

      if (sortOrder) {
        filteredData.sort((a, b) => {
          return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
        });
      }

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
      const response = await api.get<ProductsResponse>(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getProductById: async (id: string) => {
    try {
      const response = await api.get<{
        success: boolean;
        data: ProductDetails;
      }>(`/products/${id}`);

      if (response.data.data.images) {
        response.data.data.images = response.data.data.images.map(img => {
          const url = img.url.startsWith('http')
            ? img.url
            : `https://backend-practice.eurisko.me/${img.url.replace(/^\/+/, '').replace(/^api\//, '')}`;
          return { url };
        });
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  addProduct: async (formData: FormData) => {
    try {
      const response = await api.post('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  },

  deleteProduct: async (id: string) => {
    try {
      const response = await api.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  updateProduct: async (id: string, formData: FormData) => {
    try {
      const response = await api.put(`/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },
};
