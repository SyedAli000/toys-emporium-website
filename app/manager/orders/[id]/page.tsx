'use client';

import { useParams } from 'next/navigation';
import { OrderDetailView } from '@/components/OrderDetailView';

export default function ManagerOrderDetailPage() {
  const params = useParams();
  const orderId = typeof params.id === 'string' ? params.id : '';

  return (
    <OrderDetailView
      orderId={orderId}
      backHref="/manager/orders"
      backLabel="Back to Order Management"
      showCustomer
      showStatusActions
    />
  );
}
