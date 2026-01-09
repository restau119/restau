
export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'picked_up';
export type DiningOption = 'eat-in' | 'reservation' | 'pickup' | 'takeaway' | 'delivery';
export type EventType = 'standard' | 'anniversary' | 'birthday' | 'business' | 'family' | 'romantic' | 'other';
export type PaymentMethod = 'mobile_money' | 'banknotes' | 'none';

export interface Modifier {
  id: string;
  name: string;
  price: number;
  type: 'extra' | 'remove';
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  price: number;
  category: 'Starters' | 'Main Dishes' | 'Drinks' | 'Sides';
  image: string;
  availableModifiers: Modifier[];
  estimatedTime: number;
  allowedOptions: DiningOption[];
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  basePrice: number;
  modifiers: Modifier[];
  totalPrice: number;
  estimatedTime: number;
}

export interface Order {
  id: string;
  tableNumber: string;
  customerName: string;
  chefName: string;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: number;
  totalAmount: number;
  gift?: string;
  diningOption: DiningOption;
  guestCount?: number;
  reservationDate?: string;
  reservationTime?: string;
  eventType?: EventType;
  maxEstimatedTime: number;
  specialInstructions?: string;
  deliveryAddress?: string;
  paymentMethod: PaymentMethod;
  depositAmount?: number;
  isPaid: boolean;
}

export interface Chef {
  id: string;
  name: string;
  specialty: string;
  avatar: string;
}

export interface WorkingDay {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export interface SpecialOffer {
  id: string;
  title: string;
  description: string;
  day: string;
  isActive: boolean;
}

export interface EstateSettings {
  contactNumber: string;
  mobileMoneyDetails: string;
  tableCount: number;
  workingDays: WorkingDay[];
  specialOffers: SpecialOffer[];
}

export type AppView = 'customer' | 'kitchen' | 'public' | 'admin';
