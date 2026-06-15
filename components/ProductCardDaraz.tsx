'use client';

import Link from 'next/link';
import { Star } from 'lucide-react';
import { Product } from '@/lib/types';
import { resolveImageUrl } from '@/lib/image-url';
import {
  getDiscountPercent,
  getOriginalPrice,
  getSalePrice,
  hasDiscount,
} from '@/lib/product-pricing';
import { formatPrice } from '@/lib/currency';
import { WishlistHeart } from '@/components/WishlistHeart';
import './daraz-store.css';

type ProductCardDarazProps = {
  product: Product;
  variant?: 'flash' | 'grid';
};

export function ProductCardDaraz({ product, variant = 'grid' }: ProductCardDarazProps) {
  const discount = getDiscountPercent(product);
  const sale = getSalePrice(product);
  const original = getOriginalPrice(product);
  const img = product.images?.[0];
  const href = `/user/products/${product._id}`;

  const priceBlock = (
    <>
      <span className="daraz-product-card__price">{formatPrice(sale)}</span>
      {hasDiscount(product) && (
        <div className="mt-0.5">
          <span className="daraz-product-card__was">{formatPrice(original)}</span>
          <span className="daraz-product-card__off">-{discount}%</span>
        </div>
      )}
    </>
  );

  if (variant === 'flash') {
    return (
      <div className="daraz-flash__item daraz-product-card relative">
        <WishlistHeart
          productId={product._id}
          productName={product.name}
          size="sm"
        />
        <Link href={href} className="block">
          {img ? (
            <img src={resolveImageUrl(img)} alt={product.name} className="daraz-product-card__img" />
          ) : (
            <div className="daraz-product-card__img flex items-center justify-center text-4xl bg-[#fafafa]">
              🎮
            </div>
          )}
          <p className="daraz-product-card__name">{product.name}</p>
          {priceBlock}
        </Link>
      </div>
    );
  }

  return (
    <div className="daraz-grid-card__link block">
      <div className="daraz-grid-card__img-wrap">
        <WishlistHeart
          productId={product._id}
          productName={product.name}
          size="sm"
        />
        <Link href={href} className="block">
          {hasDiscount(product) && (
            <span className="daraz-grid-card__discount-tag">-{discount}%</span>
          )}
          {img ? (
            <img src={resolveImageUrl(img)} alt={product.name} className="daraz-grid-card__img" />
          ) : (
            <div className="daraz-grid-card__img flex items-center justify-center text-5xl">🎮</div>
          )}
        </Link>
      </div>
      <Link href={href} className="daraz-grid-card__body block">
        <p className="daraz-product-card__name">{product.name}</p>
        {priceBlock}
        <div className="daraz-product-card__stars mt-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${i < Math.floor(product.ratings || 0) ? 'fill-[#f57224] text-[#f57224]' : 'text-gray-300'}`}
            />
          ))}
          <span className="text-muted-foreground ml-0.5">({product.reviews || 0})</span>
        </div>
      </Link>
    </div>
  );
}
