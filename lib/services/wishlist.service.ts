import { api } from '@/lib/api';
import { Product } from '@/lib/types';

export const wishlistService = {
  get: () => api.get<{ products: Product[] }>('/wishlist'),
  add: (productId: string) =>
    api.post<{ products: Product[] }>('/wishlist', { productId }),
  remove: (productId: string) =>
    api.delete<{ products: Product[] }>(`/wishlist/${productId}`),
};
