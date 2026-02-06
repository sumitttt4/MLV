# Hotel MLV Grand

## Quick Start

```bash
cp .env.example .env.local
npm install
npm run dev
```

## Storage Bucket SQL (Supabase)

```sql
insert into storage.buckets (id, name, public)
values ('menu-images', 'menu-images', true)
on conflict (id) do nothing;

create policy "Public can view menu images"
  on storage.objects for select
  using (bucket_id = 'menu-images');

create policy "Authenticated can upload menu images"
  on storage.objects for insert
  with check (bucket_id = 'menu-images' and auth.role() = 'authenticated');
```

## Required RLS Policies (Supabase)

Ensure these policies exist and are enabled in your project:

- **categories**: public read
- **menu_items**: public read
- **orders**: public insert, authenticated update for admins
- **order_items**: public insert
- **storage.objects**: public read for `menu-images`, authenticated insert for `menu-images`

## Environment Variables

See `.env.example` for the full list of required environment variables.
