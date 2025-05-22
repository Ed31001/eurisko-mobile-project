import { api } from '../api/axios';

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
};
