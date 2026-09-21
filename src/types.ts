export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: {
    street: string;
    postalCode: string;
    city: string;
    country: string;
  };
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number; // 1 to 5
  title: string;
  comment: string;
  createdAt: string;
  verifiedPurchase: boolean;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  brand: string;
  category: 'Audio & Son' | 'Maison & Déco' | 'Tech & Bureau' | 'Accessoires' | 'Café & Barista';
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  stock: number;
  initialStock: number;
  image: string;
  images: string[];
  description: string;
  features: string[];
  badge?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  addedAt: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  postalCode: string;
  city: string;
  country: string;
  deliveryMethod: 'standard' | 'express' | 'relais';
}

export type OrderStatus = 'EN_PREPARATION' | 'EXPEDIEE' | 'LIVREE';

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  userId: string;
  userEmail: string;
  userName: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentMethod: 'card' | 'paypal' | 'applepay';
  trackingNumber: string;
  createdAt: number;
}

export interface ConsistencyValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  stockDiscrepancies: {
    productId: string;
    productName: string;
    requestedQty: number;
    availableStock: number;
  }[];
  priceDiscrepancies: {
    productId: string;
    productName: string;
    cartPrice: number;
    catalogPrice: number;
  }[];
}
