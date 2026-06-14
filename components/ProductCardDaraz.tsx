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
      <span className="daraz-product-card__price">${sale.toFixed(2)}</span>
      {hasDiscount(product) && (
        <div className="mt-0.5">
          <span className="daraz-product-card__was">${original.toFixed(2)}</span>
          <span className="daraz-product-card__off">-{discount}%</span>
        </div>
      )}
    </>
  );

  if (variant === 'flash') {
    return (
      <Link href={href} className="daraz-flash__item daraz-product-card">
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
    );
  }

  return (
    <Link href={href} className="daraz-grid-card__link block">
      <div className="daraz-grid-card__img-wrap">
        {hasDiscount(product) && (
          <span className="daraz-grid-card__discount-tag">-{discount}%</span>
        )}
        {img ? (
          <img src={resolveImageUrl(img)} alt={product.name} className="daraz-grid-card__img" />
        ) : (
          <div className="daraz-grid-card__img flex items-center justify-center text-5xl">🎮</div>
        )}
      </div>
      <div className="daraz-grid-card__body">
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
      </div>
    </Link>
  );
}
