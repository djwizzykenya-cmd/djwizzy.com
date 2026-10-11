import { NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '../../../lib/supabase-admin';

export const dynamic = 'force-dynamic';

const fallbackProducts = [
  {
    id: 'fallback-1',
    name: 'CDJ-3000',
    description: 'Professional performance media player.',
    price: '$3,500',
    type: 'Equipment',
    rent: true,
    images: [],
    vendor: { name: 'DJ Wizzy Studio', slug: 'dj-wizzy-studio', status: 'approved' },
  },
  {
    id: 'fallback-2',
    name: 'Pioneer DDJ-1000',
    description: 'Club-standard DJ controller with jog wheels.',
    price: '$899',
    type: 'Controller',
    rent: false,
    images: [],
    vendor: { name: 'DJ Wizzy Studio', slug: 'dj-wizzy-studio', status: 'approved' },
  },
  {
    id: 'fallback-3',
    name: 'Technics 1200',
    description: 'Iconic analog turntable for vinyl performances.',
    price: '$1,200',
    type: 'Turntable',
    rent: true,
    images: [],
    vendor: { name: 'DJ Wizzy Studio', slug: 'dj-wizzy-studio', status: 'approved' },
  },
];

export async function GET() {
  try {
    const { data, error } = await getSupabaseAdminClient()
      .from('products')
      .select('id, name, description, price, currency, category, is_rental, images, vendors!inner(name, slug, status)')
      .eq('status', 'published')
      .eq('vendors.status', 'approved')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase product read failed:', error.message);
      return NextResponse.json(fallbackProducts, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
    }

    const products = (data ?? []).map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: product.currency,
        maximumFractionDigits: 2,
      }).format(Number(product.price)),
      type: product.category,
      rent: product.is_rental,
      images: product.images,
      vendor: product.vendors,
    }));

    return NextResponse.json(products.length ? products : fallbackProducts, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
  } catch (error) {
    console.error('Product read configuration or runtime failure:', error);
    return NextResponse.json(fallbackProducts, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
  }
}
