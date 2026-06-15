'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Package,
  Users,
  Banknote,
  TrendingUp,
  ShoppingCart,
  Loader2,
} from 'lucide-react';
import { analyticsService } from '@/lib/services';
import { formatPrice } from '@/lib/currency';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    revenueChange: '+0%',
    ordersChange: '+0%',
    usersChange: '+0%',
    productsChange: '+0%',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsService
      .dashboard()
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    {
      title: 'Total Revenue',
      value: formatPrice(stats.totalRevenue),
      change: stats.revenueChange,
      icon: Banknote,
      color: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      title: 'Total Orders',
      value: String(stats.totalOrders),
      change: stats.ordersChange,
      icon: ShoppingCart,
      color: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Total Users',
      value: String(stats.totalUsers),
      change: stats.usersChange,
      icon: Users,
      color: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      title: 'Products',
      value: String(stats.totalProducts),
      change: stats.productsChange,
      icon: Package,
      color: 'bg-orange-50',
      iconColor: 'text-orange-600',
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">Complete overview of your e-commerce platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <Card key={stat.title} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <IconComponent className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                  {stat.change}
                </span>
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
            <TrendingUp className="w-5 h-5" /> Analytics
          </h2>
          <p className="text-muted-foreground text-sm">
            Revenue: {formatPrice(stats.totalRevenue)} from {stats.totalOrders} orders
          </p>
        </Card>
      </div>
    </div>
  );
}
