import { ReactNode } from 'react';

// Product related types
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
  description?: string;
  options?: {
    sizes?: string[];
    milkTypes?: string[];
    extras?: Array<{
      id: string;
      name: string;
      price: number;
    }>;
  };
}

// Order related types
export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  options: {
    size: string;
    milk: string;
    extras: Array<{
      id: string;
      name: string;
      price: number;
    }>;
  };
  totalPrice: number;
}

export interface Order {
  id?: string;
  items: OrderItem[];
  customer?: Customer;
  subtotal: number;
  tax: number;
  total: number;
  status?: 'pending' | 'completed' | 'cancelled';
  paymentMethod?: 'cash' | 'card' | 'mobile';
  createdAt?: Date;
}

// Customer related types
export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  points: number;
  status: 'new' | 'regular' | 'vip';
}

// UI related types
export interface KpiCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  comparison?: {
    value: string;
    isPositive: boolean;
  };
  details?: Array<{
    label: string;
    value: string | number;
  }>;
}

export interface LayoutProps {
  children: ReactNode;
  title?: string;
} 