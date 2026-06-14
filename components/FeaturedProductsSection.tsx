'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCarousel, type CarouselProduct } from '@/components/ProductCarousel';
import { productService } from '@/lib/services';
import { Product } from '@/lib/types';
import { resolveImageUrl } from '@/lib/image-url';
import { AnimateIn } from '@/components/AnimateIn';

export function FeaturedProductsSection() {
  const [products, setProducts] = useState<CarouselProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productService
      .getAll({ limit: '12' })
      .then((res) => {
        setProducts(
          res.products.slice(0, 12).map((p: Product) => ({
            id: p._id,
            name: p.name,
            price: p.price,
            originalPrice: p.price * 1.15,
            discount: 15,
            image: p.images?.[0] ? resolveImageUrl(p.images[0]) : '🎮',
            rating: p.ratings ?? 4.5,
            reviews: p.reviews ?? 12,
          })),
        );
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-12 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="bg-white py-16 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateIn className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Trending Toys</h2>
            <p className="text-muted-foreground mt-2">
              Swipe through our most popular picks — updated live from the store.
            </p>
          </div>
          <Link href="/user/products">
            <Button variant="outline">View All Products</Button>
          </Link>
        </AnimateIn>
        <ProductCarousel title="" products={products} />
      </div>
    </section>
  );
}
