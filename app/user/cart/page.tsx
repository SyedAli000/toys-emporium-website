'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Trash2, Loader2, ArrowRight } from 'lucide-react';
import { cartService, CartItemResponse } from '@/lib/services';
import { useCart } from '@/contexts/CartContext';
import { resolveImageUrl } from '@/lib/image-url';
import { formatPrice } from '@/lib/currency';
import './cart.css';

export default function CartPage() {
  const { refreshCart } = useCart();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItemResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCart = async () => {
    setLoading(true);
    try {
      const res = await cartService.get();
      setCartItems(res.items || []);
    } catch {
      setCartItems([]);
    } finally {
      setLoading(false);
      refreshCart();
    }
  };

  useEffect(() => {
    loadCart();
  }, [refreshCart]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleRemove = async (itemId: string) => {
    if (!itemId) return;
    await cartService.remove(itemId);
    loadCart();
  };

  if (loading) {
    return (
      <div className="cart-page flex justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-page-header">
          <h1>Shopping Cart</h1>
        </div>
        <div className="cart-empty">
          <ShoppingCart className="w-16 h-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold text-foreground mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-8">
            Add some amazing toys to your cart and come back here to checkout
          </p>
          <Link href="/user/products">
            <Button size="lg">Start Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-page-header">
        <h1>Shopping Cart</h1>
        <p>
          {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
        </p>
      </div>

      <div className="cart-layout">
        <div className="cart-items-panel">
          {cartItems.map((item) => (
            <article key={item._id || item.productId} className="cart-item-card">
              <div className="cart-item-image">
                {item.product?.images?.[0] ? (
                  <img
                    src={resolveImageUrl(item.product.images[0])}
                    alt={item.product?.name || 'Product'}
                  />
                ) : (
                  <span>🎮</span>
                )}
              </div>

              <div className="cart-item-body">
                <h3 className="cart-item-name">{item.product?.name || 'Product'}</h3>
                <p className="cart-item-meta">
                  Quantity: {item.quantity} · {formatPrice(item.price)} each
                  {item.product?.originalPrice &&
                    item.product.originalPrice > item.price && (
                      <span className="cart-item-original">
                        {' '}
                        (was {formatPrice(item.product.originalPrice)})
                      </span>
                    )}
                </p>
                <p className="cart-item-price">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => item._id && handleRemove(item._id)}
                className="cart-item-remove"
                aria-label="Remove from cart"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </article>
          ))}
        </div>

        <aside className="cart-summary-card">
          <h2 className="cart-summary-title">Order Summary</h2>
          <div className="cart-summary-row">
            <span>Subtotal ({itemCount} items)</span>
            <strong>{formatPrice(subtotal)}</strong>
          </div>
          <p className="cart-shipping-notice">
            Shipping charges are not included. We will confirm the shipping cost
            based on your city and area after you place the order.
          </p>
          <div className="cart-summary-total">
            <span>Total (excl. shipping)</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="cart-summary-actions">
            <Button
              className="w-full h-11"
              onClick={() => router.push('/user/checkout')}
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Link href="/user/products" className="w-full">
              <Button variant="outline" className="w-full h-11">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
