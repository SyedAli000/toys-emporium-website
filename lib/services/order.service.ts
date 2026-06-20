import { api } from '@/lib/api';
import { Address, Order } from '@/lib/types';

export const orderService = {
  create: (data: {
    shippingAddress: Address;
    notes?: string;
    paymentMethod?: 'cod';
  }) => api.post<Order>('/orders', data),
  createGuest: (data: {
    items: { productId: string; quantity: number }[];
    shippingAddress: Address;
    notes?: string;
    paymentMethod?: 'cod';
  }) => api.post<Order>('/orders/guest', data),
  getMine: () => api.get<Order[]>('/orders'),
  getOne: (id: string) => api.get<Order>(`/orders/${id}`),
  getAllAdmin: (params?: Record<string, string>) => {
    const qs = params
      ? '?' + new URLSearchParams(params).toString()
      : '';
    return api.get<Order[]>(`/orders/admin/all${qs}`);
  },
  updateStatus: (
    id: string,
    data: { status?: string; trackingNumber?: string },
  ) => api.put<Order>(`/orders/${id}`, data),
};
