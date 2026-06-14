'use client';

import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Info,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PopupVariant } from '@/contexts/AppPopupContext';
import './app-popup.css';

type AppPopupProps = {
  open: boolean;
  variant: PopupVariant;
  title: string;
  message: string;
  mode: 'alert' | 'confirm';
  onClose: () => void;
  onConfirm: () => void;
};

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

export function AppPopup({
  open,
  variant,
  title,
  message,
  mode,
  onClose,
  onConfirm,
}: AppPopupProps) {
  if (!open) return null;

  const Icon = icons[variant];

  return (
    <div className="app-popup-overlay" onClick={onClose} role="presentation">
      <div
        className="app-popup-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="app-popup-title"
      >
        <button
          type="button"
          className="app-popup-close"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className={`app-popup-icon app-popup-icon--${variant}`}>
          <Icon className="w-12 h-12" />
        </div>

        <h2 id="app-popup-title" className="app-popup-title">
          {title}
        </h2>
        <p className="app-popup-message">{message}</p>

        <div
          className={`app-popup-actions ${mode === 'confirm' ? 'app-popup-actions--row' : ''}`}
        >
          {mode === 'confirm' ? (
            <>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={onConfirm}>
                Confirm
              </Button>
            </>
          ) : (
            <Button className="w-full" onClick={onClose}>
              OK
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
