export type Category =
  | "Starters"
  | "Main Course"
  | "Breads"
  | "Biryani"
  | "Beverages"
  | "Desserts";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  isVeg: boolean;
  spiceLevel: "Mild" | "Medium" | "Bold";
  image: string;
}

export interface OrderItem {
  item: MenuItem;
  quantity: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  gst: number;
  createdAt: string;
  status: "New" | "Preparing" | "Ready" | "Completed";
}
