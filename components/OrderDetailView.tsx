'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { orderService } from '@/lib/services';
import { Order, OrderStatus } from '@/lib/types';
import {
  enrichOrderItems,
  getOrderCustomerLabel,
  type EnrichedOrderItem,
} from '@/lib/enrich-order-items';
import { OrderReviewPanel } from '@/components/OrderReviewPanel';
import { formatPrice } from '@/lib/currency';
import '@/app/user/orders/orders.css';

type OrderDetailViewProps = {
  orderId: string;
  backHref: string;
  backLabel: string;
  showCustomer?: boolean;
  showStatusActions?: boolean;
};

export function OrderDetailView({
  orderId,
  backHref,
  backLabel,
  showCustomer = false,
  showStatusActions = false,
}: OrderDetailViewProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<EnrichedOrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  const load = () => {
    setLoading(true);
    setError('');
    orderService
      .getOne(orderId)
      .then(async (o) => {
        setOrder(o);
        setItems(await enrichOrderItems(o.items));
      })
      .catch(() => {
        setError('Could not load order details.');
        setOrder(null);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (orderId) load();
  }, [orderId]);

  const updateStatus = async (status: OrderStatus) => {
    if (!order) return;
    setUpdating(true);
    try {
      await orderService.updateStatus(order._id, { status });
      load();
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="order-detail-page flex justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="order-detail-page text-center py-16">
        <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-destructive mb-4">{error || 'Order not found'}</p>
        <Link href={backHref} className="text-primary font-medium hover:underline">
          {backLabel}
        </Link>
      </div>
    );
  }

  const addr = order.shippingAddress;

  return (
    <div className="order-detail-page order-detail-page--wide">
      <Link href={backHref} className="order-detail-back">
        <ArrowLeft className="w-4 h-4" />
        {backLabel}
      </Link>

      <div className="orders-page-header" style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
        <h1>Order #{order._id.slice(-8)}</h1>
        <span className="order-status-badge inline-block mt-2">{order.status}</span>
      </div>

      {showCustomer && (
        <div className="order-detail-card">
          <h2>Customer</h2>
          <p className="order-meta-value">{getOrderCustomerLabel(order.userId)}</p>
        </div>
      )}

      <div className="order-detail-card">
        <h2>Order info</h2>
        <div className="order-meta-grid">
          <div>
            <p className="order-meta-label">Date</p>
            <p className="order-meta-value">
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="order-meta-label">Payment</p>
            <p className="order-meta-value uppercase">{order.paymentMethod}</p>
          </div>
          <div>
            <p className="order-meta-label">Tracking</p>
            <p className="order-meta-value">{order.trackingNumber || 'N/A'}</p>
          </div>
          <div>
            <p className="order-meta-label">Items</p>
            <p className="order-meta-value">{order.items.length}</p>
          </div>
        </div>
        {order.notes && (
          <p className="text-sm text-muted-foreground mt-2">
            <strong>Notes:</strong> {order.notes}
          </p>
        )}
      </div>

      <div className="order-detail-card">
        <h2>Products</h2>
        <div className="order-items-list order-items-list--rich">
          {items.map((item, idx) => (
            <div key={idx} className="order-item-rich">
              <div className="order-item-rich__img">
                {item.productImage ? (
                  <img src={item.productImage} alt={item.productName} />
                ) : (
                  <span className="order-item-rich__placeholder">🎮</span>
                )}
              </div>
              <div className="order-item-rich__info">
                <p className="order-item-rich__name">{item.productName}</p>
                <p className="order-item-rich__meta">
                  {formatPrice(item.price)} each · Qty {item.quantity}
                </p>
              </div>
              <p className="order-item-rich__line-total">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>
        <div className="order-detail-total">
          <span>Total</span>
          <span>{formatPrice(order.totalAmount)}</span>
        </div>
      </div>

      {addr && (
        <div className="order-detail-card">
          <h2>Delivery address</h2>
          <div className="order-address-block">
            <p className="font-medium">{addr.fullName}</p>
            <p>{addr.address}</p>
            <p>
              {addr.city}, {addr.state} {addr.zipCode}
            </p>
            <p>{addr.country}</p>
            <p className="mt-2 text-muted-foreground">
              {addr.phone} · {addr.email}
            </p>
          </div>
        </div>
      )}

      {showStatusActions && (
        <div className="order-detail-card">
          <h2>Update status</h2>
          <div className="flex flex-wrap gap-2">
            {order.status === 'pending' && (
              <Button size="sm" disabled={updating} onClick={() => updateStatus('confirmed')}>
                Confirm
              </Button>
            )}
            {order.status === 'confirmed' && (
              <Button size="sm" disabled={updating} onClick={() => updateStatus('shipped')}>
                Mark Shipped
              </Button>
            )}
            {order.status === 'shipped' && (
              <Button size="sm" disabled={updating} onClick={() => updateStatus('delivered')}>
                Mark Delivered
              </Button>
            )}
          </div>
        </div>
      )}

      {!showStatusActions && order.status === 'delivered' && (
        <div className="order-detail-card">
          <h2>Rate your products</h2>
          <OrderReviewPanel items={items} />
        </div>
      )}
    </div>
  );
}
