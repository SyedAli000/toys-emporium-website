import { productService } from '@/lib/services';
import { CartItem } from '@/lib/types';
import { resolveImageUrl } from '@/lib/image-url';

export type EnrichedOrderItem = CartItem & {
  productName: string;
  productImage?: string;
};

export async function enrichOrderItems(
  items: CartItem[],
): Promise<EnrichedOrderItem[]> {
  return Promise.all(
    items.map(async (item) => {
      const productId =
        typeof item.productId === 'string'
          ? item.productId
          : String(item.productId);
      try {
        const p = await productService.getOne(productId);
        const raw = p.images?.[0];
        return {
          ...item,
          productId,
          productName: p.name,
          productImage: raw ? resolveImageUrl(raw) : undefined,
        };
      } catch {
        return {
          ...item,
          productId,
          productName: 'Product',
        };
      }
    }),
  );
}

export function getOrderCustomerLabel(
  userId: string | { name?: string; email?: string; _id?: string },
): string {
  if (typeof userId === 'object' && userId !== null) {
    const name = userId.name?.trim();
    const email = userId.email?.trim();
    if (name && email) return `${name} (${email})`;
    return name || email || 'Customer';
  }
  return 'Customer';
}
