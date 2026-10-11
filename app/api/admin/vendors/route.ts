import { NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '../../../../lib/supabase-admin';
import { requireAdmin } from '../../../../lib/require-admin';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  const { data, error } = await getSupabaseAdminClient()
    .from('vendors')
    .select('id, name, slug, description, status')
    .order('name');

  if (error) {
    console.error('Supabase admin vendor read failed:', error.message);
    return NextResponse.json({ error: 'Could not load vendors.' }, { status: 500 });
  }

  return NextResponse.json(data, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
}
