import { api } from '@/lib/api';

export const analyticsService = {
  dashboard: () =>
    api.get<{
      totalRevenue: number;
      totalOrders: number;
      totalUsers: number;
      totalProducts: number;
      revenueChange: string;
      ordersChange: string;
      usersChange: string;
      productsChange: string;
    }>('/analytics/dashboard'),
  sales: (days?: number) =>
    api.get<{ days: number; data: unknown[] }>(
      `/analytics/sales${days ? `?days=${days}` : ''}`,
    ),
  products: () => api.get<{ lowStock: unknown[]; topSellers: unknown[] }>('/analytics/products'),
  customers: () =>
    api.get<{ newSignups: number; activeCustomers: number }>('/analytics/customers'),
};
