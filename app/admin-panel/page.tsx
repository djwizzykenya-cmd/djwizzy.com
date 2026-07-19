'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const PAGES = ['home', 'about', 'marketplace', 'mixhub', 'music-pool', 'academy', 'services'];

export default function AdminPanel() {
  const { user } = useAuth();
  const [selected, setSelected] = useState<string | null>(null);
  const [content, setContent] = useState<any>(null);
  const [jsonText, setJsonText] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (selected) fetchPage(selected);
  }, [selected]);

  async function fetchPage(slug: string) {
    setStatus('loading');
    setError('');
    const res = await fetch(`/api/admin/page?slug=${slug}`);
    if (res.ok) {
      const json = await res.json();
      setContent(json);
      setJsonText(JSON.stringify(json, null, 2));
      setStatus('');
    } else {
      setContent({ title: '', description: '' });
      setJsonText(JSON.stringify({ title: '', description: '' }, null, 2));
      setStatus('');
    }
  }

  async function save() {
    if (!selected) return;
    try {
      const parsed = JSON.parse(jsonText);
      setStatus('saving');
      setError('');
      const res = await fetch('/api/admin/page', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug: selected, content: parsed }) });
      if (res.ok) {
        setContent(parsed);
        setStatus('saved');
      } else {
        setStatus('error');
      }
    } catch (err) {
      setError('Invalid JSON. Fix syntax before saving.');
      setStatus('error');
    }
  }

  function applyPreview() {
    try {
      const parsed = JSON.parse(jsonText);
      setContent(parsed);
      setError('');
      setStatus('preview');
      setTimeout(() => {
        setStatus((prev) => (prev === 'preview' ? '' : prev));
      }, 1200);
    } catch (err) {
      setError('Invalid JSON. Fix syntax before preview.');
      setStatus('error');
    }
  }

  if (!user || user.name.toLowerCase() !== 'admin') {
    return <div className="p-8">Access denied. Log in as <strong>admin</strong>.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      <div className="md:flex gap-6">
        <aside className="w-48">
          <ul className="space-y-2">
            {PAGES.map((p) => (
              <li key={p}>
                <button onClick={() => setSelected(p)} className={`w-full text-left px-3 py-2 rounded ${selected === p ? 'bg-purple-600 text-white' : 'hover:bg-black/40'}`}>
                  {p}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <main className="flex-1">
          {!selected && <p>Select a page to edit.</p>}

          {selected && (
            <div className="space-y-4">
              <div className="flex flex-col gap-3 mb-4">
                <h2 className="font-semibold text-xl">Editing: {selected}</h2>
                <p className="text-sm text-gray-400">You can edit fields directly or update the page JSON below.</p>
              </div>

              <div className="grid md:grid-cols-[1fr_1fr] gap-6">
                <div className="space-y-3">
                  <label className="block text-sm text-gray-300">Title</label>
                  <input className="w-full px-3 py-2 bg-black/40 rounded" value={content?.title || ''} onChange={(e) => {
                    const next = { ...content, title: e.target.value };
                    setContent(next);
                    setJsonText(JSON.stringify(next, null, 2));
                  }} />

                  <label className="block text-sm text-gray-300">Description</label>
                  <textarea className="w-full px-3 py-2 bg-black/40 rounded" rows={4} value={content?.description || ''} onChange={(e) => {
                    const next = { ...content, description: e.target.value };
                    setContent(next);
                    setJsonText(JSON.stringify(next, null, 2));
                  }} />

                  <div className="flex flex-wrap gap-3">
                    <button onClick={save} className="px-4 py-2 bg-purple-600 rounded text-white">Save JSON</button>
                    <button type="button" onClick={applyPreview} className="px-4 py-2 bg-gray-800 rounded text-white">Preview JSON</button>
                  </div>
                  {status && <p className="text-sm text-gray-400">{status}</p>}
                  {error && <p className="text-sm text-red-400">{error}</p>}
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Page JSON</label>
                  <textarea
                    className="w-full h-[420px] p-3 bg-black/40 rounded text-xs font-mono"
                    value={jsonText}
                    onChange={(e) => {
                      setJsonText(e.target.value);
                      setError('');
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
