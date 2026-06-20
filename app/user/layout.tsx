'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ShoppingCart, LogIn } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { AddToCartPopup } from '@/components/AddToCartPopup';
import { SearchBar } from '@/components/SearchBar';
import { Logo } from '@/components/Logo';

function ShopLayoutInner({ children }: { children: React.ReactNode }) {
  const { cartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo href="/" size="md" imageClassName="w-24 sm:w-28 md:w-32" />

            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/user/products"
                className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition"
              >
                <ShoppingCart className="w-4 h-4" />
                Shop
              </Link>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              <div className="hidden sm:block">
                <SearchBar variant="nav" />
              </div>
              <Link
                href="/user/cart"
                className="p-2 hover:bg-muted rounded-lg transition relative"
              >
                <ShoppingCart className="w-5 h-5 text-foreground" />
                <span className="absolute -top-1 -right-1 bg-orange-500 text-xs font-bold rounded-full min-w-[1.25rem] h-5 px-1 flex items-center justify-center text-white">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              </Link>

              <Link
                href="/login"
                className="hidden sm:inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground border border-border rounded-lg hover:bg-muted transition"
              >
                <LogIn className="w-4 h-4" />
                Staff Login
              </Link>

              <button
                className="md:hidden p-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {isMenuOpen && (
            <div className="md:hidden pb-4 border-t border-border max-h-[calc(100vh-4rem)] overflow-y-auto">
              <div className="px-4 pt-3 sm:hidden">
                <SearchBar variant="nav" />
              </div>
              <Link
                href="/user/products"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-foreground hover:bg-muted rounded"
              >
                <ShoppingCart className="w-4 h-4" />
                Shop
              </Link>
              <Link
                href="/user/cart"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-foreground hover:bg-muted rounded"
              >
                <ShoppingCart className="w-4 h-4" />
                Cart ({cartCount})
              </Link>
              <Link
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-foreground hover:bg-muted rounded"
              >
                <LogIn className="w-4 h-4" />
                Staff Login
              </Link>
            </div>
          )}
        </div>
      </nav>

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center">
        <div className="w-full">{children}</div>
      </main>
      <AddToCartPopup />
    </div>
  );
}

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return <ShopLayoutInner>{children}</ShopLayoutInner>;
}
