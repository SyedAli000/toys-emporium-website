'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Package,
  Banknote,
  TrendingUp,
  ShoppingCart,
  ClipboardList,
} from 'lucide-react';
import { formatPrice } from '@/lib/currency';
import {
  DashboardMonthFilter,
  DashboardEarningsNote,
  DashboardLoading,
  useDashboardStats,
} from '@/components/DashboardMonthFilter';

export default function AdminDashboard() {
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
      icon: ShoppingCart,
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
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">Quick Links</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/admin/products"><Button variant="outline" className="w-full">Products</Button></Link>
            <Link href="/admin/users"><Button variant="outline" className="w-full">Users</Button></Link>
            <Link href="/admin/categories"><Button variant="outline" className="w-full">Categories</Button></Link>
            <Link href="/admin/banners"><Button variant="outline" className="w-full">Banners</Button></Link>
          </div>
        </Card>
        <Card className="p-6">
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" /> Monthly Earnings
          </h2>
          <p className="text-muted-foreground text-sm">
            {formatPrice(stats.totalRevenue ?? 0)} from {stats.shippedOrders ?? 0} shipped orders in{' '}
            {stats.monthLabel}
          </p>
          <p className="text-muted-foreground text-sm mt-2">
            All-time orders placed: {stats.totalOrders ?? 0}
          </p>
        </Card>
      </div>
    </div>
  );
}
