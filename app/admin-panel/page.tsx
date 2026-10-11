'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AdminProductsEditor from '../components/AdminProductsEditor';

const PAGES = ['home', 'about', 'marketplace', 'mixes', 'mixhub', 'music-pool', 'academy', 'services'];
type PageContent = Record<string, unknown>;

export default function AdminPanel() {
  const { user, ready, getAccessToken } = useAuth();
  const [selected, setSelected] = useState<string | null>(null);
  const [newSlug, setNewSlug] = useState('');
  const [jsonText, setJsonText] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [section, setSection] = useState<'pages' | 'products'>('pages');

  useEffect(() => {
    if (selected) void fetchPage(selected);
  }, [selected]);

  async function adminRequest(input: RequestInfo | URL, init?: RequestInit) {
    const token = await getAccessToken();
    const headers = new Headers(init?.headers);
    headers.set('Authorization', `Bearer ${token}`);
    return fetch(input, { ...init, headers, cache: 'no-store' });
  }

  async function fetchPage(slug: string) {
    setStatus('Loading…');
    setError('');
    try {
      const response = await fetch(`/api/admin/page?slug=${encodeURIComponent(slug)}`, { cache: 'no-store' });
      if (response.status === 404) {
        setJsonText(JSON.stringify({ title: '', description: '' }, null, 2));
        setStatus('New page — save to create it.');
        return;
      }
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not load page content.');
      setJsonText(JSON.stringify(result, null, 2));
      setStatus('Loaded');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not load page content.');
      setStatus('');
    }
  }

  async function save() {
    if (!selected) return;
    try {
      const content = JSON.parse(jsonText) as PageContent;
      if (!content || typeof content !== 'object' || Array.isArray(content)) {
        throw new Error('Page content must be a JSON object.');
      }
      setStatus('Saving…');
      setError('');
      const response = await adminRequest('/api/admin/page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: selected, content }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not save content.');
      setStatus('Saved successfully');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not save content.');
      setStatus('Error');
    }
  }

  async function deletePage() {
    if (!selected || !window.confirm(`Delete the "${selected}" page content?`)) return;

    try {
      setStatus('Deleting…');
      setError('');
      const response = await adminRequest(`/api/admin/page?slug=${encodeURIComponent(selected)}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not delete page content.');
      setSelected(null);
      setJsonText('');
      setStatus('Page content deleted.');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not delete page content.');
      setStatus('Error');
    }
  }

  function createPage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const slug = newSlug.trim().toLowerCase();
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      setError('Use lowercase letters, numbers, and single hyphens for the page slug.');
      return;
    }
    setNewSlug('');
    setSelected(slug);
  }

  if (!ready) return <div className="p-8">Loading authentication…</div>;
  if (!user) return <div className="p-8">Sign in to access the admin panel.</div>;
  if (!user.isAdmin) return <div className="p-8">Administrator access required.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      <div className="mb-6 flex gap-3">
        <button
          type="button"
          onClick={() => setSection('pages')}
          className={`rounded px-4 py-2 ${section === 'pages' ? 'bg-purple-600' : 'bg-white/10'}`}
        >
          Page content
        </button>
        <button
          type="button"
          onClick={() => setSection('products')}
          className={`rounded px-4 py-2 ${section === 'products' ? 'bg-purple-600' : 'bg-white/10'}`}
        >
          Products
        </button>
      </div>

      {section === 'products' ? <AdminProductsEditor /> : (
        <div className="md:flex gap-6">
          <aside className="w-full md:w-56 shrink-0">
            <ul className="space-y-2 mb-5">
              {PAGES.map((slug) => (
                <li key={slug}>
                  <button
                    type="button"
                    onClick={() => setSelected(slug)}
                    className={`w-full text-left px-3 py-2 rounded ${selected === slug ? 'bg-purple-600 text-white' : 'hover:bg-black/40'}`}
                  >
                    {slug}
                  </button>
                </li>
              ))}
            </ul>
            <form onSubmit={createPage} className="space-y-2">
              <label htmlFor="new-page-slug" className="block text-sm text-gray-300">Create page</label>
              <input
                id="new-page-slug"
                value={newSlug}
                onChange={(event) => setNewSlug(event.target.value)}
                placeholder="page-slug"
                className="w-full rounded bg-black/40 px-3 py-2"
              />
              <button type="submit" className="w-full rounded bg-white/10 px-3 py-2">New page</button>
            </form>
          </aside>

          <main className="flex-1">
            {!selected && <p>Select a page to edit or create one.</p>}
            {selected && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="font-semibold text-xl">Editing: {selected}</h2>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => void fetchPage(selected)} className="rounded bg-gray-800 px-4 py-2">Reload</button>
                    <button type="button" onClick={() => void deletePage()} className="rounded bg-red-800 px-4 py-2">Delete page</button>
                  </div>
                </div>
                <p className="text-sm text-gray-400">Update the page’s JSON content. Changes are saved to Supabase.</p>
                <textarea
                  aria-label="Page JSON"
                  className="w-full h-[520px] p-3 bg-black/40 rounded text-xs font-mono"
                  value={jsonText}
                  onChange={(event) => setJsonText(event.target.value)}
                  spellCheck={false}
                />
                <button type="button" onClick={() => void save()} className="rounded bg-purple-600 px-4 py-2 text-white">
                  Save JSON
                </button>
                {status && <p role="status" className="text-sm text-gray-300">{status}</p>}
                {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
}
