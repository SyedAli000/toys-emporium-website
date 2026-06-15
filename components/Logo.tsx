import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const SIZE_MAP = {
  xs: 36,
  sm: 48,
  md: 64,
  lg: 128,
  xl: 160,
  '2xl': 200,
  '3xl': 280,
  hero: 320,
} as const;

type LogoSize = keyof typeof SIZE_MAP;

type LogoProps = {
  href?: string;
  asLink?: boolean;
  size?: LogoSize;
  subtitle?: string;
  centered?: boolean;
  className?: string;
  imageClassName?: string;
};

export function Logo({
  href = '/',
  asLink = true,
  size = 'sm',
  subtitle,
  centered = false,
  className,
  imageClassName,
}: LogoProps) {
  const px = SIZE_MAP[size];

  const content = (
    <div
      className={cn(
        'flex items-center gap-2 sm:gap-3 min-w-0',
        centered && 'justify-center w-full',
        className,
      )}
    >
      <Image
        src="/toys-emporium-logo.png"
        alt="Toys Emporium — toy store"
        width={px}
        height={px}
        className={cn('object-contain shrink-0 h-auto max-w-full', imageClassName)}
        priority={size === 'lg' || size === 'xl' || size === '2xl' || size === '3xl' || size === 'hero'}
      />
      {subtitle && (
        <p className="text-xs text-muted-foreground font-medium whitespace-nowrap">{subtitle}</p>
      )}
    </div>
  );

  if (asLink && href) {
    return (
      <Link
        href={href}
        className={cn('inline-flex min-w-0 max-w-[55vw] sm:max-w-none', centered && 'mx-auto w-full justify-center')}
      >
        {content}
      </Link>
    );
  }

  if (centered) {
    return <div className="flex w-full justify-center">{content}</div>;
  }

  return content;
}
