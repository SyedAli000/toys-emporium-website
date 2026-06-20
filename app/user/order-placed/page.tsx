'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function OrderPlacedPage() {
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setOrderId(params.get('id') || '');
  }, []);

  return (
    <div className="max-w-lg mx-auto text-center py-12">
      <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
      <h1 className="text-2xl font-bold text-foreground mb-2">Order Placed!</h1>
      <p className="text-muted-foreground mb-6">
        Thank you for your order. We will contact you about shipping charges for your
        city and area shortly.
      </p>
      {orderId && (
        <p className="text-sm font-medium text-foreground mb-6">
          Order reference: <span className="text-primary">#{orderId.slice(-8)}</span>
        </p>
      )}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/user/products">
          <Button>
            <Package className="w-4 h-4 mr-2" />
            Continue Shopping
          </Button>
        </Link>
        <Link href="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}
