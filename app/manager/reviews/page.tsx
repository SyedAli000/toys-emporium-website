'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Star, Loader2, MessageSquare } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { reviewService } from '@/lib/services';
import { Review, ReviewProduct, ReviewUser } from '@/lib/types';
import { resolveImageUrl } from '@/lib/image-url';
import { AppSelect } from '@/components/AppSelect';
import './manager-reviews.css';

const RATING_FILTER_OPTIONS = [
  { value: 'all', label: 'All ratings' },
  { value: '5', label: '5 stars' },
  { value: '4', label: '4 stars' },
  { value: '3', label: '3 stars' },
  { value: '2', label: '2 stars' },
  { value: '1', label: '1 star' },
];

function getProductInfo(productId: Review['productId']) {
  if (typeof productId === 'object' && productId !== null) {
    const product = productId as ReviewProduct;
    return {
      id: product._id,
      name: product.name,
      image: product.images?.[0] ? resolveImageUrl(product.images[0]) : undefined,
    };
  }
  return { id: String(productId), name: 'Product', image: undefined };
}

function getCustomerInfo(userId: Review['userId']) {
  if (typeof userId === 'object' && userId !== null) {
    const user = userId as ReviewUser & { email?: string };
    return { name: user.name || 'Customer', email: user.email };
  }
  return { name: 'Customer', email: undefined };
}

export default function ManagerReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [ratingFilter, setRatingFilter] = useState('all');

  const load = async () => {
    setLoading(true);
    try {
      const data = await reviewService.getAllAdmin(
        ratingFilter !== 'all' ? { rating: ratingFilter } : undefined,
      );
      setReviews(data);
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [ratingFilter]);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="manager-reviews-page">
      <div className="manager-reviews-page__header">
        <h1>Customer Reviews</h1>
        <p>See all product reviews submitted by customers after delivery</p>
      </div>

      <AppSelect
        value={ratingFilter}
        onValueChange={setRatingFilter}
        options={RATING_FILTER_OPTIONS}
        triggerClassName="manager-reviews-filter"
      />

      {reviews.length === 0 ? (
        <Card className="p-12 text-center">
          <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-foreground mb-2">No Reviews Yet</h2>
          <p className="text-muted-foreground">
            Reviews will appear here when customers rate delivered products.
          </p>
        </Card>
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full manager-reviews-table">
            <thead className="border-b border-border">
              <tr>
                <th className="text-left p-4 font-semibold">Product</th>
                <th className="text-left p-4 font-semibold">Customer</th>
                <th className="text-left p-4 font-semibold">Rating</th>
                <th className="text-left p-4 font-semibold">Review</th>
                <th className="text-left p-4 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => {
                const product = getProductInfo(review.productId);
                const customer = getCustomerInfo(review.userId);

                return (
                  <tr key={review._id} className="border-b border-border hover:bg-muted/30">
                    <td className="p-4">
                      <div className="manager-reviews-product">
                        <div className="manager-reviews-product__img">
                          {product.image ? (
                            <img src={product.image} alt={product.name} />
                          ) : (
                            <span className="flex items-center justify-center h-full text-lg">
                              🎮
                            </span>
                          )}
                        </div>
                        <Link
                          href={`/user/products/${product.id}`}
                          className="manager-reviews-product__name hover:text-primary hover:underline"
                        >
                          {product.name}
                        </Link>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="manager-reviews-customer">{customer.name}</p>
                      {customer.email && (
                        <p className="manager-reviews-customer__email">{customer.email}</p>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="manager-reviews-stars">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? 'fill-[#f57224] text-[#f57224]'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium">{review.rating}/5</span>
                    </td>
                    <td className="p-4">
                      <p className="manager-reviews-comment">{review.comment}</p>
                    </td>
                    <td className="p-4 manager-reviews-date">
                      {new Date(review.createdAt).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
