'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X, BarChart3, Package, Truck, Users, Settings, LogOut, Shield } from 'lucide-react';
import { ManagerNotificationBell } from '@/components/ManagerNotificationBell';

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, canAccessManager, user, logout } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !canAccessManager)) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, canAccessManager, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !canAccessManager) {
    return null;
  }

  const navItems = [
    { icon: BarChart3, label: 'Dashboard', href: '/manager' },
    { icon: Package, label: 'Inventory', href: '/manager/inventory' },
    { icon: Truck, label: 'Orders', href: '/manager/orders' },
    { icon: Users, label: 'Customers', href: '/manager/customers' },
    { icon: Settings, label: 'Settings', href: '/manager/settings' },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-sidebar border-r border-sidebar-border">
        {/* Logo */}
        <Link href="/manager" className="flex items-center gap-3 p-6 border-b border-sidebar-border">
          <div className="w-10 h-10 bg-sidebar-primary rounded-lg flex items-center justify-center">
            <span className="text-sidebar-primary-foreground font-bold text-lg">TE</span>
          </div>
          <div>
            <h1 className="font-bold text-sidebar-foreground">Toys Emporium</h1>
            <p className="text-xs text-muted-foreground">Manager Panel</p>
          </div>
        </Link>

        <ManagerNotificationBell />

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
          {user?.role === 'manager' && (
            <Link href="/manager/admin-login">
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition">
                <Shield className="w-5 h-5" />
                <span className="font-medium">Admin Login</span>
              </button>
            </Link>
          )}
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
          <Link href="/manager" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">TE</span>
            </div>
            <span className="font-bold">Manager</span>
          </Link>
          <div className="flex items-center gap-2">
            <ManagerNotificationBell />
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="bg-white border-t border-border p-4 space-y-2">
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
            {user?.role === 'manager' && (
              <Link href="/manager/admin-login">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-muted transition">
                  <Shield className="w-5 h-5" />
                  <span>Admin Login</span>
                </button>
              </Link>
            )}
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
      <main className="flex-1 overflow-auto mt-16 md:mt-0">
        <div className="p-6 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}
