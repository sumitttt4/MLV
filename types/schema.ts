export interface MenuCategory {
  id: string;
  name: string;
  description: string | null;
  sortOrder: number;
  createdAt: string;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  isVeg: boolean;
  isAvailable: boolean;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerId: string | null;
  items: OrderItem[];
  gst: number;
  total: number;
  status: "New" | "Preparing" | "Ready" | "Completed";
  createdAt: string;
}

export interface CustomerProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  role: "Customer" | "Admin";
  createdAt: string;
}
