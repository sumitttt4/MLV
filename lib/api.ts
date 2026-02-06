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

export interface PaymentDetails {
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature: string;
}

export interface MenuResponse {
  categories: MenuCategory[];
  items: MenuItem[];
}

export interface MenuItemInput {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  imageUrl: string;
  isVeg: boolean;
  isAvailable: boolean;
}

export interface MenuItemRecord {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
  image_url: string | null;
  is_veg: boolean;
  is_available: boolean;
}

export interface SeedMenuItemInput {
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isVeg: boolean;
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

export async function getMenuItems(): Promise<MenuItemRecord[]> {
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Unable to fetch menu items: ${error.message}`);
  }

  return (data ?? []) as MenuItemRecord[];
}

export async function getCategories(): Promise<MenuCategory[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error(`Unable to fetch categories: ${error.message}`);
  }

  return data ?? [];
}

export async function createMenuItem(input: MenuItemInput) {
  const { data, error } = await supabase
    .from("menu_items")
    .insert({
      name: input.name,
      description: input.description,
      price: input.price,
      category_id: input.categoryId,
      image_url: input.imageUrl,
      is_veg: input.isVeg,
      is_available: input.isAvailable
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(`Unable to create menu item: ${error.message}`);
  }

  return data as MenuItemRecord;
}

export async function updateMenuPrice(menuItemId: string, price: number) {
  const { data, error } = await supabase
    .from("menu_items")
    .update({ price })
    .eq("id", menuItemId)
    .select("*")
    .single();

  if (error) {
    throw new Error(`Unable to update price: ${error.message}`);
  }

  return data as MenuItemRecord;
}

export async function updateAvailability(
  menuItemId: string,
  isAvailable: boolean
) {
  const { data, error } = await supabase
    .from("menu_items")
    .update({ is_available: isAvailable })
    .eq("id", menuItemId)
    .select("*")
    .single();

  if (error) {
    throw new Error(`Unable to update availability: ${error.message}`);
  }

  return data as MenuItemRecord;
}

export async function seedMenuItems(menuItems: SeedMenuItemInput[]) {
  const { data: existingCategories, error: categoryError } = await supabase
    .from("categories")
    .select("id,name");

  if (categoryError) {
    throw new Error(`Unable to fetch categories: ${categoryError.message}`);
  }

  const categoryMap = new Map<string, string>();
  (existingCategories ?? []).forEach((category) => {
    categoryMap.set(category.name, category.id);
  });

  const missingCategories = Array.from(
    new Set(
      menuItems
        .map((item) => item.category)
        .filter((category) => !categoryMap.has(category))
    )
  );

  if (missingCategories.length > 0) {
    const { data: insertedCategories, error: insertError } = await supabase
      .from("categories")
      .insert(
        missingCategories.map((name, index) => ({
          name,
          description: null,
          sort_order: index
        }))
      )
      .select("id,name");

    if (insertError) {
      throw new Error(`Unable to seed categories: ${insertError.message}`);
    }

    (insertedCategories ?? []).forEach((category) => {
      categoryMap.set(category.name, category.id);
    });
  }

  const { error: resetError } = await supabase
    .from("menu_items")
    .delete()
    .neq("id", "");

  if (resetError) {
    throw new Error(`Unable to reset menu items: ${resetError.message}`);
  }

  const { data, error } = await supabase
    .from("menu_items")
    .insert(
      menuItems.map((item) => ({
        name: item.name,
        description: item.description,
        price: item.price,
        category_id: categoryMap.get(item.category) ?? null,
        image_url: item.image,
        is_veg: item.isVeg,
        is_available: true
      }))
    )
    .select("*");

  if (error) {
    throw new Error(`Unable to seed menu items: ${error.message}`);
  }

  return data as MenuItemRecord[];
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

export async function createOrder({
  cart,
  userDetails,
  payment
}: PlaceOrderInput & { payment: PaymentDetails }) {
  const paymentNotes = `Payment: ${payment.razorpayPaymentId} | ${payment.razorpayOrderId} | ${payment.razorpaySignature}`;
  const mergedNotes = userDetails.notes
    ? `${userDetails.notes}\n${paymentNotes}`
    : paymentNotes;

  return placeOrder({
    cart,
    userDetails: {
      ...userDetails,
      notes: mergedNotes
    }
  });
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
