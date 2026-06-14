'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Package, Loader2, Eye } from 'lucide-react';
import { orderService } from '@/lib/services';
import { Order } from '@/lib/types';
import { getOrderCustomerLabel } from '@/lib/enrich-order-items';
import { AppSelect, ORDER_STATUS_OPTIONS } from '@/components/AppSelect';

export default function ManagerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  const load = async () => {
    setLoading(true);
    try {
      const data = await orderService.getAllAdmin(
        statusFilter !== 'all' ? { status: statusFilter } : undefined,
      );
      setOrders(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [statusFilter]);

  const updateStatus = async (id: string, status: string) => {
    await orderService.updateStatus(id, { status });
    load();
  };

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
        <h1 className="text-3xl font-bold text-foreground">Order Management</h1>
        <p className="text-muted-foreground mt-2">View and manage customer orders</p>
      </div>

      <AppSelect
        value={statusFilter}
        onValueChange={setStatusFilter}
        options={ORDER_STATUS_OPTIONS}
        triggerClassName="w-full max-w-xs"
      />

      {orders.length === 0 ? (
        <Card className="p-12 text-center">
          <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-foreground mb-2">No Orders</h2>
        </Card>
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border">
              <tr>
                <th className="text-left p-4 font-semibold">Order ID</th>
                <th className="text-left p-4 font-semibold">Customer</th>
                <th className="text-left p-4 font-semibold">Total</th>
                <th className="text-left p-4 font-semibold">Status</th>
                <th className="text-left p-4 font-semibold">Date</th>
                <th className="text-left p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} className="border-b border-border hover:bg-muted/30">
                  <td className="p-4 font-mono text-sm">
                    <Link
                      href={`/manager/orders/${o._id}`}
                      className="text-primary hover:underline font-semibold"
                    >
                      #{o._id.slice(-8)}
                    </Link>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {getOrderCustomerLabel(o.userId)}
                  </td>
                  <td className="p-4 font-medium">${o.totalAmount.toFixed(2)}</td>
                  <td className="p-4 capitalize">{o.status}</td>
                  <td className="p-4">{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/manager/orders/${o._id}`}>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                      </Link>
                      {o.status === 'pending' && (
                        <Button size="sm" onClick={() => updateStatus(o._id, 'confirmed')}>
                          Confirm
                        </Button>
                      )}
                      {o.status === 'confirmed' && (
                        <Button size="sm" onClick={() => updateStatus(o._id, 'shipped')}>
                          Ship
                        </Button>
                      )}
                      {o.status === 'shipped' && (
                        <Button size="sm" onClick={() => updateStatus(o._id, 'delivered')}>
                          Deliver
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
