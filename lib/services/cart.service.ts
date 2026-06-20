import Cookies from 'js-cookie';
import { api } from '@/lib/api';
import { guestCart } from '@/lib/guest-cart';

export interface CartItemResponse {
  _id?: string;
  productId: string;
  quantity: number;
  price: number;
  product?: {
    _id: string;
    name: string;
    images: string[];
    price: number;
    originalPrice?: number;
    discountPercentage?: number;
  };
}

export type CartProductMeta = {
  name: string;
  price: number;
  images?: string[];
};

function isLoggedIn() {
  return !!Cookies.get('auth_token');
}

function toResponse(items: ReturnType<typeof guestCart.getItems>): {
  items: CartItemResponse[];
} {
  return {
    items: items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
      product: {
        _id: item.productId,
        name: item.name,
        images: item.image ? [item.image] : [],
        price: item.price,
      },
    })),
  };
}

export const cartService = {
  get: async () => {
    if (isLoggedIn()) {
      return api.get<{ items: CartItemResponse[] }>('/cart');
    }
    return toResponse(guestCart.getItems());
  },
  add: async (
    productId: string,
    quantity = 1,
    product?: CartProductMeta,
  ) => {
    if (isLoggedIn()) {
      return api.post<{ items: CartItemResponse[] }>('/cart', {
        productId,
        quantity,
      });
    }
    if (!product) {
      throw new Error('Product details required for guest cart');
    }
    guestCart.addItem(
      {
        productId,
        price: product.price,
        name: product.name,
        image: product.images?.[0],
      },
      quantity,
    );
    return toResponse(guestCart.getItems());
  },
  update: async (itemId: string, quantity: number) => {
    if (isLoggedIn()) {
      return api.put<{ items: CartItemResponse[] }>(`/cart/${itemId}`, {
        quantity,
      });
    }
    guestCart.updateQuantity(itemId, quantity);
    return toResponse(guestCart.getItems());
  },
  remove: async (itemId: string) => {
    if (isLoggedIn()) {
      return api.delete<{ items: CartItemResponse[] }>(`/cart/${itemId}`);
    }
    guestCart.removeItem(itemId);
    return toResponse(guestCart.getItems());
  },
  clear: () => {
    if (!isLoggedIn()) {
      guestCart.clear();
    }
  },
};
