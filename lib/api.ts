import { createClient } from "@supabase/supabase-js";
import type {
  MenuCategory,
  MenuItem,
  OrderItem,
  Order,
  OrderStatus,
  OrderType,
  PaymentMethod,
  Reservation,
  DeliveryZone,
} from "@/types/schema";
import { menuItems as mockItems } from "./dummyData";

const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isMockMode = !envUrl || envUrl.includes("example") || !envKey || envKey.includes("placeholder");

const supabaseUrl = envUrl || "https://example.supabase.co";
const supabaseKey = envKey || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vY2sifQ.mock_signature";

export const supabase = createClient(supabaseUrl, supabaseKey);

// ─────────────────────────────────────────────
// Types for API inputs
// ─────────────────────────────────────────────

export interface CartLine {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

export interface PlaceOrderInput {
  cart: CartLine[];
  userDetails: {
    fullName: string;
    phoneNumber: string;
    deliveryAddress: string;
    notes?: string | null;
  };
  orderType: OrderType;
  paymentMethod: PaymentMethod;
  deliveryFee?: number;
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
  spice_level?: string;
  prep_time?: number;
}

export interface SeedMenuItemInput {
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isVeg: boolean;
  spiceLevel?: string;
  prepTime?: number;
}

// ─────────────────────────────────────────────
// Menu APIs
// ─────────────────────────────────────────────

export async function getMenu(): Promise<MenuResponse> {
  if (isMockMode) {
    const categoriesSet = new Set(mockItems.map(i => i.category));
    const categories = Array.from(categoriesSet).map((name, idx) => ({
      id: `cat-${idx}`,
      name: name,
      description: null,
      sortOrder: idx,
      createdAt: new Date().toISOString()
    }));

    const items: MenuItem[] = mockItems.map(i => ({
      id: i.id,
      name: i.name,
      description: i.description,
      price: i.price,
      categoryId: categories.find(c => c.name === i.category)?.id ?? "",
      imageUrl: i.image,
      isVeg: i.isVeg,
      isAvailable: true,
      spiceLevel: i.spiceLevel,
      prepTime: i.prepTime,
      createdAt: new Date().toISOString()
    }));

    return { categories, items };
  }

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

export async function updateAvailability(menuItemId: string, isAvailable: boolean) {
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
        is_available: true,
        spice_level: item.spiceLevel ?? "Medium",
        prep_time: item.prepTime ?? 15,
      }))
    )
    .select("*");

  if (error) {
    throw new Error(`Unable to seed menu items: ${error.message}`);
  }

  return data as MenuItemRecord[];
}

// ─────────────────────────────────────────────
// Order APIs
// ─────────────────────────────────────────────

