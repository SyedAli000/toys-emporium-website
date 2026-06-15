'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X, BarChart3, Package, Users, Tag, ImageIcon, Settings, LogOut, Shield } from 'lucide-react';
import { Logo } from '@/components/Logo';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, canAccessAdmin, logout } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !canAccessAdmin)) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, canAccessAdmin, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !canAccessAdmin) {
    return null;
  }

  const navItems = [
    { icon: BarChart3, label: 'Dashboard', href: '/admin' },
    { icon: Users, label: 'Users', href: '/admin/users' },
    { icon: Package, label: 'Products', href: '/admin/products' },
    { icon: Tag, label: 'Categories', href: '/admin/categories' },
    { icon: ImageIcon, label: 'Banners', href: '/admin/banners' },
    { icon: Shield, label: 'Roles & Permissions', href: '/admin/roles' },
    { icon: Settings, label: 'Settings', href: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-sidebar border-r border-sidebar-border">
        {/* Logo */}
        <Link href="/admin" className="flex flex-col items-start gap-1 p-6 border-b border-sidebar-border">
          <Logo href="/admin" size="md" asLink={false} />
          <p className="text-xs text-muted-foreground pl-1">Admin Panel</p>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition">
                  <IconComponent className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-sidebar-border">
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:bg-destructive/10"
            onClick={logout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden w-full fixed top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between p-4">
          <Logo href="/admin" size="sm" subtitle="Admin" />
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="bg-white border-t border-border p-4 space-y-2 max-h-[calc(100vh-4rem)] overflow-y-auto">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-muted transition">
                    <IconComponent className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                </Link>
              );
            })}
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:bg-destructive/10 mt-4"
              onClick={logout}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </Button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto mt-16 md:mt-0 w-full min-w-0">
        <div className="page-container py-4 sm:py-6 lg:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
