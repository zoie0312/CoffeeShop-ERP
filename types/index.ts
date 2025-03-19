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
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  address?: string;
  birthdate?: string;
  joinDate: string;
  points: number;
  totalSpent: number;
  status: 'new' | 'regular' | 'vip';
  notes?: string;
  preferences?: {
    favoriteProducts?: string[];
    milkPreference?: string;
    sugarPreference?: string;
  };
}

export interface CustomerTransaction {
  id: string;
  customerId: string;
  date: string;
  orderId: string;
  amount: number;
  pointsEarned: number;
  pointsRedeemed: number;
  type: 'purchase' | 'refund' | 'points_redemption' | 'points_adjustment';
  notes?: string;
}

export interface CustomerFeedback {
  id: string;
  customerId: string;
  date: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment?: string;
  resolved: boolean;
  response?: string;
  category?: 'service' | 'product' | 'ambiance' | 'price' | 'other';
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

// Staff Management related types
export interface Staff {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  hireDate: string;
  status: 'active' | 'on-leave' | 'terminated';
  address: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  bankDetails: {
    accountName: string;
    accountNumber: string;
    bankName: string;
  };
  hourlyRate?: number;
  salary?: number;
  paymentFrequency?: 'weekly' | 'bi-weekly' | 'monthly';
  notes?: string;
}

export interface Shift {
  id: string;
  staffId: string;
  date: string;
  startTime: string;
  endTime: string;
  position: string;
  status: 'scheduled' | 'completed' | 'missed' | 'sick-leave' | 'vacation';
  hoursWorked?: number;
  notes?: string;
}

export interface StaffTraining {
  id: string;
  staffId: string;
  trainingName: string;
  completionDate: string;
  expiryDate?: string;
  certificateNumber?: string;
  status: 'completed' | 'pending' | 'expired';
  notes?: string;
}

export interface Performance {
  id: string;
  staffId: string;
  reviewDate: string;
  reviewerId: string;
  rating: 1 | 2 | 3 | 4 | 5;
  strengths: string;
  areasForImprovement: string;
  goals: string;
  notes?: string;
} 