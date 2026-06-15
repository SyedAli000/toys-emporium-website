'use client';

import Link from 'next/link';
import { ShoppingCart, Menu, User, LogOut } from 'lucide-react';
import { SearchBar } from '@/components/SearchBar';
import { HeroButton } from '@/components/HeroButton';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { decodeToken } from '@/lib/auth';
import { AuthToken } from '@/lib/types';
import { PromoBanner } from '@/components/PromoBanner';
import { FeaturedProductsSection } from '@/components/FeaturedProductsSection';
import { AnimateIn } from '@/components/AnimateIn';
import { Logo } from '@/components/Logo';

export default function Page() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [user, setUser] = useState<AuthToken | null>(null);

  useEffect(() => {
    const token = Cookies.get('auth_token');
    if (token) {
      const decoded = decodeToken(token);
      setUser(decoded);
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove('auth_token');
    setUser(null);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50 to-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Logo
              href="/"
              size="md"
              imageClassName="w-24 sm:w-28 md:w-32"
            />

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/user/products" className="text-sm font-medium text-foreground hover:text-primary transition">
                Shop
              </Link>
              <Link href="/user/orders" className="text-sm font-medium text-foreground hover:text-primary transition">
                Orders
              </Link>
              <Link href="/user/wishlist" className="text-sm font-medium text-foreground hover:text-primary transition">
                Wishlist
              </Link>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              <div className="hidden sm:block">
                <SearchBar variant="nav" />
              </div>
              <Link href="/user/cart" className="p-2 hover:bg-muted rounded-lg transition relative">
                <ShoppingCart className="w-5 h-5 text-foreground" />
                <span className="absolute -top-1 -right-1 bg-accent text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center text-white">
                  0
                </span>
              </Link>

              {user ? (
                <div className="hidden md:flex items-center gap-2 relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="p-2 hover:bg-muted rounded-lg transition"
                  >
                    <User className="w-5 h-5 text-foreground" />
                  </button>
                  {isUserMenuOpen && (
                    <div className="absolute top-14 right-0 bg-white border border-border rounded-lg shadow-lg p-2 min-w-48 z-50">
                      <div className="px-3 py-2 text-sm font-medium text-foreground border-b border-border break-all">
                        {user.email}
                      </div>
                      {user.role !== 'customer' && (
                        <>
                          {user.role === 'manager' && (
                            <Link href="/manager" className="block px-3 py-2 text-sm text-foreground hover:bg-muted rounded">
                              Manager Dashboard
                            </Link>
                          )}
                          {(user.role === 'admin' || user.role === 'super_admin') && (
                            <Link href="/admin" className="block px-3 py-2 text-sm text-foreground hover:bg-muted rounded">
                              Admin Dashboard
                            </Link>
                          )}
                        </>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 text-sm text-destructive hover:bg-muted rounded flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <HeroButton href="/login" variant="nav-login">
                    Login
                  </HeroButton>
                  <HeroButton href="/register" variant="nav-signup">
                    Sign Up
                  </HeroButton>
                </div>
              )}

              <button
                className="md:hidden p-2"
                onClick={() => {
                  setIsMobileNavOpen(!isMobileNavOpen);
                  setIsUserMenuOpen(false);
                }}
                aria-label="Toggle menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>

          {isMobileNavOpen && (
            <div className="md:hidden border-t border-border pb-4 pt-2 space-y-1">
              <Link
                href="/user/products"
                className="block px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted rounded-lg"
                onClick={() => setIsMobileNavOpen(false)}
              >
                Shop
              </Link>
              <Link
                href="/user/orders"
                className="block px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted rounded-lg"
                onClick={() => setIsMobileNavOpen(false)}
              >
                Orders
              </Link>
              <Link
                href="/user/wishlist"
                className="block px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted rounded-lg"
                onClick={() => setIsMobileNavOpen(false)}
              >
                Wishlist
              </Link>

              <div className="px-4 pt-2 sm:hidden">
                <SearchBar variant="nav" />
              </div>

              {user ? (
                <div className="px-4 pt-2 space-y-1 border-t border-border mt-2">
                  <p className="text-xs text-muted-foreground py-2 break-all">{user.email}</p>
                  {user.role === 'manager' && (
                    <Link href="/manager" className="block py-2 text-sm text-foreground hover:text-primary" onClick={() => setIsMobileNavOpen(false)}>
                      Manager Dashboard
                    </Link>
                  )}
                  {(user.role === 'admin' || user.role === 'super_admin') && (
                    <Link href="/admin" className="block py-2 text-sm text-foreground hover:text-primary" onClick={() => setIsMobileNavOpen(false)}>
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left py-2 text-sm text-destructive flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 px-4 pt-3 sm:hidden">
                  <HeroButton href="/login" variant="nav-login" className="w-full justify-center">
                    Login
                  </HeroButton>
                  <HeroButton href="/register" variant="nav-signup" className="w-full justify-center">
                    Sign Up
                  </HeroButton>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <PromoBanner />
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <AnimateIn variant="fade-up">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
              Discover Amazing Toys for Every Age
            </h1>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Explore our curated collection of premium toys, games, and playsets. From classic favorites to the latest releases, find the perfect gift for everyone.
            </p>
            <SearchBar variant="hero" className="mb-8" />
            <div className="hero-btn-group">
              <HeroButton href="/user/products" variant="primary" className="w-full sm:w-auto">
                Start Shopping
              </HeroButton>
              <HeroButton href="/user/products" variant="outline" className="w-full sm:w-auto">
                View Featured
              </HeroButton>
            </div>
          </AnimateIn>

          <AnimateIn variant="slide-left" delay={150} className="relative">
            <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl h-96 flex items-center justify-center overflow-hidden shadow-xl">
              <div className="text-center relative z-10">
                <div className="text-7xl mb-4 anim-float inline-block">🎮</div>
                <div className="flex justify-center gap-4 text-4xl">
                  <span className="anim-float-delayed">🧸</span>
                  <span className="anim-pulse-soft">🚀</span>
                  <span className="anim-float">🎲</span>
                </div>
                <p className="text-muted-foreground mt-6 font-medium">Play. Learn. Imagine.</p>
              </div>
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  background:
                    'radial-gradient(circle at 30% 40%, oklch(0.85 0.12 57), transparent 50%), radial-gradient(circle at 70% 60%, oklch(0.52 0.18 193), transparent 45%)',
                }}
              />
            </div>
          </AnimateIn>
        </div>
      </section>

      <FeaturedProductsSection />

      {/* Categories Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-12">Shop by Category</h2>
          </AnimateIn>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 anim-stagger-children">
            {[
              { emoji: '🎮', name: 'Video Games' },
              { emoji: '🧩', name: 'Puzzles' },
              { emoji: '🚀', name: 'Action Figures' },
              { emoji: '🎲', name: 'Board Games' },
            ].map((cat) => (
              <Link key={cat.name} href={`/user/products?category=${cat.name.toLowerCase()}`}>
                <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-xl p-6 text-center anim-hover-lift cursor-pointer">
                  <div className="text-4xl mb-3 transition-transform duration-300 group-hover:scale-110">{cat.emoji}</div>
                  <h3 className="font-semibold text-foreground">{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 anim-stagger-children">
          {[
            { icon: '🚚', title: 'Fast Delivery', desc: 'Get your toys delivered safely and quickly' },
            { icon: '🔒', title: 'Secure Payment', desc: 'Cash on delivery for your convenience' },
            { icon: '⭐', title: 'Quality Assured', desc: 'Authentic products with customer reviews' },
          ].map((feat) => (
            <div key={feat.title} className="bg-white rounded-xl p-8 border border-border text-center anim-hover-lift">
              <div className="text-4xl mb-4">{feat.icon}</div>
              <h3 className="font-bold text-lg text-foreground mb-2">{feat.title}</h3>
              <p className="text-muted-foreground">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16 overflow-hidden relative">
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 20% 50%, white, transparent 50%), radial-gradient(ellipse at 80% 50%, oklch(0.85 0.12 57), transparent 45%)',
          }}
        />
        <AnimateIn className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Find Your Next Favorite Toy?</h2>
          <p className="mb-8 text-primary-foreground/90">
            Join thousands of happy customers exploring our endless collection.
          </p>
          <HeroButton href="/user/products" variant="secondary">
            Explore Collection
          </HeroButton>
        </AnimateIn>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <Logo href="/" size="lg" className="mb-4" />
              <p className="text-muted-foreground text-sm">Premium toy destination for joy and imagination.</p>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-4">Customer Service</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Contact Us</a></li>
                <li><a href="#" className="hover:text-primary">FAQs</a></li>
                <li><a href="#" className="hover:text-primary">Returns</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">About</a></li>
                <li><a href="#" className="hover:text-primary">Careers</a></li>
                <li><a href="#" className="hover:text-primary">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Privacy</a></li>
                <li><a href="#" className="hover:text-primary">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-muted-foreground text-sm">
            <p>&copy; 2024 Toys Emporium. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
