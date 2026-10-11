create extension if not exists pgcrypto;

create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.vendors (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete set null,
  name text not null,
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  description text not null default '',
  status text not null default 'pending' check (status in ('pending', 'approved', 'suspended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references public.vendors(id) on delete cascade,
  name text not null,
  description text not null default '',
  price numeric(12, 2) not null check (price >= 0),
  currency text not null default 'USD' check (currency ~ '^[A-Z]{3}$'),
  category text not null default 'Equipment',
  is_rental boolean not null default false,
  images text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (vendor_id, name)
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists pages_set_updated_at on public.pages;
create trigger pages_set_updated_at
  before update on public.pages
  for each row execute function public.set_updated_at();

drop trigger if exists vendors_set_updated_at on public.vendors;
create trigger vendors_set_updated_at
  before update on public.vendors
  for each row execute function public.set_updated_at();

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

create index if not exists products_vendor_id_idx on public.products(vendor_id);
create index if not exists products_status_idx on public.products(status);

alter table public.pages enable row level security;
alter table public.vendors enable row level security;
alter table public.products enable row level security;

drop policy if exists "Published page content is readable" on public.pages;
create policy "Published page content is readable"
  on public.pages for select
  to anon, authenticated
  using (true);

drop policy if exists "Approved vendors are readable" on public.vendors;
create policy "Approved vendors are readable"
  on public.vendors for select
  to anon, authenticated
  using (status = 'approved');

drop policy if exists "Vendors can read their own vendor profile" on public.vendors;
create policy "Vendors can read their own vendor profile"
  on public.vendors for select
  to authenticated
  using (owner_id = auth.uid());

drop policy if exists "Published products from approved vendors are readable" on public.products;
create policy "Published products from approved vendors are readable"
  on public.products for select
  to anon, authenticated
  using (
    status = 'published'
    and exists (
      select 1 from public.vendors
      where vendors.id = products.vendor_id and vendors.status = 'approved'
    )
  );

drop policy if exists "Vendors can read their products" on public.products;
create policy "Vendors can read their products"
  on public.products for select
  to authenticated
  using (
    exists (
      select 1 from public.vendors
      where vendors.id = products.vendor_id and vendors.owner_id = auth.uid()
    )
  );

drop policy if exists "Vendors can create their products" on public.products;
create policy "Vendors can create their products"
  on public.products for insert
  to authenticated
  with check (
    exists (
      select 1 from public.vendors
      where vendors.id = products.vendor_id
        and vendors.owner_id = auth.uid()
        and vendors.status = 'approved'
    )
  );

drop policy if exists "Vendors can update their products" on public.products;
create policy "Vendors can update their products"
  on public.products for update
  to authenticated
  using (
    exists (
      select 1 from public.vendors
      where vendors.id = products.vendor_id and vendors.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.vendors
      where vendors.id = products.vendor_id and vendors.owner_id = auth.uid()
    )
  );

drop policy if exists "Vendors can delete their products" on public.products;
create policy "Vendors can delete their products"
  on public.products for delete
  to authenticated
  using (
    exists (
      select 1 from public.vendors
      where vendors.id = products.vendor_id and vendors.owner_id = auth.uid()
    )
  );

grant select on public.pages, public.vendors, public.products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;
grant all on public.pages, public.vendors, public.products to service_role;
