import { createClient } from '@supabase/supabase-js';
import { loadEnvConfig } from '@next/env';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

loadEnvConfig(process.cwd());

type PageContent = Record<string, unknown> & {
  items?: Array<{
    name?: string;
    price?: string;
    type?: string;
    rent?: boolean;
    description?: string;
  }>;
};

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

async function main() {
  const supabase = createClient(
    requiredEnv('NEXT_PUBLIC_SUPABASE_URL'),
    requiredEnv('SUPABASE_SERVICE_ROLE_KEY'),
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
  const directory = path.join(process.cwd(), 'data', 'pages');
  const files = (await readdir(directory)).filter((file) => file.endsWith('.json'));
  const pages: Array<{ slug: string; content: PageContent; updated_at: string }> = [];

  for (const file of files) {
    const content = JSON.parse(await readFile(path.join(directory, file), 'utf8')) as PageContent;
    pages.push({
      slug: path.basename(file, '.json'),
      content,
      updated_at: new Date().toISOString(),
    });
  }

  const { error: pagesError } = await supabase.from('pages').upsert(pages, { onConflict: 'slug' });
  if (pagesError) throw new Error(`Could not import page JSON: ${pagesError.message}`);
  console.info(`Imported ${pages.length} page JSON file(s).`);

  const marketplace = pages.find((page) => page.slug === 'marketplace');
  const items = marketplace?.content.items ?? [];
  if (items.length === 0) {
    console.info('No marketplace items found; skipping initial product import.');
    return;
  }

  const { data: vendor, error: vendorError } = await supabase
    .from('vendors')
    .upsert(
      { name: 'DJ Wizzy', slug: 'dj-wizzy', description: 'Imported marketplace products', status: 'approved' },
      { onConflict: 'slug' },
    )
    .select('id')
    .single();
  if (vendorError) throw new Error(`Could not create import vendor: ${vendorError.message}`);

  const products = items.map((item) => {
    const priceText = item.price ?? '0';
    const currencySymbol = priceText.match(/^[^\d]+/)?.[0].trim();
    const currency = currencySymbol === '$' ? 'USD' : currencySymbol === '€' ? 'EUR' : currencySymbol === '£' ? 'GBP' : 'USD';

    return {
      vendor_id: vendor.id,
      name: item.name ?? 'Untitled product',
      description: item.description ?? '',
      price: Number(priceText.replace(/[^\d.]/g, '')) || 0,
      currency,
      category: item.type ?? 'Equipment',
      is_rental: item.rent ?? false,
      status: 'published',
    };
  });

  const { error: productsError } = await supabase
    .from('products')
    .upsert(products, { onConflict: 'vendor_id,name' });
  if (productsError) throw new Error(`Could not import marketplace products: ${productsError.message}`);
  console.info(`Imported ${products.length} marketplace product(s) for vendor DJ Wizzy.`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
