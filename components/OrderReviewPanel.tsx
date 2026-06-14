'use client';

import { useCallback, useEffect, useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { reviewService } from '@/lib/services';
import { Review } from '@/lib/types';
import { EnrichedOrderItem } from '@/lib/enrich-order-items';
import { ReviewForm } from '@/components/ReviewForm';
import './order-review-panel.css';

type OrderReviewPanelProps = {
  items: EnrichedOrderItem[];
};

export function OrderReviewPanel({ items }: OrderReviewPanelProps) {
  const [reviewsByProduct, setReviewsByProduct] = useState<
    Record<string, Review | null>
  >({});
  const [eligibleByProduct, setEligibleByProduct] = useState<
    Record<string, boolean>
  >({});
  const [loading, setLoading] = useState(true);

  const loadReviewState = useCallback(async () => {
    setLoading(true);
    const reviewMap: Record<string, Review | null> = {};
    const eligibleMap: Record<string, boolean> = {};

    await Promise.all(
      items.map(async (item) => {
        const productId = item.productId;
        try {
          const [eligibility, existing] = await Promise.all([
            reviewService.checkEligible(productId),
            reviewService.getMyReview(productId),
          ]);
          reviewMap[productId] = existing;
          eligibleMap[productId] = eligibility.eligible && !eligibility.hasReview;
        } catch {
          reviewMap[productId] = null;
          eligibleMap[productId] = false;
        }
      }),
    );

    setReviewsByProduct(reviewMap);
    setEligibleByProduct(eligibleMap);
    setLoading(false);
  }, [items]);

  useEffect(() => {
    void loadReviewState();
  }, [loadReviewState]);

  const handleSuccess = (productId: string, review: Review) => {
    setReviewsByProduct((prev) => ({ ...prev, [productId]: review }));
    setEligibleByProduct((prev) => ({ ...prev, [productId]: false }));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-6">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const hasAnyAction = items.some(
    (item) => eligibleByProduct[item.productId] || reviewsByProduct[item.productId],
  );

  if (!hasAnyAction) {
    return null;
  }

  return (
    <div className="order-review-panel">
      <p className="order-review-panel__intro">
        Your order has been delivered. Share your experience with the products below.
      </p>
      <div className="order-review-panel__items">
        {items.map((item) => {
          const productId = item.productId;
          const existing = reviewsByProduct[productId];
          const canReview = eligibleByProduct[productId];
          const showForm = canReview || existing;

          if (!showForm) return null;

          return (
            <div key={productId} className="order-review-panel__item">
              <div className="order-review-panel__item-header">
                <div className="order-review-panel__item-img">
                  {item.productImage ? (
                    <img src={item.productImage} alt={item.productName} />
                  ) : (
                    <span className="flex items-center justify-center h-full text-xl">
                      🎮
                    </span>
                  )}
                </div>
                <div>
                  <p className="order-review-panel__item-name">{item.productName}</p>
                  {existing && !canReview && (
                    <span className="order-review-panel__done">
                      <CheckCircle2 className="w-4 h-4" />
                      Review submitted
                    </span>
                  )}
                </div>
              </div>
              <ReviewForm
                productId={productId}
                productName={item.productName}
                existingReview={existing}
                compact
                onSuccess={(review) => handleSuccess(productId, review)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
