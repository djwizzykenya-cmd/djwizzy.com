'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';

type Vendor = { id: string; name: string; slug: string; status: string };
type Product = {
  id: string;
  vendor_id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  is_rental: boolean;
  images: string[];
  status: 'draft' | 'published' | 'archived';
  vendors?: { name: string; slug: string };
};

type ProductForm = Omit<Product, 'id' | 'vendors'> & { id?: string };
type ProductFilter = 'all' | Product['status'];

const PRODUCT_FILTERS: { value: ProductFilter; label: string }[] = [
  { value: 'all', label: 'All products' },
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Drafts' },
  { value: 'archived', label: 'Archived' },
];

const emptyProduct: ProductForm = {
  vendor_id: '',
  name: '',
  description: '',
  price: 0,
  currency: 'USD',
  category: 'Equipment',
  is_rental: false,
  images: [],
  status: 'draft',
};

export default function AdminProductsEditor() {
  const { getAccessToken } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [form, setForm] = useState<ProductForm>(emptyProduct);
  const [imageUrls, setImageUrls] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<ProductFilter>('all');

  const adminFetch = useCallback(async (url: string, init?: RequestInit) => {
    const token = await getAccessToken();
    const headers = new Headers(init?.headers);
    headers.set('Authorization', `Bearer ${token}`);
    return fetch(url, { ...init, headers, cache: 'no-store' });
  }, [getAccessToken]);

  const fetchData = useCallback(async () => {
    const [productsResponse, vendorsResponse] = await Promise.all([
      adminFetch('/api/admin/products'),
      adminFetch('/api/admin/vendors'),
    ]);
    const [productsBody, vendorsBody] = await Promise.all([
      productsResponse.json(),
      vendorsResponse.json(),
    ]);
    if (!productsResponse.ok) throw new Error(productsBody.error || 'Could not load products.');
    if (!vendorsResponse.ok) throw new Error(vendorsBody.error || 'Could not load vendors.');
    return {
      products: productsBody as Product[],
      vendors: vendorsBody as Vendor[],
    };
  }, [adminFetch]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchData();
      setProducts(data.products);
      setVendors(data.vendors);
      setError('');
      setStatus('');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not load marketplace data.');
    } finally {
      setLoading(false);
    }
  }, [fetchData]);

  useEffect(() => {
    let active = true;
    void fetchData()
      .then((data) => {
        if (!active) return;
        setProducts(data.products);
        setVendors(data.vendors);
        setError('');
      })
      .catch((cause: unknown) => {
        if (!active) return;
        setError(cause instanceof Error ? cause.message : 'Could not load marketplace data.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [fetchData]);

  const productCounts = products.reduce<Record<ProductFilter, number>>((counts, product) => {
    counts.all += 1;
    counts[product.status] += 1;
    return counts;
  }, { all: 0, published: 0, draft: 0, archived: 0 });
  const normalizedSearch = search.trim().toLowerCase();
  const filteredProducts = products.filter((product) => {
    const matchesFilter = filter === 'all' || product.status === filter;
    const matchesSearch = !normalizedSearch || [
      product.name,
      product.category,
      product.vendors?.name ?? '',
    ].some((value) => value.toLowerCase().includes(normalizedSearch));
    return matchesFilter && matchesSearch;
  });

  function editProduct(product: Product) {
    setForm({
      id: product.id,
      vendor_id: product.vendor_id,
      name: product.name,
      description: product.description,
      price: Number(product.price),
      currency: product.currency,
      category: product.category,
      is_rental: product.is_rental,
      images: product.images ?? [],
      status: product.status,
    });
    setImageUrls((product.images ?? []).join('\n'));
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError('');
    setStatus('');
    try {
      const { id, ...fields } = form;
      const payload = {
        ...fields,
        images: imageUrls.split('\n').map((url) => url.trim()).filter(Boolean),
      };
      const response = await adminFetch('/api/admin/products', {
        method: id ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(id ? { ...payload, id } : payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not save product.');
      setForm({ ...emptyProduct, vendor_id: vendors[0]?.id ?? '' });
      setImageUrls('');
      setStatus(id ? 'Product updated.' : 'Product created.');
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not save product.');
    } finally {
      setSaving(false);
    }
  }

  async function deleteProduct(id: string) {
    if (!window.confirm('Delete this product?')) return;
    try {
      const response = await adminFetch(`/api/admin/products?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not delete product.');
      setStatus('Product deleted.');
      if (form.id === id) {
        setForm({ ...emptyProduct, vendor_id: vendors[0]?.id ?? '' });
        setImageUrls('');
      }
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not delete product.');
    }
  }

  return (
    <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] xl:gap-6">
      <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111118]/85 shadow-xl shadow-black/20">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.07] p-5 sm:p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-300">Inventory</p>
            <h2 className="mt-1.5 text-xl font-bold text-white">Marketplace products</h2>
            <p className="mt-1 text-sm text-gray-400">
              {loading ? 'Syncing your catalog…' : `${products.length} ${products.length === 1 ? 'listing' : 'listings'} in your catalog`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setForm({ ...emptyProduct, vendor_id: vendors[0]?.id ?? '' });
              setImageUrls('');
            }}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-950/25 transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300"
          >
            <span aria-hidden="true" className="text-lg leading-none">+</span>
            New product
          </button>
        </div>
        <div className="space-y-3 p-4 sm:p-5">
          {error && (
            <p role="alert" className="rounded-xl border border-red-400/20 bg-red-500/[0.08] px-4 py-3 text-sm text-red-200">{error}</p>
          )}
          {status && (
            <p role="status" className="rounded-xl border border-emerald-400/20 bg-emerald-500/[0.07] px-4 py-3 text-sm text-emerald-200">{status}</p>
          )}
          {!loading && products.length > 0 && (
            <div className="space-y-3 pb-1">
              <label className="relative block">
                <span className="sr-only">Search products</span>
                <span aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-500">⌕</span>
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search products, categories, or vendors"
                  className="min-h-11 w-full rounded-xl border border-white/[0.08] bg-black/20 py-2.5 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-violet-400/40 focus:ring-2 focus:ring-violet-500/10"
                />
              </label>
              <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter products by status">
                {PRODUCT_FILTERS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFilter(option.value)}
                    aria-pressed={filter === option.value}
                    className={`inline-flex min-h-9 shrink-0 items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                      filter === option.value
                        ? 'border-violet-400/25 bg-violet-500/10 text-violet-100'
                        : 'border-white/[0.07] bg-white/[0.02] text-gray-400 hover:bg-white/[0.06] hover:text-gray-200'
                    }`}
                  >
                    {option.label}
                    <span className={`rounded-md px-1.5 py-0.5 text-[10px] ${filter === option.value ? 'bg-violet-400/15 text-violet-100' : 'bg-white/[0.06] text-gray-500'}`}>
                      {productCounts[option.value]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
          {loading ? (
            <div className="space-y-3" aria-label="Loading products" role="status">
              {[0, 1, 2].map((item) => (
                <div key={item} className="h-[104px] animate-pulse rounded-xl border border-white/[0.06] bg-white/[0.025]" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex min-h-52 flex-col items-center justify-center rounded-xl border border-dashed border-white/10 px-5 text-center">
              <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.05] text-xl text-gray-400">◇</span>
              <h3 className="font-semibold text-white">No products yet</h3>
              <p className="mt-1 max-w-xs text-sm leading-6 text-gray-400">Create your first listing to add it to the marketplace catalog.</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed border-white/10 px-5 text-center">
              <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.05] text-xl text-gray-400">⌕</span>
              <h3 className="font-semibold text-white">No matching products</h3>
              <p className="mt-1 max-w-xs text-sm leading-6 text-gray-400">Try another search or status filter.</p>
              <button type="button" onClick={() => { setSearch(''); setFilter('all'); }} className="mt-4 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-gray-200 transition hover:bg-white/[0.08]">
                Clear filters
              </button>
            </div>
          ) : filteredProducts.map((product) => (
            <article key={product.id} className="group rounded-xl border border-white/[0.07] bg-white/[0.025] p-4 transition hover:border-white/[0.13] hover:bg-white/[0.04]">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex min-w-0 items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-fuchsia-300/10 bg-fuchsia-400/[0.07] text-lg text-fuchsia-200">◇</span>
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-white">{product.name}</h3>
                    <p className="mt-1 truncate text-sm text-gray-400">{product.vendors?.name ?? 'Vendor'} · {product.category}</p>
                    <div className="mt-2.5 flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-gray-200">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: product.currency, maximumFractionDigits: 2 }).format(Number(product.price))}
                      </span>
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium capitalize ${
                        product.status === 'published'
                          ? 'bg-emerald-400/10 text-emerald-200'
                          : product.status === 'archived'
                            ? 'bg-gray-400/10 text-gray-300'
                            : 'bg-amber-300/10 text-amber-200'
                      }`}>{product.status}</span>
                      <span className="rounded-full border border-white/[0.08] px-2.5 py-1 text-[11px] text-gray-400">{product.is_rental ? 'Rental' : 'For sale'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button type="button" onClick={() => editProduct(product)} className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-gray-200 transition hover:bg-white/10">Edit</button>
                  <button type="button" onClick={() => void deleteProduct(product.id)} className="rounded-lg border border-red-400/15 bg-red-500/[0.06] px-3 py-2 text-xs font-semibold text-red-200 transition hover:border-red-400/30 hover:bg-red-500/[0.12]">Delete</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <form onSubmit={save} className="space-y-5 rounded-2xl border border-white/[0.08] bg-[#111118]/85 p-5 shadow-xl shadow-black/20 sm:p-6">
        <div className="border-b border-white/[0.07] pb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">Product details</p>
          <h2 className="mt-1.5 text-xl font-bold text-white">{form.id ? 'Edit product' : 'Create product'}</h2>
          <p className="mt-1 text-sm text-gray-400">Add listing details and set its marketplace visibility.</p>
        </div>
        {vendors.length === 0 ? (
          <p className="rounded-xl border border-amber-300/20 bg-amber-300/[0.06] px-4 py-3 text-sm leading-6 text-amber-100">Create or import an approved vendor before adding products.</p>
        ) : (
          <>
            <label className="block text-sm font-medium text-gray-300">
              Vendor
              <select required value={form.vendor_id} onChange={(event) => setForm({ ...form, vendor_id: event.target.value })} className="mt-2 w-full rounded-xl border border-white/10 bg-[#09090d] px-3 py-2.5 text-sm text-white outline-none transition focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/15">
                <option value="">Select vendor</option>
                {vendors.map((vendor) => <option key={vendor.id} value={vendor.id}>{vendor.name} ({vendor.status})</option>)}
              </select>
            </label>
            <label className="block text-sm font-medium text-gray-300">
              Name
              <input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="mt-2 w-full rounded-xl border border-white/10 bg-[#09090d] px-3 py-2.5 text-sm text-white outline-none transition focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/15" />
            </label>
            <label className="block text-sm font-medium text-gray-300">
              Description
              <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} rows={3} className="mt-2 w-full rounded-xl border border-white/10 bg-[#09090d] px-3 py-2.5 text-sm text-white outline-none transition focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/15" />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-sm font-medium text-gray-300">
                Price
                <input required min="0" step="0.01" type="number" value={form.price} onChange={(event) => setForm({ ...form, price: Number(event.target.value) })} className="mt-2 w-full rounded-xl border border-white/10 bg-[#09090d] px-3 py-2.5 text-sm text-white outline-none transition focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/15" />
              </label>
              <label className="block text-sm font-medium text-gray-300">
                Currency
                <input required maxLength={3} pattern="[A-Z]{3}" value={form.currency} onChange={(event) => setForm({ ...form, currency: event.target.value.toUpperCase() })} className="mt-2 w-full rounded-xl border border-white/10 bg-[#09090d] px-3 py-2.5 text-sm text-white outline-none transition focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/15" />
              </label>
            </div>
            <label className="block text-sm font-medium text-gray-300">
              Category
              <input value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} className="mt-2 w-full rounded-xl border border-white/10 bg-[#09090d] px-3 py-2.5 text-sm text-white outline-none transition focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/15" />
            </label>
            <label className="block text-sm font-medium text-gray-300">
              Image URLs (one per line)
              <textarea value={imageUrls} onChange={(event) => setImageUrls(event.target.value)} rows={3} placeholder="https://example.com/image.jpg" className="mt-2 w-full rounded-xl border border-white/10 bg-[#09090d] px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/15" />
            </label>
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3">
              <label className="flex items-center gap-2.5 text-sm text-gray-300">
                <input type="checkbox" checked={form.is_rental} onChange={(event) => setForm({ ...form, is_rental: event.target.checked })} />
                Available for rental
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-300">
                <span>Status</span>
                <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as ProductForm['status'] })} className="rounded-lg border border-white/10 bg-[#09090d] px-2.5 py-1.5 text-sm text-white outline-none focus:border-violet-400/50">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </label>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={saving || vendors.length === 0} className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-950/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60">
                {saving ? 'Saving…' : form.id ? 'Update product' : 'Create product'}
              </button>
              {form.id && <button type="button" onClick={() => { setForm({ ...emptyProduct, vendor_id: vendors[0]?.id ?? '' }); setImageUrls(''); }} className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-gray-200 transition hover:bg-white/[0.08]">Cancel</button>}
            </div>
          </>
        )}
      </form>
    </div>
  );
}
