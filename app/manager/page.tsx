'use client';

import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { Package, Truck, Banknote, ClipboardList } from 'lucide-react';
import { formatPrice } from '@/lib/currency';
import {
  DashboardMonthFilter,
  DashboardEarningsNote,
  DashboardLoading,
  useDashboardStats,
} from '@/components/DashboardMonthFilter';

export default function ManagerDashboard() {
  const { stats, loading, month, year, setPeriod } = useDashboardStats();

  const statCards = [
    {
      title: `Revenue (${stats.monthLabel})`,
      value: formatPrice(stats.totalRevenue ?? 0),
      icon: Banknote,
      color: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      title: 'Shipped Orders',
      value: String(stats.shippedOrders ?? 0),
      icon: Truck,
      color: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Pending Orders',
      value: String(stats.pendingOrders ?? 0),
      icon: ClipboardList,
      color: 'bg-amber-50',
      iconColor: 'text-amber-600',
    },
    {
      title: 'Products',
      value: String(stats.totalProducts ?? 0),
      icon: Package,
      color: 'bg-orange-50',
      iconColor: 'text-orange-600',
    },
  ];

  if (loading) return <DashboardLoading />;

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manager Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Monthly revenue from shipped orders
          </p>
        </div>
        <DashboardMonthFilter month={month} year={year} onChange={setPeriod} />
      </div>

      <DashboardEarningsNote monthLabel={stats.monthLabel} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <Card key={stat.title} className="p-6">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
                <IconComponent className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
              <h3 className="text-sm text-muted-foreground font-medium">{stat.title}</h3>
              <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/manager/orders" className="block h-full">
          <Card className="p-6 h-full hover:shadow-lg transition cursor-pointer border-primary/20">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                <Truck className="w-6 h-6 text-primary" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-lg text-foreground">Manage Orders</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  Confirm pending orders, then press <strong>Ship</strong> to add revenue for{' '}
                  {stats.monthLabel}.
                </p>
                <p className="text-sm font-medium text-primary mt-3">
                  {stats.pendingOrders ?? 0} pending · {stats.shippedOrders ?? 0} shipped this month
                </p>
              </div>
            </div>
          </Card>
        </Link>
        <Link href="/manager/inventory" className="block h-full">
          <Card className="p-6 h-full hover:shadow-lg transition cursor-pointer">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center shrink-0">
                <Package className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-foreground">Inventory</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Update stock and product availability.
                </p>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
