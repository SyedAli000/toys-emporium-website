'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { cartService } from '@/lib/services';

interface CartContextValue {
  cartCount: number;
  refreshCart: () => Promise<void>;
  popupOpen: boolean;
  popupProductName: string;
  showAddToCartPopup: (productName: string) => void;
  closePopup: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartCount, setCartCount] = useState(0);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupProductName, setPopupProductName] = useState('');

  const refreshCart = useCallback(async () => {
    try {
      const res = await cartService.get();
      const total =
        res.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
      setCartCount(total);
    } catch {
      setCartCount(0);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const showAddToCartPopup = (productName: string) => {
    setPopupProductName(productName);
    setPopupOpen(true);
  };

  const closePopup = () => setPopupOpen(false);

  return (
    <CartContext.Provider
      value={{
        cartCount,
        refreshCart,
        popupOpen,
        popupProductName,
        showAddToCartPopup,
        closePopup,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider');
  }
  return ctx;
}
