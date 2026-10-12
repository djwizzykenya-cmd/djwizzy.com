'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AdminProductsEditor from '../components/AdminProductsEditor';

const PAGES = ['home', 'about', 'marketplace', 'mixes', 'mixhub', 'music-pool', 'academy', 'services'];
type PageContent = Record<string, unknown>;

export default function AdminPanel() {
  const { user, ready, getAccessToken } = useAuth();
  const [selected, setSelected] = useState<string | null>('home');
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

  if (!ready) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4">
        <p className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-sm text-gray-300">
          Checking administrator access…
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      {!user ? (
        <section className="mx-auto flex min-h-[55vh] max-w-lg flex-col items-center justify-center rounded-3xl border border-white/10 bg-[#111118]/90 p-8 text-center shadow-2xl shadow-black/30 sm:p-12">
          <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-2xl text-violet-200">✦</span>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-300">DJ Wizzy workspace</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-white">Admin sign in</h1>
          <p className="mt-3 max-w-sm text-sm leading-6 text-gray-400">Sign in with an administrator account to manage site pages and marketplace products.</p>
          <Link href="/login" className="mt-7 inline-flex min-h-11 items-center justify-center rounded-xl bg-violet-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300">
            Continue to sign in
          </Link>
        </section>
      ) : !user.isAdmin ? (
        <section className="mx-auto flex min-h-[55vh] max-w-lg flex-col items-center justify-center rounded-3xl border border-amber-300/15 bg-[#111118]/90 p-8 text-center shadow-2xl shadow-black/30 sm:p-12">
          <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-300/20 bg-amber-300/10 text-xl text-amber-200">!</span>
          <h1 className="text-3xl font-bold tracking-tight text-white">Administrator access required</h1>
          <p className="mt-3 max-w-sm text-sm leading-6 text-gray-400">You’re signed in as {user.email}, but this account doesn’t have permission to manage the site.</p>
          <Link href="/" className="mt-7 inline-flex min-h-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10">
            Back to website
          </Link>
        </section>
      ) : (
        <>
          <header className="mb-8 flex flex-col gap-6 border-b border-white/[0.08] pb-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-violet-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
                Admin workspace
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Good to see you, {user.name}</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400 sm:text-base">Manage your website content and marketplace from one place.</p>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.035] px-4 py-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-sm font-bold text-white">
                {user.name.slice(0, 1).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{user.email}</p>
                <p className="mt-0.5 text-xs text-gray-400">Administrator</p>
              </div>
            </div>
          </header>

          <div className="mb-7 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setSection('pages')}
              aria-pressed={section === 'pages'}
              className={`group flex min-h-[88px] items-center gap-4 rounded-2xl border p-4 text-left transition sm:p-5 ${
                section === 'pages'
                  ? 'border-violet-400/35 bg-violet-500/[0.12] shadow-lg shadow-violet-950/20'
                  : 'border-white/[0.08] bg-white/[0.025] hover:border-white/15 hover:bg-white/[0.05]'
              }`}
            >
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-semibold ${section === 'pages' ? 'bg-violet-400/15 text-violet-200' : 'bg-white/[0.06] text-gray-300'}`}>Aa</span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-white">Page content</span>
                <span className="mt-1 block text-sm text-gray-400">Edit and publish website pages</span>
              </span>
              <span className={`text-lg transition ${section === 'pages' ? 'text-violet-200' : 'text-gray-600 group-hover:text-gray-300'}`}>→</span>
            </button>
            <button
              type="button"
              onClick={() => setSection('products')}
              aria-pressed={section === 'products'}
              className={`group flex min-h-[88px] items-center gap-4 rounded-2xl border p-4 text-left transition sm:p-5 ${
                section === 'products'
                  ? 'border-fuchsia-400/35 bg-fuchsia-500/[0.1] shadow-lg shadow-fuchsia-950/20'
                  : 'border-white/[0.08] bg-white/[0.025] hover:border-white/15 hover:bg-white/[0.05]'
              }`}
            >
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg ${section === 'products' ? 'bg-fuchsia-400/15 text-fuchsia-200' : 'bg-white/[0.06] text-gray-300'}`}>◇</span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-white">Marketplace</span>
                <span className="mt-1 block text-sm text-gray-400">Manage products and listings</span>
              </span>
              <span className={`text-lg transition ${section === 'products' ? 'text-fuchsia-200' : 'text-gray-600 group-hover:text-gray-300'}`}>→</span>
            </button>
          </div>

          {section === 'products' ? (
            <AdminProductsEditor />
          ) : (
            <div className="grid gap-5 lg:grid-cols-[250px_minmax(0,1fr)] xl:gap-6">
              <aside className="self-start rounded-2xl border border-white/[0.08] bg-[#111118]/85 p-4 shadow-xl shadow-black/20 lg:sticky lg:top-24">
                <div className="mb-4 flex items-center justify-between px-2">
                  <div>
                    <h2 className="text-sm font-semibold text-white">Site pages</h2>
                    <p className="mt-1 text-xs text-gray-500">{PAGES.length} pages available</p>
                  </div>
                  <span className="rounded-lg bg-white/[0.06] px-2 py-1 text-xs font-medium text-gray-400">{PAGES.length}</span>
                </div>
                <ul className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 lg:grid-cols-1">
                  {PAGES.map((slug, index) => (
                    <li key={slug}>
                      <button
                        type="button"
                        onClick={() => setSelected(slug)}
                        aria-current={selected === slug ? 'page' : undefined}
                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm capitalize transition ${
                          selected === slug
                            ? 'bg-violet-500/15 font-semibold text-violet-100 ring-1 ring-inset ring-violet-400/20'
                            : 'text-gray-400 hover:bg-white/[0.05] hover:text-white'
                        }`}
                      >
                        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-semibold ${selected === slug ? 'bg-violet-400/15 text-violet-200' : 'bg-white/[0.05] text-gray-500'}`}>
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="truncate">{slug.replaceAll('-', ' ')}</span>
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="my-4 border-t border-white/[0.07]" />
                <form onSubmit={createPage} className="space-y-3">
                  <label htmlFor="new-page-slug" className="block px-1 text-xs font-semibold uppercase tracking-wider text-gray-400">Create a page</label>
                  <input
                    id="new-page-slug"
                    value={newSlug}
                    onChange={(event) => setNewSlug(event.target.value)}
                    placeholder="page-slug"
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/15"
                  />
                  <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2.5 text-sm font-semibold text-gray-200 transition hover:border-violet-400/30 hover:bg-violet-500/10 hover:text-white">
                    <span className="text-lg leading-none text-violet-300">+</span>
                    New page
                  </button>
                </form>
              </aside>

              <main className="min-w-0 space-y-5">
                {selected ? (
                  <>
                    <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111118]/85 shadow-xl shadow-black/20">
                      <div className="flex flex-col gap-5 border-b border-white/[0.07] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">Content editor</p>
                          <h2 className="mt-1.5 truncate text-2xl font-bold capitalize tracking-tight text-white">{selected.replaceAll('-', ' ')}</h2>
                          <p className="mt-1 text-sm text-gray-400">Edit the page data stored in Supabase.</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button type="button" onClick={() => void fetchPage(selected)} className="rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-sm font-medium text-gray-200 transition hover:bg-white/[0.08]">Reload</button>
                          <button type="button" onClick={() => void deletePage()} className="rounded-xl border border-red-400/15 bg-red-500/[0.07] px-3.5 py-2 text-sm font-medium text-red-200 transition hover:border-red-400/30 hover:bg-red-500/[0.12]">Delete page</button>
                        </div>
                      </div>

                      <div className="p-4 sm:p-6">
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <label htmlFor="page-json" className="text-sm font-semibold text-gray-200">Page JSON</label>
                          <span className="rounded-md border border-white/[0.07] bg-black/20 px-2 py-1 font-mono text-[11px] text-gray-500">JSON</span>
                        </div>
                        <textarea
                          id="page-json"
                          aria-label="Page JSON"
                          className="min-h-[420px] w-full resize-y rounded-xl border border-white/[0.08] bg-[#09090d] p-4 font-mono text-xs leading-6 text-violet-100 outline-none transition placeholder:text-gray-700 focus:border-violet-400/40 focus:ring-2 focus:ring-violet-500/10 sm:min-h-[540px] sm:text-[13px]"
                          value={jsonText}
                          onChange={(event) => setJsonText(event.target.value)}
                          spellCheck={false}
                          autoCapitalize="off"
                          autoCorrect="off"
                        />
                        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div className="min-h-5 text-sm">
                            {error ? <p role="alert" className="text-red-300">{error}</p> : status ? <p role="status" className="text-gray-400">{status}</p> : <p className="text-gray-500">Changes are saved to your site database.</p>}
                          </div>
                          <button type="button" onClick={() => void save()} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300">
                            <span aria-hidden="true">✓</span>
                            Save changes
                          </button>
                        </div>
                      </div>
                    </section>
                  </>
                ) : (
                  <section className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-[#111118]/60 p-8 text-center">
                    <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-xl text-violet-200">Aa</span>
                    <h2 className="text-lg font-semibold text-white">Choose a page to get started</h2>
                    <p className="mt-2 max-w-sm text-sm leading-6 text-gray-400">Select a page from the list to edit its content, or create a new page using the form.</p>
                  </section>
                )}
              </main>
            </div>
          )}
        </>
      )}
    </div>
  );
}
