'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import './hero-buttons.css';

type HeroButtonVariant = 'primary' | 'outline' | 'secondary' | 'nav-login' | 'nav-signup';

interface HeroButtonProps {
  href: string;
  variant?: HeroButtonVariant;
  children: React.ReactNode;
  className?: string;
  showArrow?: boolean;
  showSparkle?: boolean;
}

export function HeroButton({
  href,
  variant = 'primary',
  children,
  className = '',
  showArrow = variant === 'primary',
  showSparkle = variant === 'outline',
}: HeroButtonProps) {
  return (
    <Link
      href={href}
      className={`hero-btn hero-btn--${variant} ${className}`}
    >
      {children}
      {showSparkle && (
        <Sparkles className="hero-btn__sparkle w-4 h-4" />
      )}
      {showArrow && (
        <ArrowRight className="hero-btn__icon w-4 h-4" />
      )}
    </Link>
  );
}
