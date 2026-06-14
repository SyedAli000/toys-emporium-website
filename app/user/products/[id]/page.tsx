'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Star,
  Loader2,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Shield,
  Truck,
  Banknote,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { productService, cartService } from '@/lib/services';
import { Product } from '@/lib/types';
import { resolveImageUrl } from '@/lib/image-url';
import {
  getDiscountPercent,
  getOriginalPrice,
  getSalePrice,
  hasDiscount,
} from '@/lib/product-pricing';
import { useCart } from '@/contexts/CartContext';
import { useAppPopup } from '@/contexts/AppPopupContext';
import { PromoBanner } from '@/components/PromoBanner';
import './product-detail.css';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageIndex, setImageIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const { refreshCart, showAddToCartPopup } = useCart();
  const popup = useAppPopup();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    productService
      .getOne(id)
      .then(setProduct)
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  const images =
    product?.images?.filter(Boolean).map((u) => resolveImageUrl(u)) ?? [];
  const displayImages = images.length > 0 ? images : [];
  const activeImage = displayImages[imageIndex] ?? null;

  const handleAddToCart = async () => {
    if (!product) return;
    setAdding(true);
    try {
      for (let i = 0; i < qty; i++) {
        await cartService.add(product._id);
      }
      await refreshCart();
      showAddToCartPopup(product.name);
    } catch {
      popup.error('Could not add to cart.');
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-24">
        <p className="text-muted-foreground mb-4">Product not found.</p>
        <Link href="/user/products">
          <Button>Back to shop</Button>
        </Link>
      </div>
    );
  }

  const discount = getDiscountPercent(product);
  const sale = getSalePrice(product);
  const original = getOriginalPrice(product);

  return (
    <div className="product-detail-page space-y-6">
      <PromoBanner />
      <Link
        href="/user/products"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back to products
      </Link>

      <div className="product-detail-layout">
        {/* Image gallery */}
        <div className="product-gallery anim-fade-in">
          <div className="product-gallery__main">
            {activeImage ? (
              <img src={activeImage} alt={product.name} />
            ) : (
              <span className="text-8xl">🎮</span>
            )}
          </div>
          {displayImages.length > 1 && (
            <div className="product-gallery__thumbs">
              {displayImages.length > 4 && (
                <button
                  type="button"
                  className="product-gallery__thumb flex items-center justify-center"
                  onClick={() => setImageIndex((i) => Math.max(0, i - 1))}
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
              {displayImages.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  className={`product-gallery__thumb ${i === imageIndex ? 'product-gallery__thumb--active' : ''}`}
                  onClick={() => setImageIndex(i)}
                >
                  <img src={src} alt="" />
                </button>
              ))}
              {displayImages.length > 4 && (
                <button
                  type="button"
                  className="product-gallery__thumb flex items-center justify-center"
                  onClick={() =>
                    setImageIndex((i) => Math.min(displayImages.length - 1, i + 1))
                  }
                  aria-label="Next image"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="product-info-panel anim-fade-up">
          <h1>{product.name}</h1>
          <div className="product-info-panel__rating">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < Math.floor(product.ratings || 0) ? 'fill-[#f57224] text-[#f57224]' : 'text-gray-300'}`}
              />
            ))}
            <span>
              {product.ratings?.toFixed(1)} ({product.reviews || 0} ratings)
            </span>
          </div>

          <div className="product-info-panel__price-block">
            <div className="product-info-panel__sale">${sale.toFixed(2)}</div>
            {hasDiscount(product) && (
              <div className="mt-1">
                <span className="product-info-panel__original">${original.toFixed(2)}</span>
                <span className="product-info-panel__discount">-{discount}%</span>
              </div>
            )}
          </div>

          <p className="product-info-panel__desc">
            {product.description || 'No description available.'}
          </p>

          <div className="product-info-panel__qty">
            <span className="text-sm font-medium">Quantity</span>
            <button
              type="button"
              className="px-3 py-1 border rounded"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
            >
              −
            </button>
            <input
              type="number"
              min={1}
              max={product.stock || 99}
              value={qty}
              onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
            />
            <button
              type="button"
              className="px-3 py-1 border rounded"
              onClick={() => setQty((q) => Math.min(product.stock || 99, q + 1))}
            >
              +
            </button>
            <span className="text-sm text-muted-foreground">{product.stock} in stock</span>
          </div>

          <div className="product-info-panel__actions">
            <Button
              className="product-info-panel__buy"
              size="lg"
              onClick={() => {
                void handleAddToCart().then(() => router.push('/user/checkout'));
              }}
              disabled={adding}
            >
              Buy Now
            </Button>
            <Button
              className="product-info-panel__cart"
              size="lg"
              onClick={handleAddToCart}
              disabled={adding}
            >
              {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add to Cart'}
            </Button>
          </div>
        </div>

        {/* Sidebar — delivery & return/warranty */}
        <aside className="product-sidebar anim-slide-left">
          <h3>Delivery</h3>
          <div className="product-sidebar__item">
            <Truck className="product-sidebar__icon" />
            <div>
              <strong className="block text-foreground">Standard Delivery</strong>
              <span>Estimated 3–5 business days</span>
            </div>
          </div>
          <div className="product-sidebar__item">
            <Banknote className="product-sidebar__icon" />
            <span>Cash on Delivery Available</span>
          </div>

          <h3 className="mt-4">Return &amp; Warranty</h3>
          {product.hasReturn ? (
            <div className="product-sidebar__item">
              <RotateCcw className="product-sidebar__icon" />
              <div>
                <strong className="block text-foreground">Return Policy</strong>
                <span>{product.returnPolicy || '14 days easy return'}</span>
              </div>
            </div>
          ) : (
            <div className="product-sidebar__item product-sidebar__item--muted">
              <RotateCcw className="product-sidebar__icon opacity-40" />
              <span>Return not available for this item</span>
            </div>
          )}
          {product.hasWarranty ? (
            <div className="product-sidebar__item">
              <Shield className="product-sidebar__icon" />
              <div>
                <strong className="block text-foreground">Warranty</strong>
                <span>{product.warrantyText || '1 Year Warranty'}</span>
              </div>
            </div>
          ) : (
            <div className="product-sidebar__item product-sidebar__item--muted">
              <Shield className="product-sidebar__icon opacity-40" />
              <span>Warranty not available</span>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
