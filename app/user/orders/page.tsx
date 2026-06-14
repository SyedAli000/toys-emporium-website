'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Package, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import { orderService } from '@/lib/services';
import { Order } from '@/lib/types';
import './orders.css';

function OrdersContent() {
  const searchParams = useSearchParams();
  const showSuccess = searchParams.get('placed') === '1';
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService
      .getMine()
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="orders-page flex justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const successBanner = showSuccess && (
    <div className="order-card mb-4 bg-green-50 border-green-200 flex items-center gap-3 p-4">
      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
      <p className="text-green-800 font-medium text-sm">
        Order placed successfully! Cash on Delivery — pay when you receive your package.
      </p>
    </div>
  );

  if (orders.length === 0) {
    return (
      <div className="orders-page">
        <div className="orders-page-header">
          <h1>My Orders</h1>
        </div>
        {successBanner}
        {!showSuccess && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Package className="w-16 h-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">No orders yet</h2>
            <Link href="/user/products">
              <Button size="lg">Start Shopping</Button>
            </Link>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-page-header">
        <h1>My Orders</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {orders.length} {orders.length === 1 ? 'order' : 'orders'}
        </p>
      </div>
      {successBanner}
      <div className="orders-list">
        {orders.map((order) => (
          <article key={order._id} className="order-card">
            <div className="order-card-top">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="order-card-id">Order #{order._id.slice(-8)}</span>
                <span className="order-status-badge">{order.status}</span>
              </div>
            </div>
            <div className="order-meta-grid">
              <div>
                <p className="order-meta-label">Date</p>
                <p className="order-meta-value">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="order-meta-label">Total</p>
                <p className="order-meta-value">${order.totalAmount.toFixed(2)}</p>
              </div>
              <div>
                <p className="order-meta-label">Items</p>
                <p className="order-meta-value">{order.items.length}</p>
              </div>
              <div>
                <p className="order-meta-label">Tracking</p>
                <p className="order-meta-value">{order.trackingNumber || 'N/A'}</p>
              </div>
            </div>
            <Link href={`/user/orders/${order._id}`} className="block">
              <Button variant="outline" className="w-full sm:w-auto">
                View Details
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="orders-page flex justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <OrdersContent />
    </Suspense>
  );
}
