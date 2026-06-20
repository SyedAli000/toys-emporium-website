'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { analyticsService } from '@/lib/services';

type DashboardMonthFilterProps = {
  month: number;
  year: number;
  onChange: (month: number, year: number) => void;
};

function monthLabel(month: number, year: number) {
  return new Date(year, month - 1, 1).toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

export function DashboardMonthFilter({
  month,
  year,
  onChange,
}: DashboardMonthFilterProps) {
  const value = `${year}-${String(month).padStart(2, '0')}`;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
      <label htmlFor="dashboard-month" className="text-sm font-medium text-muted-foreground">
        Filter by month
      </label>
      <input
        id="dashboard-month"
        type="month"
        value={value}
        onChange={(e) => {
          const [y, m] = e.target.value.split('-').map(Number);
          if (y && m) onChange(m, y);
        }}
        className="border border-border rounded-lg px-3 py-2 text-sm bg-background"
      />
    </div>
  );
}

export function useDashboardStats() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [stats, setStats] = useState({
    totalRevenue: 0,
    shippedOrders: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalProducts: 0,
    monthLabel: monthLabel(now.getMonth() + 1, now.getFullYear()),
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    analyticsService
      .dashboard({ month, year })
      .then((d) => {
        const shipped = d.shippedOrders ?? d.confirmedOrders ?? 0;
        const hasShipMetrics = typeof d.shippedOrders === 'number';
        setStats({
          totalRevenue: hasShipMetrics ? (d.totalRevenue ?? 0) : 0,
          shippedOrders: shipped,
          totalOrders: d.totalOrders ?? 0,
          pendingOrders: d.pendingOrders ?? 0,
          totalProducts: d.totalProducts ?? 0,
          monthLabel: d.monthLabel || monthLabel(month, year),
        });
      })
      .catch(() =>
        setStats({
          totalRevenue: 0,
          shippedOrders: 0,
          totalOrders: 0,
          pendingOrders: 0,
          totalProducts: 0,
          monthLabel: monthLabel(month, year),
        }),
      )
      .finally(() => setLoading(false));
  }, [month, year]);

  return {
    stats,
    loading,
    month,
    year,
    setPeriod: (m: number, y: number) => {
      setMonth(m);
      setYear(y);
    },
  };
}

export function DashboardLoading() {
  return (
    <div className="flex justify-center py-24">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );
}

export function DashboardEarningsNote({ monthLabel }: { monthLabel: string }) {
  return (
    <Card className="p-4 bg-green-50 border-green-100">
      <p className="text-sm text-green-800">
        Revenue is added only when a manager presses <strong>Ship</strong> in{' '}
        <strong>{monthLabel || 'this month'}</strong>. New orders do not count until shipped.
      </p>
    </Card>
  );
}
