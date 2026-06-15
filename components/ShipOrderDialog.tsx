'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type ShipOrderDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderShortId: string;
  onConfirm: (trackingNumber?: string) => Promise<void>;
};

export function ShipOrderDialog({
  open,
  onOpenChange,
  orderShortId,
  onConfirm,
}: ShipOrderDialogProps) {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleOpenChange = (next: boolean) => {
    if (!submitting) {
      if (!next) setTrackingNumber('');
      onOpenChange(next);
    }
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      await onConfirm(trackingNumber.trim() || undefined);
      setTrackingNumber('');
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Mark order as shipped?</AlertDialogTitle>
          <AlertDialogDescription>
            Order <strong>#{orderShortId}</strong> will be marked as shipped. The
            customer will receive an email that their order is on the way.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-2 py-2">
          <Label htmlFor="ship-tracking">Tracking number (optional)</Label>
          <Input
            id="ship-tracking"
            placeholder="e.g. TCS-123456789"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            disabled={submitting}
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={submitting}>Cancel</AlertDialogCancel>
          <Button onClick={handleConfirm} disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Shipping…
              </>
            ) : (
              'Confirm & notify customer'
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
