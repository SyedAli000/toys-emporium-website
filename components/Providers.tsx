'use client';

import { AppPopupProvider } from '@/contexts/AppPopupContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return <AppPopupProvider>{children}</AppPopupProvider>;
}
