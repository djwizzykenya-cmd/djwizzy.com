import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const slug = url.searchParams.get('slug');
  if (!slug) return NextResponse.json({ error: 'missing slug' }, { status: 400 });
  const file = path.join(process.cwd(), 'data', 'pages', `${slug}.json`);
  try {
    const raw = await fs.readFile(file, 'utf-8');
    const json = JSON.parse(raw);
    return NextResponse.json(json);
  } catch (e) {
    return NextResponse.json({ error: 'not found' }, { status: 404 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { slug, content } = body;
    if (!slug || !content) return NextResponse.json({ error: 'missing fields' }, { status: 400 });
    const dir = path.join(process.cwd(), 'data', 'pages');
    await fs.mkdir(dir, { recursive: true });
    const file = path.join(dir, `${slug}.json`);
    await fs.writeFile(file, JSON.stringify(content, null, 2), 'utf-8');
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
