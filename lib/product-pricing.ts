import { Product } from '@/lib/types';

export function getDiscountPercent(product: Product): number {
  return Math.min(100, Math.max(0, Number(product.discountPercentage ?? 0)));
}

export function hasDiscount(product: Product): boolean {
  return getDiscountPercent(product) > 0;
}

export function getOriginalPrice(product: Product): number {
  return Number(product.price) || 0;
}

export function getSalePrice(product: Product): number {
  const original = getOriginalPrice(product);
  const pct = getDiscountPercent(product);
  if (pct <= 0) return original;
  return Math.round(original * (1 - pct / 100) * 100) / 100;
}

export function discountAmountToPercent(amount: number, originalPrice: number): number {
  if (originalPrice <= 0 || amount <= 0) return 0;
  return Math.min(100, Math.round((amount / originalPrice) * 10000) / 100);
}

export function discountPercentToAmount(percent: number, originalPrice: number): number {
  if (originalPrice <= 0 || percent <= 0) return 0;
  return Math.round((originalPrice * percent) / 100);
}

export function isFlashSaleProduct(product: Product): boolean {
  return Boolean(product.isFlashSale) && hasDiscount(product);
}

export function splitProductsForStore(products: Product[]) {
  const flashSale = products.filter(isFlashSaleProduct);
  const regular = products.filter((p) => !isFlashSaleProduct(p));
  return { flashSale, regular };
}

export function sortFlashSaleFirst(products: Product[]): Product[] {
  return [...products].sort((a, b) => {
    const aFlash = isFlashSaleProduct(a) ? 1 : 0;
    const bFlash = isFlashSaleProduct(b) ? 1 : 0;
    if (bFlash !== aFlash) return bFlash - aFlash;
    const aDisc = getDiscountPercent(b) - getDiscountPercent(a);
    if (aDisc !== 0) return aDisc;
    return 0;
  });
}
