'use client';

import { cn } from '@/lib/utils';
import './animations.css';

type AnimateVariant = 'fade-up' | 'fade-in' | 'scale-in' | 'slide-left';

type AnimateInProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variant?: AnimateVariant;
  as?: 'div' | 'section' | 'article' | 'span' | 'li';
};

export function AnimateIn({
  children,
  className,
  delay = 0,
  variant = 'fade-up',
  as: Tag = 'div',
}: AnimateInProps) {
  return (
    <Tag
      className={cn(`anim-${variant}`, className)}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
