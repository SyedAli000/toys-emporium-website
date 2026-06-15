'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ShoppingCart, Heart, Package, Truck, Clock, CheckCircle, Loader2 } from 'lucide-react';
import { productService, orderService, wishlistService } from '@/lib/services';
import { Product, Order } from '@/lib/types';
import { splitProductsForStore } from '@/lib/product-pricing';
import { formatPrice } from '@/lib/currency';
import { PromoBanner } from '@/components/PromoBanner';
import { FlashSaleSection } from '@/components/FlashSaleSection';
import { JustForYouGrid } from '@/components/JustForYouGrid';
import { AnimateIn } from '@/components/AnimateIn';

export default function DashboardPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [flashSale, setFlashSale] = useState<Product[]>([]);
  const [regular, setRegular] = useState<Product[]>([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      orderService.getMine().catch(() => []),
      productService.getAll({ limit: '50' }).catch(() => ({ products: [] })),
      wishlistService.get().catch(() => ({ products: [] })),
    ]).then(([ordersRes, productsRes, wishRes]) => {
      setOrders(ordersRes);
      setWishlistCount(wishRes.products?.length || 0);
      const { flashSale: flash, regular: rest } = splitProductsForStore(
        productsRes.products || [],
      );
      setFlashSale(flash);
      setRegular(rest);
    }).finally(() => setLoading(false));
  }, []);

  const pending = orders.filter((o) => o.status === 'pending').length;
  const completed = orders.filter((o) => o.status === 'delivered').length;

  const stats = [
    { title: 'Total Orders', value: String(orders.length), icon: ShoppingCart, color: 'bg-blue-50', iconColor: 'text-blue-600' },
    { title: 'Pending Orders', value: String(pending), icon: Clock, color: 'bg-yellow-50', iconColor: 'text-yellow-600' },
    { title: 'Wishlist Items', value: String(wishlistCount), icon: Heart, color: 'bg-red-50', iconColor: 'text-red-600' },
    { title: 'Completed Orders', value: String(completed), icon: CheckCircle, color: 'bg-green-50', iconColor: 'text-green-600' },
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
      <PromoBanner />

      <FlashSaleSection products={flashSale} />

      <AnimateIn className="bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl p-6 sm:p-8 shadow-lg">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 break-words">
          Welcome back, {user?.email}!
        </h1>
        <p className="opacity-90">Manage your orders, wishlist, and account settings from here.</p>
      </AnimateIn>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 anim-stagger-children">
        {stats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <Card key={stat.title} className="p-6 anim-hover-lift">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
                <IconComponent className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
              <h3 className="text-sm text-muted-foreground font-medium">{stat.title}</h3>
              <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
            </Card>
          );
        })}
      </div>

      <JustForYouGrid products={regular} title="Just For You" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/user/products">
          <Card className="p-6 hover:shadow-lg transition cursor-pointer h-full">
            <ShoppingCart className="w-8 h-8 text-primary mb-4" />
            <h3 className="font-semibold text-foreground mb-2">Continue Shopping</h3>
          </Card>
        </Link>
        <Link href="/user/orders">
          <Card className="p-6 hover:shadow-lg transition cursor-pointer h-full">
            <Package className="w-8 h-8 text-primary mb-4" />
            <h3 className="font-semibold text-foreground mb-2">View Orders</h3>
          </Card>
        </Link>
        <Link href="/user/wishlist">
          <Card className="p-6 hover:shadow-lg transition cursor-pointer h-full">
            <Heart className="w-8 h-8 text-primary mb-4" />
            <h3 className="font-semibold text-foreground mb-2">My Wishlist</h3>
          </Card>
        </Link>
      </div>

      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
          <h2 className="text-2xl font-bold text-foreground">Recent Orders</h2>
          <Link href="/user/orders">
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        </div>
        {orders.length === 0 ? (
          <Card className="p-8 text-center">
            <Truck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No orders yet.</p>
            <Link href="/user/products" className="inline-block mt-4">
              <Button>Start Shopping</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-3">
            {orders.slice(0, 3).map((o) => (
              <Card key={o._id} className="p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <span className="break-all">#{o._id.slice(-8)} — {formatPrice(o.totalAmount)}</span>
                <span className="capitalize text-sm text-muted-foreground">{o.status}</span>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
