import { createClient } from "@supabase/supabase-js";
import type { MenuCategory, MenuItem, OrderItem } from "@/types/schema";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface CartLine {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface PlaceOrderInput {
  cart: CartLine[];
  userDetails: {
    customerId: string | null;
    notes?: string | null;
  };
}

export interface MenuResponse {
  categories: MenuCategory[];
  items: MenuItem[];
}

export async function getMenu(): Promise<MenuResponse> {
  const { data: categories, error: categoriesError } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (categoriesError) {
    throw new Error(`Unable to fetch categories: ${categoriesError.message}`);
  }

  const { data: items, error: itemsError } = await supabase
    .from("menu_items")
    .select("*")
    .order("name", { ascending: true });

  if (itemsError) {
    throw new Error(`Unable to fetch menu items: ${itemsError.message}`);
  }

  return {
    categories: categories ?? [],
    items: items ?? []
  };
}

export async function placeOrder({ cart, userDetails }: PlaceOrderInput) {
  if (cart.length === 0) {
    throw new Error("Cart is empty.");
  }

  const subtotal = cart.reduce(
    (total, line) => total + line.price * line.quantity,
    0
  );
  const gst = Number((subtotal * 0.05).toFixed(2));
  const total = Number((subtotal + gst).toFixed(2));

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_id: userDetails.customerId,
      gst,
      total,
      status: "New",
      notes: userDetails.notes ?? null
    })
    .select("id")
    .single();

  if (orderError || !order) {
    throw new Error(
      `Unable to create order: ${orderError?.message ?? "Unknown error"}`
    );
  }

  const orderItems: Omit<OrderItem, "id">[] = cart.map((line) => ({
    orderId: order.id,
    menuItemId: line.menuItemId,
    name: line.name,
    price: line.price,
    quantity: line.quantity
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(
      orderItems.map((item) => ({
        order_id: item.orderId,
        menu_item_id: item.menuItemId,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      }))
    );

  if (itemsError) {
    throw new Error(`Unable to create order items: ${itemsError.message}`);
  }

  return order.id;
}

export async function updateOrderStatus(
  orderId: string,
  status: "New" | "Preparing" | "Ready" | "Completed"
) {
  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId)
    .select("id")
    .single();

  if (error) {
    throw new Error(`Unable to update order status: ${error.message}`);
  }

  return data?.id ?? null;
}
