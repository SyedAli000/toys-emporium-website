'use client';

import Link from 'next/link';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/lib/types';
import { ProductCardDaraz } from '@/components/ProductCardDaraz';
import './daraz-store.css';

type JustForYouGridProps = {
  products: Product[];
  title?: string;
  onAddToCart?: (product: Product) => void;
  actionLoading?: string | null;
};

export function JustForYouGrid({
  products,
  title = 'Just For You',
  onAddToCart,
  actionLoading,
}: JustForYouGridProps) {
  if (products.length === 0) return null;

  return (
    <section className="anim-fade-up">
      <h2 className="daraz-section-title">{title}</h2>
      <div className="daraz-grid">
        {products.map((product) => (
          <div key={product._id} className="daraz-grid-card overflow-hidden">
            <ProductCardDaraz product={product} variant="grid" />
            {onAddToCart && (
              <div className="daraz-grid-card__actions">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs"
                  onClick={() => onAddToCart(product)}
                  disabled={!!actionLoading}
                >
                  {actionLoading === `cart-${product._id}` ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <>
                      <ShoppingCart className="w-3 h-3 mr-1" />
                      Cart
                    </>
                  )}
                </Button>
                <Link href={`/user/products/${product._id}`} className="flex-1">
                  <Button size="sm" variant="default" className="w-full text-xs bg-[#f57224] hover:bg-[#e5651d]">
                    View
                  </Button>
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
