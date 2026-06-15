'use client';

import { AppPopupProvider } from '@/contexts/AppPopupContext';
import { WishlistProvider } from '@/contexts/WishlistContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppPopupProvider>
      <WishlistProvider>{children}</WishlistProvider>
    </AppPopupProvider>
  );
}
