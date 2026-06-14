'use client';

import { useState } from 'react';
import { Star, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { reviewService } from '@/lib/services';
import { Review } from '@/lib/types';
import './review-form.css';

type ReviewFormProps = {
  productId: string;
  productName?: string;
  existingReview?: Review | null;
  onSuccess?: (review: Review) => void;
  compact?: boolean;
};

export function ReviewForm({
  productId,
  productName,
  existingReview,
  onSuccess,
  compact = false,
}: ReviewFormProps) {
  const [rating, setRating] = useState(existingReview?.rating ?? 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState(existingReview?.comment ?? '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const displayRating = hoverRating || rating;
  const isEditing = !!existingReview;

  const handleSubmit = async () => {
    if (rating < 1) {
      setError('Please select a star rating.');
      return;
    }
    if (!comment.trim()) {
      setError('Please write a review comment.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const result = isEditing
        ? await reviewService.update(existingReview._id, { rating, comment: comment.trim() })
        : await reviewService.create({
            productId,
            rating,
            comment: comment.trim(),
          });
      onSuccess?.(result);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string | string[] } } })
          ?.response?.data?.message;
      setError(
        Array.isArray(msg)
          ? msg.join(', ')
          : typeof msg === 'string'
            ? msg
            : 'Could not submit review.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`review-form ${compact ? 'review-form--compact' : ''}`}>
      <h3 className="review-form__title">
        {isEditing
          ? 'Update your review'
          : productName
            ? `Review ${productName}`
            : 'Write a review'}
      </h3>

      {error && <p className="review-form__error">{error}</p>}

      <div className="review-form__stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="review-form__star-btn"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            disabled={submitting}
            aria-label={`Rate ${star} stars`}
          >
            <Star
              className={`w-6 h-6 ${
                star <= displayRating
                  ? 'fill-[#f57224] text-[#f57224]'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>

      <textarea
        className="review-form__textarea"
        placeholder="Share your experience with this product..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        disabled={submitting}
        maxLength={1000}
      />

      <div className="review-form__actions">
        <Button size="sm" onClick={handleSubmit} disabled={submitting}>
          {submitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isEditing ? (
            'Update Review'
          ) : (
            'Submit Review'
          )}
        </Button>
      </div>

      <p className="review-form__hint">
        Reviews are only allowed after your order has been delivered.
      </p>
    </div>
  );
}
