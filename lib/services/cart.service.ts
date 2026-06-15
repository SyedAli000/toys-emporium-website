import { api } from '@/lib/api';

export interface CartItemResponse {
  _id?: string;
  productId: string;
  quantity: number;
  price: number;
  product?: {
    _id: string;
    name: string;
    images: string[];
    price: number;
    originalPrice?: number;
    discountPercentage?: number;
  };
}

export const cartService = {
  get: () => api.get<{ items: CartItemResponse[] }>('/cart'),
  add: (productId: string, quantity = 1) =>
    api.post<{ items: CartItemResponse[] }>('/cart', { productId, quantity }),
  update: (itemId: string, quantity: number) =>
    api.put<{ items: CartItemResponse[] }>(`/cart/${itemId}`, { quantity }),
  remove: (itemId: string) =>
    api.delete<{ items: CartItemResponse[] }>(`/cart/${itemId}`),
};