export async function placeOrder({
  cart,
  userDetails,
  orderType,
  paymentMethod,
  deliveryFee = 0,
}: PlaceOrderInput) {
  if (cart.length === 0) {
    throw new Error("Cart is empty.");
  }

  const subtotal = cart.reduce(
    (total, line) => total + line.price * line.quantity,
    0
  );
  const gst = Number((subtotal * 0.05).toFixed(2));
  const actualDeliveryFee = orderType === "delivery" ? deliveryFee : 0;
  const total = Number((subtotal + gst + actualDeliveryFee).toFixed(2));

  const estimatedTime = orderType === "delivery" ? 45 : 30;

  if (isMockMode) {
    return `ord_${Math.random().toString(36).substr(2, 9)}`;
  }

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_name: userDetails.fullName,
      customer_phone: userDetails.phoneNumber,
      delivery_address: userDetails.deliveryAddress,
      order_type: orderType,
      payment_method: paymentMethod,
      payment_status: "pending",
      delivery_fee: actualDeliveryFee,
      subtotal,
      gst,
      total,
      status: "Received",
      estimated_time: estimatedTime,
      notes: userDetails.notes || null,
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
    quantity: line.quantity,
    itemNotes: line.notes || null,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(
      orderItems.map((item) => ({
        order_id: item.orderId,
        menu_item_id: item.menuItemId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        item_notes: item.itemNotes,
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
  payment,
  orderType,
  paymentMethod,
  deliveryFee,
}: PlaceOrderInput & { payment: PaymentDetails }) {
  const orderId = await placeOrder({ cart, userDetails, orderType, paymentMethod, deliveryFee });

  if (!isMockMode) {
    await supabase
      .from("orders")
      .update({
        razorpay_payment_id: payment.razorpayPaymentId,
        razorpay_order_id: payment.razorpayOrderId,
        payment_status: "paid",
      })
      .eq("id", orderId);
  }

  return orderId;
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  if (isMockMode) {
    return {
      id: orderId,
      customerId: null,
      customerName: "Demo Customer",
      customerPhone: "+91 98765 43210",
      deliveryAddress: "123 Demo Street, Bangalore",
      orderType: "delivery",
      paymentMethod: "online",
      paymentStatus: "paid",
      razorpayPaymentId: null,
      razorpayOrderId: null,
      deliveryFee: 30,
      subtotal: 850,
      gst: 42.5,
      total: 922.5,
      items: [
        { id: "oi-1", orderId, menuItemId: "bir-nv1", name: "Chicken Dum Biryani", price: 280, quantity: 2 },
        { id: "oi-2", orderId, menuItemId: "tand-v1", name: "Paneer Tikka", price: 280, quantity: 1 },
      ],
      status: "Preparing",
      estimatedTime: 35,
      notes: null,
      createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", orderId)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    customerId: data.customer_id,
    customerName: data.customer_name,
    customerPhone: data.customer_phone,
    deliveryAddress: data.delivery_address,
    orderType: data.order_type,
    paymentMethod: data.payment_method,
    paymentStatus: data.payment_status,
    razorpayPaymentId: data.razorpay_payment_id,
    razorpayOrderId: data.razorpay_order_id,
    deliveryFee: Number(data.delivery_fee),
    subtotal: Number(data.subtotal),
    gst: Number(data.gst),
    total: Number(data.total),
    items: (data.order_items ?? []).map((oi: Record<string, unknown>) => ({
      id: oi.id as string,
      orderId: oi.order_id as string,
      menuItemId: oi.menu_item_id as string,
      name: oi.name as string,
      price: Number(oi.price),
      quantity: Number(oi.quantity),
      itemNotes: oi.item_notes as string | null,
    })),
    status: data.status,
    estimatedTime: data.estimated_time,
    notes: data.notes,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export async function getOrdersByPhone(phone: string): Promise<Order[]> {
  if (isMockMode) {
    const mockOrder = await getOrderById("ord_demo_1");
    return mockOrder ? [mockOrder] : [];
  }

  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("customer_phone", phone)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Unable to fetch orders: ${error.message}`);
  }

  return (data ?? []).map((d) => ({
    id: d.id,
    customerId: d.customer_id,
    customerName: d.customer_name,
    customerPhone: d.customer_phone,
    deliveryAddress: d.delivery_address,
    orderType: d.order_type,
    paymentMethod: d.payment_method,
    paymentStatus: d.payment_status,
    razorpayPaymentId: d.razorpay_payment_id,
    razorpayOrderId: d.razorpay_order_id,
    deliveryFee: Number(d.delivery_fee),
    subtotal: Number(d.subtotal),
    gst: Number(d.gst),
    total: Number(d.total),
    items: (d.order_items ?? []).map((oi: Record<string, unknown>) => ({
      id: oi.id as string,
      orderId: oi.order_id as string,
      menuItemId: oi.menu_item_id as string,
      name: oi.name as string,
      price: Number(oi.price),
      quantity: Number(oi.quantity),
      itemNotes: oi.item_notes as string | null,
    })),
    status: d.status,
    estimatedTime: d.estimated_time,
    notes: d.notes,
    createdAt: d.created_at,
    updatedAt: d.updated_at,
  }));
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
) {
  if (isMockMode) return orderId;

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

export async function getLiveOrders() {
  if (isMockMode) {
    return [
      {
        id: "ord_demo_1",
        customer_id: null,
        customer_name: "Rahul Sharma",
        customer_phone: "+91 98765 43210",
        order_type: "delivery",
        status: "Preparing",
        total: 1250,
        created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        order_items: [
          { name: "Paneer Tikka", quantity: 2 },
          { name: "Butter Naan", quantity: 3 }
        ]
      },
      {
        id: "ord_demo_2",
        customer_id: null,
        customer_name: "Priya Patel",
        customer_phone: "+91 87654 32109",
        order_type: "pickup",
        status: "Received",
        total: 850,
        created_at: new Date(Date.now() - 1000 * 60 * 1).toISOString(),
        order_items: [
          { name: "Chicken Dum Biryani", quantity: 1 },
          { name: "Kesar Lassi", quantity: 2 }
        ]
      },
      {
        id: "ord_demo_3",
        customer_id: null,
        customer_name: "Amit Kumar",
        customer_phone: "+91 76543 21098",
        order_type: "dine_in",
        status: "Ready",
        total: 1680,
        created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        order_items: [
          { name: "MLV Grand Platter", quantity: 1 },
          { name: "Hyderabadi Mutton Biryani", quantity: 2 }
        ]
      }
    ];
  }

  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .in("status", ["Received", "Confirmed", "Preparing", "Ready", "Out for Delivery"])
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Unable to fetch live orders: ${error.message}`);
  }

  return data ?? [];
}

// ─────────────────────────────────────────────
// Reservation APIs
// ─────────────────────────────────────────────

export interface CreateReservationInput {
  name: string;
  email?: string;
  phone: string;
  date: string;
  time: string;
  partySize: number;
  specialRequests?: string;
}

export async function createReservation(input: CreateReservationInput): Promise<string> {
  if (isMockMode) {
    return `res_${Math.random().toString(36).substr(2, 9)}`;
  }

  const { data, error } = await supabase
    .from("reservations")
    .insert({
      name: input.name,
      email: input.email || null,
      phone: input.phone,
      date: input.date,
      time: input.time,
      party_size: input.partySize,
      special_requests: input.specialRequests || null,
      status: "pending",
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(`Unable to create reservation: ${error?.message ?? "Unknown error"}`);
  }

  return data.id;
}

export async function getReservations(): Promise<Reservation[]> {
  if (isMockMode) {
    const today = new Date().toISOString().split("T")[0];
    return [
      {
        id: "res_demo_1",
        name: "Suresh Reddy",
        email: "suresh@example.com",
        phone: "+91 98765 11111",
        date: today,
        time: "19:00",
        partySize: 4,
        specialRequests: "Birthday celebration, need a cake",
        status: "confirmed",
        createdAt: new Date().toISOString(),
      },
      {
        id: "res_demo_2",
        name: "Ananya Iyer",
        email: "ananya@example.com",
        phone: "+91 98765 22222",
        date: today,
        time: "20:30",
        partySize: 8,
        specialRequests: "Anniversary dinner, quiet corner preferred",
        status: "pending",
        createdAt: new Date().toISOString(),
      },
    ];
  }

  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .order("date", { ascending: true })
    .order("time", { ascending: true });

  if (error) {
    throw new Error(`Unable to fetch reservations: ${error.message}`);
  }

  return (data ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    phone: r.phone,
    date: r.date,
    time: r.time,
    partySize: r.party_size,
    specialRequests: r.special_requests,
    status: r.status,
    createdAt: r.created_at,
  }));
}

export async function updateReservationStatus(
  reservationId: string,
  status: Reservation["status"]
) {
  if (isMockMode) return reservationId;

  const { data, error } = await supabase
    .from("reservations")
    .update({ status })
    .eq("id", reservationId)
    .select("id")
    .single();

  if (error) {
    throw new Error(`Unable to update reservation: ${error.message}`);
  }

  return data?.id ?? null;
}

// ─────────────────────────────────────────────
// Delivery Zone APIs
// ─────────────────────────────────────────────

export async function getDeliveryZones(): Promise<DeliveryZone[]> {
  if (isMockMode) {
    return [
      { id: "dz-1", zoneName: "Within 3 km", minDistanceKm: 0, maxDistanceKm: 3, deliveryFee: 0, estimatedTimeMin: 25, isActive: true },
      { id: "dz-2", zoneName: "3-5 km", minDistanceKm: 3, maxDistanceKm: 5, deliveryFee: 30, estimatedTimeMin: 35, isActive: true },
      { id: "dz-3", zoneName: "5-8 km", minDistanceKm: 5, maxDistanceKm: 8, deliveryFee: 50, estimatedTimeMin: 45, isActive: true },
      { id: "dz-4", zoneName: "8-12 km", minDistanceKm: 8, maxDistanceKm: 12, deliveryFee: 80, estimatedTimeMin: 55, isActive: true },
      { id: "dz-5", zoneName: "Beyond 12 km", minDistanceKm: 12, maxDistanceKm: 20, deliveryFee: 120, estimatedTimeMin: 70, isActive: true },
    ];
  }

  const { data, error } = await supabase
    .from("delivery_zones")
    .select("*")
    .eq("is_active", true)
    .order("min_distance_km", { ascending: true });

  if (error) {
    throw new Error(`Unable to fetch delivery zones: ${error.message}`);
  }

  return (data ?? []).map((d) => ({
    id: d.id,
    zoneName: d.zone_name,
    minDistanceKm: Number(d.min_distance_km),
    maxDistanceKm: Number(d.max_distance_km),
    deliveryFee: Number(d.delivery_fee),
    estimatedTimeMin: d.estimated_time_min,
    isActive: d.is_active,
  }));
}
