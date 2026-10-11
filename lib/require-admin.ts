import 'server-only';

import { NextResponse } from 'next/server';
import { getSupabaseAdminClient } from './supabase-admin';

export async function requireAdmin(request: Request): Promise<NextResponse | null> {
  const authorization = request.headers.get('authorization');
  const accessToken = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];

  if (!accessToken) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  }

  const { data, error } = await getSupabaseAdminClient().auth.getUser(accessToken);

  if (error || !data.user) {
    return NextResponse.json({ error: 'Invalid or expired session.' }, { status: 401 });
  }

  const appMetadata = data.user.app_metadata as Record<string, unknown>;
  if (appMetadata.role !== 'admin' && appMetadata.is_admin !== true) {
    return NextResponse.json({ error: 'Administrator access required.' }, { status: 403 });
  }

  return null;
}
