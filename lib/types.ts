// User Types
export type UserRole = 'super_admin' | 'admin' | 'manager' | 'customer' | 'guest';

export interface User {
  _id: string;
  email: string;
  password?: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface AuthToken {
  userId: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}

// Product Types
export interface Category {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  cost?: number;
  category: string;
  stock: number;
  images: string[];
  ratings: number;
  reviews: number;
  tags?: string[];
  isFeatured: boolean;
  isActive: boolean;
  isFlashSale?: boolean;
  discountPercentage?: number;
  hasReturn?: boolean;
  hasWarranty?: boolean;
  returnPolicy?: string;
  warrantyText?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewUser {
  _id: string;
  name: string;
  email?: string;
  avatar?: string;
}

export interface ReviewProduct {
  _id: string;
  name: string;
  images?: string[];
}

export interface Review {
  _id: string;
  productId: string | ReviewProduct;
  userId: string | ReviewUser;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt?: Date;
}

// Cart & Order Types
export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Address {
  _id?: string;
  userId: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentMethod = 'cod';

export type OrderUserRef = {
  _id?: string;
  name?: string;
  email?: string;
};

export interface Order {
  _id: string;
  userId: string | OrderUserRef;
  items: CartItem[];
  shippingAddress: Address;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  trackingNumber?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Wishlist
export interface Wishlist {
  _id: string;
  userId: string;
  productIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Banner
export interface Banner {
  _id: string;
  title: string;
  description?: string;
  image: string;
  link?: string;
  isActive: boolean;
  position: number;
  createdAt: Date;
}

// Coupon
export interface Coupon {
  _id: string;
  code: string;
  discount: number;
  discountType: 'percentage' | 'fixed';
  minAmount?: number;
  maxUses?: number;
  currentUses: number;
  expiresAt: Date;
  isActive: boolean;
  createdAt: Date;
}
