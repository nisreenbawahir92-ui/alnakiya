-- Idempotent schema for Al Nakiya Trading
-- Safe to re-run in the Supabase SQL editor.

create table if not exists public.content (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  content text,
  category text not null,
  image_url text,
  is_published boolean not null default true,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists content_category_idx
  on public.content (category);

create index if not exists content_published_at_idx
  on public.content (published_at desc)
  where is_published = true;

alter table public.content enable row level security;

drop policy if exists "Published content is publicly readable" on public.content;
create policy "Published content is publicly readable"
  on public.content
  for select
  using (is_published = true);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  short_description text,
  sku text,
  price numeric(12, 2),
  regular_price numeric(12, 2),
  sale_price numeric(12, 2),
  currency text not null default 'AED',
  stock_status text not null default 'instock',
  stock_quantity integer,
  image_url text,
  gallery jsonb not null default '[]'::jsonb,
  categories jsonb not null default '[]'::jsonb,
  brands jsonb not null default '[]'::jsonb,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_published_idx
  on public.products (created_at desc)
  where is_published = true;

create table if not exists public.product_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  created_at timestamptz not null default now()
);

alter table public.product_categories enable row level security;

drop policy if exists "Product categories are publicly readable" on public.product_categories;
drop policy if exists "Admins can insert product categories" on public.product_categories;
drop policy if exists "Admins can update product categories" on public.product_categories;
drop policy if exists "Admins can delete product categories" on public.product_categories;

create policy "Product categories are publicly readable"
  on public.product_categories
  for select
  using (true);

create policy "Admins can insert product categories"
  on public.product_categories
  for insert
  to authenticated
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "Admins can update product categories"
  on public.product_categories
  for update
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "Admins can delete product categories"
  on public.product_categories
  for delete
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

alter table public.products enable row level security;

drop policy if exists "Published products are publicly readable" on public.products;
drop policy if exists "Admins can insert products" on public.products;
drop policy if exists "Admins can update products" on public.products;
drop policy if exists "Admins can delete products" on public.products;

create policy "Published products are publicly readable"
  on public.products
  for select
  using (
    is_published = true
    or (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

create policy "Admins can insert products"
  on public.products
  for insert
  to authenticated
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "Admins can update products"
  on public.products
  for update
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "Admins can delete products"
  on public.products
  for delete
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create table if not exists public.product_overrides (
  legacy_id text primary key,
  product_data jsonb not null default '{}'::jsonb,
  is_deleted boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.product_overrides enable row level security;

drop policy if exists "Product overrides are publicly readable" on public.product_overrides;
drop policy if exists "Admins can insert product overrides" on public.product_overrides;
drop policy if exists "Admins can update product overrides" on public.product_overrides;
drop policy if exists "Admins can delete product overrides" on public.product_overrides;

create policy "Product overrides are publicly readable"
  on public.product_overrides
  for select
  using (true);

create policy "Admins can insert product overrides"
  on public.product_overrides
  for insert
  to authenticated
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "Admins can update product overrides"
  on public.product_overrides
  for update
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "Admins can delete product overrides"
  on public.product_overrides
  for delete
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 100),
  email text not null,
  phone text,
  message text not null check (char_length(message) between 10 and 3000),
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

drop policy if exists "Admins can read contact messages" on public.contact_messages;
create policy "Admins can read contact messages"
  on public.contact_messages
  for select
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Product images are publicly readable" on storage.objects;
drop policy if exists "Admins can upload product images" on storage.objects;
drop policy if exists "Admins can update product images" on storage.objects;
drop policy if exists "Admins can delete product images" on storage.objects;

create policy "Product images are publicly readable"
  on storage.objects
  for select
  using (bucket_id = 'product-images');

create policy "Admins can upload product images"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'product-images'
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

create policy "Admins can update product images"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'product-images'
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

create policy "Admins can delete product images"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'product-images'
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );
