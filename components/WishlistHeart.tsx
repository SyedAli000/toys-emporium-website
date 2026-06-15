'use client';

import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { Heart, Loader2 } from 'lucide-react';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAppPopup } from '@/contexts/AppPopupContext';
import './wishlist-heart.css';

type WishlistHeartProps = {
  productId: string;
  productName?: string;
  size?: 'sm' | 'md';
  className?: string;
  inline?: boolean;
};

export function WishlistHeart({
  productId,
  productName,
  size = 'md',
  className = '',
  inline = false,
}: WishlistHeartProps) {
  const router = useRouter();
  const popup = useAppPopup();
  const { isInWishlist, toggleWishlist, loadingId } = useWishlist();
  const active = isInWishlist(productId);
  const loading = loadingId === productId;

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!Cookies.get('auth_token')) {
      router.push('/login');
      return;
    }

    try {
      const added = await toggleWishlist(productId);
      if (added) {
        popup.success(
          productName
            ? `"${productName}" added to your wishlist.`
            : 'Added to your wishlist.',
        );
      }
    } catch {
      popup.error('Could not update wishlist. Please try again.');
    }
  };

  return (
    <button
      type="button"
      className={`wishlist-heart wishlist-heart--${size} ${
        active ? 'wishlist-heart--active' : ''
      } ${inline ? 'wishlist-heart--inline' : ''} ${className}`.trim()}
      onClick={handleClick}
      disabled={loading}
      aria-label={active ? 'Remove from wishlist' : 'Add to wishlist'}
      aria-pressed={active}
    >
      {loading ? (
        <Loader2 className="animate-spin" />
      ) : (
        <Heart className={active ? 'fill-current' : ''} />
      )}
    </button>
  );
}
