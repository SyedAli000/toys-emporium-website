'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/Logo';
import { ShoppingBag } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50 to-background flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <Logo href="/" centered className="mb-8" imageClassName="w-40" />
        <div className="bg-white rounded-2xl border border-border shadow-lg p-8">
          <ShoppingBag className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-xl font-bold text-foreground mb-2">No sign-up needed</h1>
          <p className="text-muted-foreground mb-6">
            Customers can browse and order without creating an account.
          </p>
          <Link href="/user/products" className="text-primary font-semibold hover:underline">
            Start shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
