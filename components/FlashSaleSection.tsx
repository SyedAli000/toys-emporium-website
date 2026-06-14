'use client';

import Link from 'next/link';
import { Product } from '@/lib/types';
import { ProductCardDaraz } from '@/components/ProductCardDaraz';
import './daraz-store.css';

type FlashSaleSectionProps = {
  products: Product[];
};

export function FlashSaleSection({ products }: FlashSaleSectionProps) {
  if (products.length === 0) return null;

  return (
    <section className="daraz-flash anim-fade-up">
      <div className="daraz-flash__head">
        <div className="daraz-flash__title-wrap">
          <h2 className="daraz-flash__title">Flash Sale</h2>
          <span className="daraz-flash__badge">On Sale Now</span>
        </div>
        <Link href="/user/products" className="daraz-flash__shop-all">
          SHOP ALL PRODUCTS
        </Link>
      </div>
      <div className="daraz-flash__track">
        {products.map((p) => (
          <ProductCardDaraz key={p._id} product={p} variant="flash" />
        ))}
      </div>
    </section>
  );
}
