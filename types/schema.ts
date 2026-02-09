// ─────────────────────────────────────────────
// Menu
// ─────────────────────────────────────────────
export interface MenuCategory {
  id: string;
  name: string;
  description: string | null;
  sortOrder: number;
  createdAt: string;
}

export type SpiceLevel = "Mild" | "Medium" | "Hot" | "Extra Hot";

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  isVeg: boolean;
  isAvailable: boolean;
  spiceLevel: SpiceLevel;
  prepTime: number; // minutes
  createdAt: string;
}

// ─────────────────────────────────────────────
// Orders
// ─────────────────────────────────────────────
export type OrderStatus =
  | "Received"
  | "Confirmed"
  | "Preparing"
  | "Ready"
  | "Out for Delivery"
  | "Delivered"
  | "Cancelled";

export type OrderType = "delivery" | "pickup" | "dine_in";
export type PaymentMethod = "online" | "cod";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface OrderItem {
  id: string;
  orderId: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  itemNotes?: string | null;
}

export interface Order {
  id: string;
  customerId: string | null;
  customerName: string | null;
  customerPhone: string | null;
  deliveryAddress: string | null;
  orderType: OrderType;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  razorpayPaymentId: string | null;
  razorpayOrderId: string | null;
  deliveryFee: number;
  subtotal: number;
  gst: number;
  total: number;
  items: OrderItem[];
  status: OrderStatus;
  estimatedTime: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─────────────────────────────────────────────
// Reservations
// ─────────────────────────────────────────────
export type ReservationStatus = "pending" | "confirmed" | "cancelled" | "completed" | "no_show";

export interface Reservation {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  date: string;
  time: string;
  partySize: number;
  specialRequests: string | null;
  status: ReservationStatus;
  createdAt: string;
}

// ─────────────────────────────────────────────
// Customer
// ─────────────────────────────────────────────
export interface CustomerProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  role: "customer" | "admin" | "kitchen";
  createdAt: string;
}

// ─────────────────────────────────────────────
// Delivery Zones
// ─────────────────────────────────────────────
export interface DeliveryZone {
  id: string;
  zoneName: string;
  minDistanceKm: number;
  maxDistanceKm: number;
  deliveryFee: number;
  estimatedTimeMin: number;
  isActive: boolean;
}

// ─────────────────────────────────────────────
// Contact
// ─────────────────────────────────────────────
export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
}
