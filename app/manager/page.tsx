'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Package, Truck, DollarSign, Users, Loader2 } from 'lucide-react';
import { analyticsService } from '@/lib/services';

export default function ManagerDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalProducts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsService
      .dashboard()
      .then((d) =>
        setStats({
          totalOrders: d.totalOrders,
          totalRevenue: d.totalRevenue,
          totalUsers: d.totalUsers,
          totalProducts: d.totalProducts,
        }),
      )
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { title: 'Total Orders', value: String(stats.totalOrders), icon: Package, color: 'bg-blue-50', iconColor: 'text-blue-600' },
    { title: 'Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'bg-green-50', iconColor: 'text-green-600' },
    { title: 'Customers', value: String(stats.totalUsers), icon: Users, color: 'bg-purple-50', iconColor: 'text-purple-600' },
    { title: 'Products', value: String(stats.totalProducts), icon: Truck, color: 'bg-orange-50', iconColor: 'text-orange-600' },
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
        <h1 className="text-3xl font-bold text-foreground">Manager Dashboard</h1>
        <p className="text-muted-foreground mt-2">Overview of orders and inventory</p>
      </div>

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/manager/orders">
          <Card className="p-6 hover:shadow-lg transition cursor-pointer">
            <Package className="w-8 h-8 text-primary mb-4" />
            <h3 className="font-semibold">Manage Orders</h3>
          </Card>
        </Link>
        <Link href="/manager/inventory">
          <Card className="p-6 hover:shadow-lg transition cursor-pointer">
            <Truck className="w-8 h-8 text-primary mb-4" />
            <h3 className="font-semibold">Inventory</h3>
          </Card>
        </Link>
        <Link href="/manager/customers">
          <Card className="p-6 hover:shadow-lg transition cursor-pointer">
            <Users className="w-8 h-8 text-primary mb-4" />
            <h3 className="font-semibold">Customers</h3>
          </Card>
        </Link>
      </div>
    </div>
  );
}
