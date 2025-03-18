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

export interface CartItem {
  product: Product;
  quantity: number;
  total: number;
  options?: {
    size: string;
    milk: string;
    extras: string[];
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

// Inventory related types
export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  unit: string;
  currentStock: number;
  reorderPoint: number;
  idealStock: number;
  costPerUnit: number;
  supplier: string;
  location: string;
  lastRestocked: string;
  expiryDate: string | null;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
  preferredPaymentTerms: string;
}

export interface InventoryTransaction {
  id: string;
  inventoryId: string;
  date: string;
  type: 'restock' | 'usage' | 'adjustment' | 'write-off';
  quantity: number;
  unitCost: number;
  totalCost: number;
  supplierRef?: string;
  invoiceNumber?: string;
  notes?: string;
}

export interface InventoryCategory {
  id: string;
  name: string;
  description: string;
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