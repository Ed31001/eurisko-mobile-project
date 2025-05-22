import { api } from '../api/axios';

export interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  images: Array<{ url: string }>;
}

interface ProductsResponse {
  success: boolean;
  data: Product[];
  pagination: {
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
  };
}

export const productService = {
  getProducts: async (page = 1, limit = 5) => {
    try {
      const response = await api.get<ProductsResponse>(`/products?page=${page}&limit=${limit}`);
      console.log('Products API Response:', JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },
};
