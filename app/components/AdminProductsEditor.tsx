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
    try {
      const data = await fetchData();
      setProducts(data.products);
      setVendors(data.vendors);
      setError('');
      setStatus('');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not load marketplace data.');
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
      });
    return () => {
      active = false;
    };
  }, [fetchData]);

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
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">Marketplace products</h2>
          <button
            type="button"
            onClick={() => {
              setForm({ ...emptyProduct, vendor_id: vendors[0]?.id ?? '' });
              setImageUrls('');
            }}
            className="rounded bg-white/10 px-3 py-2"
          >
            New product
          </button>
        </div>
        {products.length === 0 && <p className="text-sm text-gray-400">No products found.</p>}
        {products.map((product) => (
          <article key={product.id} className="flex flex-wrap items-center justify-between gap-3 rounded border border-white/10 p-4">
            <div>
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-sm text-gray-400">
                {product.vendors?.name ?? 'Vendor'} · {product.status} · {product.is_rental ? 'Rental' : 'Sale'}
              </p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => editProduct(product)} className="rounded bg-white/10 px-3 py-2">Edit</button>
              <button type="button" onClick={() => void deleteProduct(product.id)} className="rounded bg-red-800 px-3 py-2">Delete</button>
            </div>
          </article>
        ))}
      </section>

      <form onSubmit={save} className="space-y-4 rounded border border-purple-500/30 bg-black/30 p-5">
        <h2 className="text-xl font-semibold">{form.id ? 'Edit product' : 'Create product'}</h2>
        {vendors.length === 0 ? (
          <p className="text-sm text-yellow-300">Create or import an approved vendor before adding products.</p>
        ) : (
          <>
            <label className="block text-sm text-gray-300">
              Vendor
              <select required value={form.vendor_id} onChange={(event) => setForm({ ...form, vendor_id: event.target.value })} className="mt-1 w-full rounded bg-gray-900 px-3 py-2">
                <option value="">Select vendor</option>
                {vendors.map((vendor) => <option key={vendor.id} value={vendor.id}>{vendor.name} ({vendor.status})</option>)}
              </select>
            </label>
            <label className="block text-sm text-gray-300">
              Name
              <input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="mt-1 w-full rounded bg-black/40 px-3 py-2" />
            </label>
            <label className="block text-sm text-gray-300">
              Description
              <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="mt-1 w-full rounded bg-black/40 px-3 py-2" />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-sm text-gray-300">
                Price
                <input required min="0" step="0.01" type="number" value={form.price} onChange={(event) => setForm({ ...form, price: Number(event.target.value) })} className="mt-1 w-full rounded bg-black/40 px-3 py-2" />
              </label>
              <label className="block text-sm text-gray-300">
                Currency
                <input required maxLength={3} pattern="[A-Z]{3}" value={form.currency} onChange={(event) => setForm({ ...form, currency: event.target.value.toUpperCase() })} className="mt-1 w-full rounded bg-black/40 px-3 py-2" />
              </label>
            </div>
            <label className="block text-sm text-gray-300">
              Category
              <input value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} className="mt-1 w-full rounded bg-black/40 px-3 py-2" />
            </label>
            <label className="block text-sm text-gray-300">
              Image URLs (one per line)
              <textarea value={imageUrls} onChange={(event) => setImageUrls(event.target.value)} className="mt-1 w-full rounded bg-black/40 px-3 py-2" />
            </label>
            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.is_rental} onChange={(event) => setForm({ ...form, is_rental: event.target.checked })} />
                Rental
              </label>
              <label className="flex items-center gap-2 text-sm">
                Status
                <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as ProductForm['status'] })} className="rounded bg-gray-900 px-2 py-1">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </label>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={saving || vendors.length === 0} className="rounded bg-purple-600 px-4 py-2 disabled:opacity-60">
                {saving ? 'Saving…' : form.id ? 'Update product' : 'Create product'}
              </button>
              {form.id && <button type="button" onClick={() => { setForm({ ...emptyProduct, vendor_id: vendors[0]?.id ?? '' }); setImageUrls(''); }} className="rounded bg-white/10 px-4 py-2">Cancel edit</button>}
            </div>
          </>
        )}
        {status && <p role="status" className="text-sm text-green-300">{status}</p>}
        {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
      </form>
    </div>
  );
}
