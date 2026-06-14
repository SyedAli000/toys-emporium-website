'use client';

import { useParams } from 'next/navigation';
import { OrderDetailView } from '@/components/OrderDetailView';

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = typeof params.id === 'string' ? params.id : '';

  return (
    <OrderDetailView
      orderId={orderId}
      backHref="/user/orders"
      backLabel="Back to My Orders"
    />
  );
}
