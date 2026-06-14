'use client';

import Link from 'next/link';
import { CheckCircle, ShoppingCart, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import './add-to-cart-popup.css';

export function AddToCartPopup() {
  const { popupOpen, popupProductName, closePopup, cartCount } = useCart();

  if (!popupOpen) return null;

  return (
    <div className="add-cart-overlay" onClick={closePopup} role="presentation">
      <div
        className="add-cart-popup"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="add-cart-title"
      >
        <button
          type="button"
          className="add-cart-close"
          onClick={closePopup}
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="add-cart-icon-wrap">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>

        <h2 id="add-cart-title" className="add-cart-title">
          Added to Cart!
        </h2>
        <p className="add-cart-message">
          <strong>{popupProductName}</strong> has been added to your cart.
        </p>
        <p className="add-cart-count">
          Cart total: <strong>{cartCount}</strong> item{cartCount !== 1 ? 's' : ''}
        </p>

        <div className="add-cart-actions">
          <Link href="/user/cart" onClick={closePopup}>
            <Button className="w-full">
              <ShoppingCart className="w-4 h-4 mr-2" />
              View Cart
            </Button>
          </Link>
          <Button variant="outline" className="w-full" onClick={closePopup}>
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
}
