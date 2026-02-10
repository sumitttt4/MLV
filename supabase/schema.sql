create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────────
-- Utility: auto-update timestamps
-- ─────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ─────────────────────────────────────────────
-- Categories
-- ─────────────────────────────────────────────
create table if not exists public.categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- Menu Items (expanded with spice_level, prep_time)
-- ─────────────────────────────────────────────
create table if not exists public.menu_items (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid not null references public.categories(id) on delete cascade,
  name text not null,
  description text not null,
  price numeric(10, 2) not null,
  image_url text,
  is_veg boolean not null default false,
  is_available boolean not null default true,
  spice_level text not null default 'Medium' check (spice_level in ('Mild', 'Medium', 'Hot', 'Extra Hot')),
  prep_time integer not null default 15, -- minutes
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- Orders (expanded with delivery info, payment)
-- ─────────────────────────────────────────────
create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid,
  customer_name text,
  customer_phone text,
  delivery_address text,
  order_type text not null default 'delivery' check (order_type in ('delivery', 'pickup', 'dine_in')),
  payment_method text not null default 'online' check (payment_method in ('online', 'cod')),
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
  razorpay_payment_id text,
  razorpay_order_id text,
  delivery_fee numeric(10, 2) not null default 0,
  gst numeric(10, 2) not null default 0,
  subtotal numeric(10, 2) not null default 0,
  total numeric(10, 2) not null default 0,
  status text not null default 'Received' check (status in ('Received', 'Confirmed', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered', 'Cancelled')),
  estimated_time integer, -- minutes
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- Order Items (with item notes)
-- ─────────────────────────────────────────────
create table if not exists public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references public.orders(id) on delete cascade,
  menu_item_id uuid not null references public.menu_items(id) on delete restrict,
  name text not null,
  price numeric(10, 2) not null,
  quantity integer not null default 1,
  item_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- Reservations / Table Bookings
-- ─────────────────────────────────────────────
create table if not exists public.reservations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text,
  phone text not null,
  date date not null,
  time time not null,
  party_size integer not null default 2 check (party_size >= 1 and party_size <= 50),
  special_requests text,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- Customer Profiles
-- ─────────────────────────────────────────────
create table if not exists public.customer_profiles (
  id uuid primary key default uuid_generate_v4(),
  auth_user_id uuid unique,
  full_name text not null,
  email text,
  phone text not null unique,
  role text not null default 'customer' check (role in ('customer', 'admin', 'kitchen')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- Contact Submissions
-- ─────────────────────────────────────────────
create table if not exists public.contact_submissions (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- Delivery Zones
-- ─────────────────────────────────────────────
create table if not exists public.delivery_zones (
  id uuid primary key default uuid_generate_v4(),
  zone_name text not null,
  min_distance_km numeric(5, 1) not null default 0,
  max_distance_km numeric(5, 1) not null,
  delivery_fee numeric(10, 2) not null default 0,
  estimated_time_min integer not null default 30,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- Triggers for updated_at
-- ─────────────────────────────────────────────
create trigger categories_set_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

create trigger menu_items_set_updated_at
before update on public.menu_items
for each row execute function public.set_updated_at();

create trigger orders_set_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

create trigger order_items_set_updated_at
before update on public.order_items
for each row execute function public.set_updated_at();

create trigger reservations_set_updated_at
before update on public.reservations
for each row execute function public.set_updated_at();

create trigger customer_profiles_set_updated_at
before update on public.customer_profiles
for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────
alter table public.categories enable row level security;
alter table public.menu_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.reservations enable row level security;
alter table public.customer_profiles enable row level security;
alter table public.contact_submissions enable row level security;
alter table public.delivery_zones enable row level security;

-- Public read access
create policy "Public can read categories"
  on public.categories for select to public using (true);

create policy "Public can read menu items"
  on public.menu_items for select to public using (true);

create policy "Public can read delivery zones"
  on public.delivery_zones for select to public using (true);

-- Public can create orders and reservations
create policy "Public can create orders"
  on public.orders for insert to public with check (true);

create policy "Public can read own orders"
  on public.orders for select to public using (true);

create policy "Public can create order items"
  on public.order_items for insert to public with check (true);

create policy "Public can read order items"
  on public.order_items for select to public using (true);

create policy "Public can create reservations"
  on public.reservations for insert to public with check (true);

create policy "Public can read own reservations"
  on public.reservations for select to public using (true);

create policy "Public can create contact submissions"
  on public.contact_submissions for insert to public with check (true);

-- Admin policies
create policy "Admin can update orders"
  on public.orders for update to authenticated
  using (auth.jwt() ->> 'role' = 'admin')
  with check (auth.jwt() ->> 'role' = 'admin');

create policy "Admin can update reservations"
  on public.reservations for update to authenticated
  using (auth.jwt() ->> 'role' = 'admin')
  with check (auth.jwt() ->> 'role' = 'admin');

create policy "Admin can manage menu items"
  on public.menu_items for all to authenticated
  using (auth.jwt() ->> 'role' = 'admin')
  with check (auth.jwt() ->> 'role' = 'admin');

create policy "Admin can manage categories"
  on public.categories for all to authenticated
  using (auth.jwt() ->> 'role' = 'admin')
  with check (auth.jwt() ->> 'role' = 'admin');

create policy "Admin can read contact submissions"
  on public.contact_submissions for select to authenticated
  using (auth.jwt() ->> 'role' = 'admin');

create policy "Admin can update contact submissions"
  on public.contact_submissions for update to authenticated
  using (auth.jwt() ->> 'role' = 'admin')
  with check (auth.jwt() ->> 'role' = 'admin');

-- ─────────────────────────────────────────────
-- Indexes
-- ─────────────────────────────────────────────
create index if not exists idx_menu_items_category on public.menu_items(category_id);
create index if not exists idx_menu_items_available on public.menu_items(is_available);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_customer_phone on public.orders(customer_phone);
create index if not exists idx_orders_created_at on public.orders(created_at desc);
create index if not exists idx_order_items_order on public.order_items(order_id);
create index if not exists idx_reservations_date on public.reservations(date);
create index if not exists idx_reservations_status on public.reservations(status);

-- ─────────────────────────────────────────────
-- Seed delivery zones for Bangalore area
-- ─────────────────────────────────────────────
insert into public.delivery_zones (zone_name, min_distance_km, max_distance_km, delivery_fee, estimated_time_min, is_active) values
  ('Within 3 km', 0, 3, 0, 25, true),
  ('3-5 km', 3, 5, 30, 35, true),
  ('5-8 km', 5, 8, 50, 45, true),
  ('8-12 km', 8, 12, 80, 55, true),
  ('Beyond 12 km', 12, 20, 120, 70, true)
on conflict do nothing;
