'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X, Home, ShoppingCart, Heart, Package, User, LogOut } from 'lucide-react';
import { CartProvider, useCart } from '@/contexts/CartContext';
import { AddToCartPopup } from '@/components/AddToCartPopup';
import { SearchBar } from '@/components/SearchBar';

function UserLayoutInner({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, user, logout, canAccessManager } = useAuth();
  const { cartCount, refreshCart } = useCart();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (user?.role !== 'customer') {
      router.push(canAccessManager ? '/manager' : '/login');
    }
  }, [isAuthenticated, isLoading, user, canAccessManager, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'customer') {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">TE</span>
              </div>
              <span className="font-bold text-lg text-foreground hidden sm:inline">Toys Emporium</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/user/dashboard" className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition">
                <Home className="w-4 h-4" />
                Dashboard
              </Link>
              <Link href="/user/products" className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition">
                <ShoppingCart className="w-4 h-4" />
                Shop
              </Link>
              <Link href="/user/orders" className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition">
                <Package className="w-4 h-4" />
                Orders
              </Link>
              <Link href="/user/wishlist" className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition">
                <Heart className="w-4 h-4" />
                Wishlist
              </Link>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <SearchBar variant="nav" />
              <Link href="/user/cart" className="p-2 hover:bg-muted rounded-lg transition relative">
                <ShoppingCart className="w-5 h-5 text-foreground" />
                <span className="absolute -top-1 -right-1 bg-orange-500 text-xs font-bold rounded-full min-w-[1.25rem] h-5 px-1 flex items-center justify-center text-white">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              </Link>

              <div className="hidden md:flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-lg">
                  <User className="w-4 h-4 text-foreground" />
                  <span className="text-sm text-foreground">{user?.email}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                className="md:hidden p-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden pb-4 border-t border-border">
              <Link href="/user/dashboard" className="flex items-center gap-2 px-4 py-2 text-foreground hover:bg-muted rounded">
                <Home className="w-4 h-4" />
                Dashboard
              </Link>
              <Link href="/user/products" className="flex items-center gap-2 px-4 py-2 text-foreground hover:bg-muted rounded">
                <ShoppingCart className="w-4 h-4" />
                Shop
              </Link>
              <Link href="/user/orders" className="flex items-center gap-2 px-4 py-2 text-foreground hover:bg-muted rounded">
                <Package className="w-4 h-4" />
                Orders
              </Link>
              <Link href="/user/wishlist" className="flex items-center gap-2 px-4 py-2 text-foreground hover:bg-muted rounded">
                <Heart className="w-4 h-4" />
                Wishlist
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="w-full justify-start text-destructive hover:bg-destructive/10 mt-2"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center">
        <div className="w-full">{children}</div>
      </main>
      <AddToCartPopup />
    </div>
  );
}

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <UserLayoutInner>{children}</UserLayoutInner>
    </CartProvider>
  );
}
