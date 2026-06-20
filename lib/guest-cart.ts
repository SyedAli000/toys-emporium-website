export type GuestCartItem = {
  productId: string;
  quantity: number;
  price: number;
  name: string;
  image?: string;
};

const STORAGE_KEY = 'toys_guest_cart';

function read(): GuestCartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as GuestCartItem[]) : [];
  } catch {
    return [];
  }
}

function write(items: GuestCartItem[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export const guestCart = {
  getItems: read,
  clear: () => write([]),
  addItem: (item: Omit<GuestCartItem, 'quantity'>, quantity = 1) => {
    const items = read();
    const existing = items.find((i) => i.productId === item.productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      items.push({ ...item, quantity });
    }
    write(items);
    return items;
  },
  updateQuantity: (productId: string, quantity: number) => {
    const items = read()
      .map((i) => (i.productId === productId ? { ...i, quantity } : i))
      .filter((i) => i.quantity > 0);
    write(items);
    return items;
  },
  removeItem: (productId: string) => {
    const items = read().filter((i) => i.productId !== productId);
    write(items);
    return items;
  },
  getCount: () => read().reduce((sum, i) => sum + i.quantity, 0),
};
