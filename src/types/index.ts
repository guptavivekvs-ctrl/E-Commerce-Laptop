export interface ProductColorVariation {
  id?: string;
  name: string;
  hex: string;
  image: string;
  stock: number;
  sku: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice: number;
  discount: number; // percentage
  processor: string;
  ram: string;
  storage: string;
  graphics: string;
  display: string;
  operatingSystem: string;
  description: string;
  images: string[];
  colors: ProductColorVariation[];
  stock: number;
  rating: number;
  reviewCount: number;
  featured?: boolean;
  isOffer?: boolean;
  dealTag?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  product: Product;
  selectedColor: ProductColorVariation;
  quantity: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  pincode: string;
}

export type UserRole = 'customer' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  mobile: string;
  address?: Address;
  role: UserRole;
  createdAt: string;
}

export type OrderStatus =
  | 'Order Placed'
  | 'Processing'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export type PaymentMethod = 'UPI' | 'Card' | 'COD';

export interface OrderItem {
  productId: string;
  productName: string;
  brand: string;
  colorName: string;
  colorHex: string;
  colorSku: string;
  image: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: string;
  userId: string;
  customer: {
    name: string;
    email: string;
    mobile: string;
  };
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Paid' | 'Pending' | 'Demo Completed';
  orderStatus: OrderStatus;
  deliveryAddress: Address;
  createdAt: string;
  updatedAt: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string;
  description: string;
  productCount?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  description: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  recommendedProducts?: Product[];
}
