-- Create a public bucket for menu images
insert into storage.buckets (id, name, public)
values ('menu-images', 'menu-images', true)
on conflict (id) do nothing;

-- Allow public read access to menu images
create policy "Public can view menu images"
on storage.objects for select
using (bucket_id = 'menu-images');

-- Allow authenticated users to upload menu images
create policy "Authenticated can upload menu images"
on storage.objects for insert
with check (bucket_id = 'menu-images' and auth.role() = 'authenticated');
