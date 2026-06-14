import { api } from '@/lib/api';
import { Product } from '@/lib/types';

export const productService = {
  getAll: (params?: Record<string, string>) => {
    const qs = params
      ? '?' + new URLSearchParams(params).toString()
      : '';
    return api.get<{ products: Product[]; total: number; page: number; limit: number }>(
      `/products${qs}`,
    );
  },
  search: (q: string) =>
    api.get<{ products: Product[] }>(`/products/search?q=${encodeURIComponent(q)}`),
  getOne: (id: string) => api.get<Product>(`/products/${id}`),
  create: (data: Partial<Product>) => api.post<Product>('/products', data),
  update: (id: string, data: Partial<Product>) =>
    api.put<Product>(`/products/${id}`, data),
  remove: (id: string) => api.delete<{ message: string }>(`/products/${id}`),
};
