import { NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '../../../../lib/supabase-admin';
import { requireAdmin } from '../../../../lib/require-admin';

export const dynamic = 'force-dynamic';

const currencies = /^[A-Z]{3}$/;
const statuses = new Set(['draft', 'published', 'archived']);

function validProduct(value: unknown): value is {
  id?: string;
  vendor_id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  category?: string;
  is_rental?: boolean;
  images?: string[];
  status: 'draft' | 'published' | 'archived';
} {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const product = value as Record<string, unknown>;
  return (
    (product.id === undefined || typeof product.id === 'string') &&
    typeof product.vendor_id === 'string' &&
    typeof product.name === 'string' &&
    product.name.trim().length > 0 &&
    (product.description === undefined || typeof product.description === 'string') &&
    typeof product.price === 'number' &&
    Number.isFinite(product.price) &&
    product.price >= 0 &&
    typeof product.currency === 'string' &&
    currencies.test(product.currency) &&
    (product.category === undefined || typeof product.category === 'string') &&
    (product.is_rental === undefined || typeof product.is_rental === 'boolean') &&
    (product.images === undefined ||
      (Array.isArray(product.images) && product.images.every((image) => typeof image === 'string'))) &&
    typeof product.status === 'string' &&
    statuses.has(product.status)
  );
}

function productFields(product: ReturnType<typeof readProduct>) {
  return {
    vendor_id: product.vendor_id,
    name: product.name.trim(),
    description: product.description ?? '',
    price: product.price,
    currency: product.currency,
    category: product.category ?? 'Equipment',
    is_rental: product.is_rental ?? false,
    images: product.images ?? [],
    status: product.status,
  };
}

function readProduct(value: unknown) {
  return value as {
    id?: string;
    vendor_id: string;
    name: string;
    description?: string;
    price: number;
    currency: string;
    category?: string;
    is_rental?: boolean;
    images?: string[];
    status: 'draft' | 'published' | 'archived';
  };
}

export async function GET(request: Request) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  const { data, error } = await getSupabaseAdminClient()
    .from('products')
    .select('id, vendor_id, name, description, price, currency, category, is_rental, images, status, created_at, updated_at, vendors(name, slug)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase admin product read failed:', error.message);
    return NextResponse.json({ error: 'Could not load products.' }, { status: 500 });
  }

  return NextResponse.json(data, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  const body: unknown = await request.json().catch(() => null);
  if (!validProduct(body) || body.id) {
    return NextResponse.json({ error: 'Valid product fields are required for creation.' }, { status: 400 });
  }

  const { data, error } = await getSupabaseAdminClient()
    .from('products')
    .insert(productFields(readProduct(body)))
    .select('id, vendor_id, name, description, price, currency, category, is_rental, images, status, created_at, updated_at')
    .single();

  if (error) {
    console.error('Supabase product create failed:', error.message);
    return NextResponse.json({ error: 'Could not create product.' }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201, headers: { 'Cache-Control': 'no-store, max-age=0' } });
}

export async function PATCH(request: Request) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  const body: unknown = await request.json().catch(() => null);
  if (!validProduct(body) || !body.id) {
    return NextResponse.json({ error: 'A product id and valid product fields are required.' }, { status: 400 });
  }

  const product = readProduct(body);
  const id = body.id;
  const { data, error } = await getSupabaseAdminClient()
    .from('products')
    .update({ ...productFields(product), updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('id, vendor_id, name, description, price, currency, category, is_rental, images, status, created_at, updated_at')
    .maybeSingle();

  if (error) {
    console.error('Supabase product update failed:', error.message);
    return NextResponse.json({ error: 'Could not update product.' }, { status: 500 });
  }
  if (!data) return NextResponse.json({ error: 'Product not found.' }, { status: 404 });

  return NextResponse.json(data, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
}

export async function DELETE(request: Request) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  const id = new URL(request.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Product id is required.' }, { status: 400 });

  const { error, count } = await getSupabaseAdminClient()
    .from('products')
    .delete({ count: 'exact' })
    .eq('id', id);

  if (error) {
    console.error('Supabase product delete failed:', error.message);
    return NextResponse.json({ error: 'Could not delete product.' }, { status: 500 });
  }
  if (count === 0) return NextResponse.json({ error: 'Product not found.' }, { status: 404 });

  return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
}
