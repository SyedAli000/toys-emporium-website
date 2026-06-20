import { api } from '@/lib/api';

export const analyticsService = {
  dashboard: (params?: { month?: number; year?: number }) => {
    const qs = new URLSearchParams();
    if (params?.month) qs.set('month', String(params.month));
    if (params?.year) qs.set('year', String(params.year));
    const query = qs.toString();
    return api.get<{
      totalRevenue: number;
      shippedOrders?: number;
      confirmedOrders?: number;
      totalOrders: number;
      pendingOrders?: number;
      totalProducts: number;
      month: number;
      year: number;
      monthLabel: string;
      revenueChange: string;
      ordersChange: string;
      usersChange: string;
      productsChange: string;
    }>(`/analytics/dashboard${query ? `?${query}` : ''}`);
  },
  sales: (days?: number) =>
    api.get<{ days: number; data: unknown[] }>(
      `/analytics/sales${days ? `?days=${days}` : ''}`,
    ),
  products: () => api.get<{ lowStock: unknown[]; topSellers: unknown[] }>('/analytics/products'),
  customers: () =>
    api.get<{ newSignups: number; activeCustomers: number }>('/analytics/customers'),
};
