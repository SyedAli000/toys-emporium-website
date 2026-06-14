'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  ReactNode,
} from 'react';
import { AppPopup } from '@/components/AppPopup';

export type PopupVariant = 'success' | 'error' | 'warning' | 'info';

type PopupState = {
  open: boolean;
  variant: PopupVariant;
  title: string;
  message: string;
  mode: 'alert' | 'confirm';
};

type AppPopupContextValue = {
  alert: (message: string, title?: string, variant?: PopupVariant) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  confirm: (message: string, title?: string) => Promise<boolean>;
};

const AppPopupContext = createContext<AppPopupContextValue | null>(null);

export function AppPopupProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PopupState>({
    open: false,
    variant: 'info',
    title: '',
    message: '',
    mode: 'alert',
  });
  const resolverRef = useRef<((v: boolean) => void) | null>(null);

  const close = useCallback((result = false) => {
    setState((s) => ({ ...s, open: false }));
    if (resolverRef.current) {
      resolverRef.current(result);
      resolverRef.current = null;
    }
  }, []);

  const openAlert = useCallback(
    (message: string, title: string, variant: PopupVariant) => {
      resolverRef.current = null;
      setState({
        open: true,
        variant,
        title,
        message,
        mode: 'alert',
      });
    },
    [],
  );

  const openConfirm = useCallback((message: string, title: string) => {
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
      setState({
        open: true,
        variant: 'warning',
        title,
        message,
        mode: 'confirm',
      });
    });
  }, []);

  const value = useMemo<AppPopupContextValue>(
    () => ({
      alert: (message, title = 'Notice', variant = 'info') =>
        openAlert(message, title, variant),
      success: (message, title = 'Success') => openAlert(message, title, 'success'),
      error: (message, title = 'Error') => openAlert(message, title, 'error'),
      warning: (message, title = 'Warning') => openAlert(message, title, 'warning'),
      confirm: (message, title = 'Confirm') => openConfirm(message, title),
    }),
    [openAlert, openConfirm],
  );

  return (
    <AppPopupContext.Provider value={value}>
      {children}
      <AppPopup
        open={state.open}
        variant={state.variant}
        title={state.title}
        message={state.message}
        mode={state.mode}
        onClose={() => close(false)}
        onConfirm={() => close(true)}
      />
    </AppPopupContext.Provider>
  );
}

export function useAppPopup() {
  const ctx = useContext(AppPopupContext);
  if (!ctx) {
    throw new Error('useAppPopup must be used within AppPopupProvider');
  }
  return ctx;
}
