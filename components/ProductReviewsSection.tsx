'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Star, Loader2 } from 'lucide-react';
import { reviewService, productService } from '@/lib/services';
import { Review, ReviewUser } from '@/lib/types';
import { useAuth } from '@/hooks/useAuth';
import { ReviewForm } from '@/components/ReviewForm';
import './product-reviews-section.css';

type ProductReviewsSectionProps = {
  productId: string;
  productName: string;
  initialRating?: number;
  initialReviewCount?: number;
};

function getReviewerName(userId: Review['userId']) {
  if (typeof userId === 'object' && userId !== null) {
    return (userId as ReviewUser).name || 'Customer';
  }
  return 'Customer';
}

export function ProductReviewsSection({
  productId,
  productName,
  initialRating = 0,
  initialReviewCount = 0,
}: ProductReviewsSectionProps) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [myReview, setMyReview] = useState<Review | null>(null);
  const [canReview, setCanReview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(initialRating);
  const [reviewCount, setReviewCount] = useState(initialReviewCount);

  const loadReviews = useCallback(async () => {
    setLoading(true);
    try {
      const list = await reviewService.getByProduct(productId);
      setReviews(list);
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  const loadEligibility = useCallback(async () => {
    if (!isAuthenticated) {
      setCanReview(false);
      setMyReview(null);
      return;
    }
    try {
      const [eligibility, existing] = await Promise.all([
        reviewService.checkEligible(productId),
        reviewService.getMyReview(productId),
      ]);
      setCanReview(eligibility.eligible && !eligibility.hasReview);
      setMyReview(existing);
    } catch {
      setCanReview(false);
      setMyReview(null);
    }
  }, [productId, isAuthenticated]);

  useEffect(() => {
    void loadReviews();
  }, [loadReviews]);

  useEffect(() => {
    if (!authLoading) {
      void loadEligibility();
    }
  }, [authLoading, loadEligibility]);

  const refreshProductStats = async () => {
    try {
      const product = await productService.getOne(productId);
      setRating(product.ratings ?? 0);
      setReviewCount(product.reviews ?? 0);
    } catch {
      /* keep existing stats */
    }
  };

  const handleReviewSuccess = async (review: Review) => {
    setMyReview(review);
    setCanReview(false);
    await loadReviews();
    await refreshProductStats();
  };

  const showForm = isAuthenticated && (canReview || myReview);

  return (
    <section className="product-reviews-section">
      <div className="product-reviews-section__header">
        <h2>Customer Reviews</h2>
        <div className="product-reviews-section__summary">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < Math.floor(rating)
                  ? 'fill-[#f57224] text-[#f57224]'
                  : 'text-gray-300'
              }`}
            />
          ))}
          <span>
            {rating.toFixed(1)} · {reviewCount} review{reviewCount !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {!authLoading && !isAuthenticated && (
        <p className="product-reviews-section__login-hint">
          <Link href="/login">Sign in</Link> to write a review after your order is
          delivered.
        </p>
      )}

      {showForm && (
        <div className="product-reviews-section__form-wrap">
          <ReviewForm
            productId={productId}
            productName={productName}
            existingReview={myReview}
            onSuccess={handleReviewSuccess}
          />
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : reviews.length === 0 ? (
        <p className="product-reviews-section__empty">
          No reviews yet. Be the first to share your experience!
        </p>
      ) : (
        <div className="product-reviews-section__list">
          {reviews.map((review) => (
            <article key={review._id} className="product-reviews-section__item">
              <div className="product-reviews-section__item-top">
                <span className="product-reviews-section__author">
                  {getReviewerName(review.userId)}
                </span>
                <time className="product-reviews-section__date">
                  {new Date(review.createdAt).toLocaleDateString()}
                </time>
              </div>
              <div className="product-reviews-section__stars">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < review.rating
                        ? 'fill-[#f57224] text-[#f57224]'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="product-reviews-section__comment">{review.comment}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
