'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

type CtaLink = { text: string; href: string };
type StatItem = { stat: string; label: string };
type MixLink = { label: string; href: string };
type MixItem = {
  title: string;
  artist: string;
  duration: string;
  date: string;
  videoUrl: string;
  thumbnail: string;
  links: MixLink[];
};
type FeaturedLink = { text: string; href: string };
type FeaturedContent = {
  title?: string;
  description?: string;
  links?: FeaturedLink[];
};
type VideoItem = { title: string; date: string };
type EventItem = { date: string; event: string; location: string; time: string };
type PageContent = {
  title?: string;
  subtitle?: string;
  description?: string;
  cta?: CtaLink[];
  stats?: StatItem[];
  mixes?: MixItem[];
  featured?: FeaturedContent;
  videos?: VideoItem[];
  events?: EventItem[];
};

const PAGE_OPTIONS = [
  { slug: 'home', label: 'Home' },
  { slug: 'mixes', label: 'Mixes' },
  { slug: 'about', label: 'About' },
  { slug: 'services', label: 'Services' },
  { slug: 'marketplace', label: 'Marketplace' },
  { slug: 'mixhub', label: 'Mixhub' },
  { slug: 'music-pool', label: 'Music Pool' },
  { slug: 'academy', label: 'Academy' },
];

export default function AdminContentEditor() {
  const { user } = useAuth();
  const [selectedSlug, setSelectedSlug] = useState('home');
  const [content, setContent] = useState<PageContent>({});
  const [jsonText, setJsonText] = useState('{}');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    void fetchPage(selectedSlug);
  }, [selectedSlug]);

  async function fetchPage(slug: string) {
    setStatus('Loading...');
    setError('');
    const res = await fetch(`/api/admin/page?slug=${slug}`);
    if (res.ok) {
      const json = await res.json();
      setContent((json || {}) as PageContent);
      setJsonText(JSON.stringify(json || {}, null, 2));
      setStatus('Loaded');
    } else {
      const empty = { title: '', description: '' };
      setContent(empty);
      setJsonText(JSON.stringify(empty, null, 2));
      setStatus('No content yet');
    }
  }

  function syncContent(next: PageContent) {
    setContent(next);
    setJsonText(JSON.stringify(next, null, 2));
  }

  async function save() {
    try {
      const parsed = JSON.parse(jsonText) as PageContent;
      setStatus('Saving...');
      setError('');
      const res = await fetch('/api/admin/page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: selectedSlug, content: parsed }),
      });
      if (res.ok) {
        setContent(parsed);
        setStatus('Saved successfully');
      } else {
        setError('Could not save content.');
        setStatus('Error');
      }
    } catch {
      setError('Invalid JSON. Fix it before saving.');
      setStatus('Error');
    }
  }

  function applyPreview() {
    try {
      const parsed = JSON.parse(jsonText) as PageContent;
      setContent(parsed);
      setError('');
      setStatus('Preview updated');
    } catch {
      setError('Invalid JSON. Preview failed.');
      setStatus('Error');
    }
  }

  function updateField(key: string, value: string) {
    syncContent({ ...content, [key]: value });
  }

  function updateCta(index: number, field: 'text' | 'href', value: string) {
    const next = { ...content };
    const cta = Array.isArray(next.cta) ? [...next.cta] : [];
    cta[index] = { ...(cta[index] || {}), [field]: value };
    next.cta = cta;
    syncContent(next);
  }

  function addCta() {
    const next = { ...content };
    const cta = Array.isArray(next.cta) ? [...next.cta] : [];
    cta.push({ text: 'New CTA', href: '/' });
    next.cta = cta;
    syncContent(next);
  }

  function removeCta(index: number) {
    const next = { ...content };
    const cta = Array.isArray(next.cta) ? [...next.cta] : [];
    cta.splice(index, 1);
    next.cta = cta;
    syncContent(next);
  }

  function updateStat(index: number, field: 'stat' | 'label', value: string) {
    const next = { ...content };
    const stats = Array.isArray(next.stats) ? [...next.stats] : [];
    stats[index] = { ...(stats[index] || {}), [field]: value };
    next.stats = stats;
    syncContent(next);
  }

  function addStat() {
    const next = { ...content };
    const stats = Array.isArray(next.stats) ? [...next.stats] : [];
    stats.push({ stat: 'New', label: 'Value' });
    next.stats = stats;
    syncContent(next);
  }

  function removeStat(index: number) {
    const next = { ...content };
    const stats = Array.isArray(next.stats) ? [...next.stats] : [];
    stats.splice(index, 1);
    next.stats = stats;
    syncContent(next);
  }

  function updateMix(index: number, field: 'title' | 'artist' | 'duration' | 'date' | 'videoUrl' | 'thumbnail', value: string) {
    const next = { ...content };
    const mixes = Array.isArray(next.mixes) ? [...next.mixes] : [];
    mixes[index] = { ...(mixes[index] || {}), [field]: value };
    next.mixes = mixes;
    syncContent(next);
  }

  function updateMixLink(index: number, linkIndex: number, field: 'label' | 'href', value: string) {
    const next = { ...content };
    const mixes = Array.isArray(next.mixes) ? [...next.mixes] : [];
    const links = Array.isArray(mixes[index]?.links) ? [...mixes[index].links] : [];
    links[linkIndex] = { ...(links[linkIndex] || {}), [field]: value };
    mixes[index] = { ...(mixes[index] || {}), links };
    next.mixes = mixes;
    syncContent(next);
  }

  function addMix() {
    const next = { ...content };
    const mixes = Array.isArray(next.mixes) ? [...next.mixes] : [];
    mixes.push({ title: 'New Mix', artist: 'DJ Wizzy', duration: '45m', date: 'Now', videoUrl: '', thumbnail: '', links: [{ label: 'YouTube', href: '/' }] });
    next.mixes = mixes;
    syncContent(next);
  }

  function removeMix(index: number) {
    const next = { ...content };
    const mixes = Array.isArray(next.mixes) ? [...next.mixes] : [];
    mixes.splice(index, 1);
    next.mixes = mixes;
    syncContent(next);
  }

  function addMixLink(index: number) {
    const next = { ...content };
    const mixes = Array.isArray(next.mixes) ? [...next.mixes] : [];
    const links = Array.isArray(mixes[index]?.links) ? [...mixes[index].links] : [];
    links.push({ label: 'New Link', href: '/' });
    mixes[index] = { ...(mixes[index] || {}), links };
    next.mixes = mixes;
    syncContent(next);
  }

  function removeMixLink(index: number, linkIndex: number) {
    const next = { ...content };
    const mixes = Array.isArray(next.mixes) ? [...next.mixes] : [];
    const links = Array.isArray(mixes[index]?.links) ? [...mixes[index].links] : [];
    links.splice(linkIndex, 1);
    mixes[index] = { ...(mixes[index] || {}), links };
    next.mixes = mixes;
    syncContent(next);
  }

  function updateFeaturedField(field: 'title' | 'description', value: string) {
    const next = { ...content };
    next.featured = { ...(next.featured || {}), [field]: value };
    syncContent(next);
  }

  function updateFeaturedLink(index: number, field: 'text' | 'href', value: string) {
    const next = { ...content };
    const links = Array.isArray(next.featured?.links) ? [...next.featured.links] : [];
    links[index] = { ...(links[index] || {}), [field]: value };
    next.featured = { ...(next.featured || {}), links };
    syncContent(next);
  }

  function addFeaturedLink() {
    const next = { ...content };
    const links = Array.isArray(next.featured?.links) ? [...next.featured.links] : [];
    links.push({ text: 'New Link', href: '/' });
    next.featured = { ...(next.featured || {}), links };
    syncContent(next);
  }

  function removeFeaturedLink(index: number) {
    const next = { ...content };
    const links = Array.isArray(next.featured?.links) ? [...next.featured.links] : [];
    links.splice(index, 1);
    next.featured = { ...(next.featured || {}), links };
    syncContent(next);
  }

  function updateVideo(index: number, field: 'title' | 'date', value: string) {
    const next = { ...content };
    const videos = Array.isArray(next.videos) ? [...next.videos] : [];
    videos[index] = { ...(videos[index] || {}), [field]: value };
    next.videos = videos;
    syncContent(next);
  }

  function addVideo() {
    const next = { ...content };
    const videos = Array.isArray(next.videos) ? [...next.videos] : [];
    videos.push({ title: 'New video', date: 'Now' });
    next.videos = videos;
    syncContent(next);
  }

  function removeVideo(index: number) {
    const next = { ...content };
    const videos = Array.isArray(next.videos) ? [...next.videos] : [];
    videos.splice(index, 1);
    next.videos = videos;
    syncContent(next);
  }

  function updateEvent(index: number, field: 'date' | 'event' | 'location' | 'time', value: string) {
    const next = { ...content };
    const events = Array.isArray(next.events) ? [...next.events] : [];
    events[index] = { ...(events[index] || {}), [field]: value };
    next.events = events;
    syncContent(next);
  }

  function addEvent() {
    const next = { ...content };
    const events = Array.isArray(next.events) ? [...next.events] : [];
    events.push({ date: 'TBD', event: 'New event', location: 'Location', time: 'Time' });
    next.events = events;
    syncContent(next);
  }

  function removeEvent(index: number) {
    const next = { ...content };
    const events = Array.isArray(next.events) ? [...next.events] : [];
    events.splice(index, 1);
    next.events = events;
    syncContent(next);
  }

  if (!user || user.name.toLowerCase() !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Access denied</h1>
        <p className="text-gray-400 mb-6">Log in as <span className="text-purple-400">admin</span> to use the editor.</p>
        <Link href="/login" className="inline-flex items-center justify-center rounded-full border border-purple-500/40 bg-purple-600/10 px-5 py-3 text-sm font-semibold text-purple-200 hover:bg-purple-600/20 transition">
          Go to Login
        </Link>
        <p className="mt-4 text-xs text-purple-300">Use email <strong>admin@admin.com</strong> and password <strong>admin</strong>.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="lg:w-56 shrink-0 rounded-2xl border border-purple-500/30 bg-black/40 p-4">
          <h2 className="text-lg font-semibold mb-4">Pages</h2>
          <div className="space-y-2">
            {PAGE_OPTIONS.map((page) => (
              <button
                key={page.slug}
                onClick={() => setSelectedSlug(page.slug)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${selectedSlug === page.slug ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
              >
                {page.label}
              </button>
            ))}
          </div>
        </aside>

        <main className="flex-1 space-y-6">
          <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-600/15 to-pink-600/10 p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-purple-400">Content editor</p>
                <h1 className="text-3xl font-bold">Edit {selectedSlug}</h1>
              </div>
              <div className="flex flex-wrap gap-3">
                <button onClick={save} className="rounded-full bg-purple-600 px-4 py-2 font-semibold text-white transition hover:bg-purple-500">Save</button>
                <button onClick={applyPreview} className="rounded-full border border-purple-500/40 px-4 py-2 font-semibold text-gray-200 transition hover:bg-white/10">Preview</button>
                <button onClick={() => void fetchPage(selectedSlug)} className="rounded-full border border-white/10 px-4 py-2 font-semibold text-gray-200 transition hover:bg-white/10">Reload</button>
              </div>
            </div>
            {status ? <p className="mt-4 text-sm text-gray-300">{status}</p> : null}
            {error ? <p className="mt-2 text-sm text-red-400">{error}</p> : null}
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <section className="rounded-2xl border border-purple-500/30 bg-black/40 p-5">
                <h2 className="mb-4 text-xl font-semibold">Core content</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block text-sm text-gray-300">
                    <span className="mb-2 block">Title</span>
                    <input value={content.title || ''} onChange={(e) => updateField('title', e.target.value)} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2" />
                  </label>
                  {content.subtitle !== undefined ? (
                    <label className="block text-sm text-gray-300">
                      <span className="mb-2 block">Subtitle</span>
                      <input value={content.subtitle || ''} onChange={(e) => updateField('subtitle', e.target.value)} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2" />
                    </label>
                  ) : null}
                </div>
                {content.description !== undefined ? (
                  <label className="mt-4 block text-sm text-gray-300">
                    <span className="mb-2 block">Description</span>
                    <textarea value={content.description || ''} onChange={(e) => updateField('description', e.target.value)} rows={4} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2" />
                  </label>
                ) : null}
              </section>

              {Array.isArray(content.cta) ? (
                <section className="rounded-2xl border border-purple-500/30 bg-black/40 p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Call to action links</h2>
                    <button onClick={addCta} className="rounded-full border border-purple-500/40 px-3 py-1 text-sm">Add CTA</button>
                  </div>
                  <div className="space-y-3">
                    {content.cta.map((item: { text?: string; href?: string }, index: number) => (
                      <div key={index} className="rounded-xl border border-white/10 bg-white/5 p-3">
                        <div className="grid gap-3 md:grid-cols-2">
                          <input value={item.text || ''} onChange={(e) => updateCta(index, 'text', e.target.value)} className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2" placeholder="Text" />
                          <input value={item.href || ''} onChange={(e) => updateCta(index, 'href', e.target.value)} className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2" placeholder="/route or https://" />
                        </div>
                        <button onClick={() => removeCta(index)} className="mt-3 text-sm text-red-400">Remove</button>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}

              {Array.isArray(content.stats) ? (
                <section className="rounded-2xl border border-purple-500/30 bg-black/40 p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Stats</h2>
                    <button onClick={addStat} className="rounded-full border border-purple-500/40 px-3 py-1 text-sm">Add stat</button>
                  </div>
                  <div className="space-y-3">
                    {content.stats.map((item: { stat?: string; label?: string }, index: number) => (
                      <div key={index} className="grid gap-3 rounded-xl border border-white/10 bg-white/5 p-3 md:grid-cols-2">
                        <input value={item.stat || ''} onChange={(e) => updateStat(index, 'stat', e.target.value)} className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2" placeholder="Stat" />
                        <input value={item.label || ''} onChange={(e) => updateStat(index, 'label', e.target.value)} className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2" placeholder="Label" />
                        <button onClick={() => removeStat(index)} className="text-sm text-red-400 md:col-span-2">Remove</button>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}

              {Array.isArray(content.mixes) ? (
                <section className="rounded-2xl border border-purple-500/30 bg-black/40 p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Mixes</h2>
                    <button onClick={addMix} className="rounded-full border border-purple-500/40 px-3 py-1 text-sm">Add mix</button>
                  </div>
                  <div className="space-y-4">
                    {content.mixes.map((mix, index) => (
                      <div key={index} className="rounded-xl border border-white/10 bg-white/5 p-3">
                        <div className="grid gap-3 md:grid-cols-2">
                          <input value={mix.title || ''} onChange={(e) => updateMix(index, 'title', e.target.value)} className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2" placeholder="Title" />
                          <input value={mix.artist || ''} onChange={(e) => updateMix(index, 'artist', e.target.value)} className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2" placeholder="Artist" />
                          <input value={mix.duration || ''} onChange={(e) => updateMix(index, 'duration', e.target.value)} className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2" placeholder="Duration" />
                          <input value={mix.date || ''} onChange={(e) => updateMix(index, 'date', e.target.value)} className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2" placeholder="Date" />
                          <input value={mix.videoUrl || ''} onChange={(e) => updateMix(index, 'videoUrl', e.target.value)} className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2" placeholder="YouTube video URL" />
                          <input value={mix.thumbnail || ''} onChange={(e) => updateMix(index, 'thumbnail', e.target.value)} className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2" placeholder="Thumbnail URL" />
                        </div>
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-gray-300">Links</h3>
                            <button onClick={() => addMixLink(index)} className="text-sm text-purple-400">Add link</button>
                          </div>
                          {(mix.links || []).map((link, linkIndex) => (
                            <div key={linkIndex} className="grid gap-2 rounded-lg border border-white/10 bg-black/20 p-2 md:grid-cols-[1fr_1fr_auto]">
                              <input value={link.label || ''} onChange={(e) => updateMixLink(index, linkIndex, 'label', e.target.value)} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2" placeholder="Label" />
                              <input value={link.href || ''} onChange={(e) => updateMixLink(index, linkIndex, 'href', e.target.value)} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2" placeholder="Link" />
                              <button onClick={() => removeMixLink(index, linkIndex)} className="text-sm text-red-400">Remove</button>
                            </div>
                          ))}
                        </div>
                        <button onClick={() => removeMix(index)} className="mt-3 text-sm text-red-400">Remove mix</button>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}

              {content.featured && typeof content.featured === 'object' ? (
                <section className="rounded-2xl border border-purple-500/30 bg-black/40 p-5">
                  <h2 className="mb-4 text-xl font-semibold">Featured section</h2>
                  <div className="space-y-3">
                    <input value={content.featured.title || ''} onChange={(e) => updateFeaturedField('title', e.target.value)} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2" placeholder="Title" />
                    <textarea value={content.featured.description || ''} onChange={(e) => updateFeaturedField('description', e.target.value)} rows={3} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2" placeholder="Description" />
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-300">Links</h3>
                        <button onClick={addFeaturedLink} className="text-sm text-purple-400">Add link</button>
                      </div>
                      {(content.featured.links || []).map((link, index) => (
                        <div key={index} className="grid gap-2 rounded-lg border border-white/10 bg-black/20 p-2 md:grid-cols-[1fr_1fr_auto]">
                          <input value={link.text || ''} onChange={(e) => updateFeaturedLink(index, 'text', e.target.value)} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2" placeholder="Text" />
                          <input value={link.href || ''} onChange={(e) => updateFeaturedLink(index, 'href', e.target.value)} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2" placeholder="Href" />
                          <button onClick={() => removeFeaturedLink(index)} className="text-sm text-red-400">Remove</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              ) : null}

              {Array.isArray(content.videos) ? (
                <section className="rounded-2xl border border-purple-500/30 bg-black/40 p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Videos</h2>
                    <button onClick={addVideo} className="rounded-full border border-purple-500/40 px-3 py-1 text-sm">Add video</button>
                  </div>
                  <div className="space-y-3">
                    {content.videos.map((video, index) => (
                      <div key={index} className="rounded-xl border border-white/10 bg-white/5 p-3">
                        <input value={video.title || ''} onChange={(e) => updateVideo(index, 'title', e.target.value)} className="mb-2 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2" placeholder="Title" />
                        <input value={video.date || ''} onChange={(e) => updateVideo(index, 'date', e.target.value)} className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2" placeholder="Date" />
                        <button onClick={() => removeVideo(index)} className="mt-3 text-sm text-red-400">Remove</button>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}

              {Array.isArray(content.events) ? (
                <section className="rounded-2xl border border-purple-500/30 bg-black/40 p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Events</h2>
                    <button onClick={addEvent} className="rounded-full border border-purple-500/40 px-3 py-1 text-sm">Add event</button>
                  </div>
                  <div className="space-y-3">
                    {content.events.map((event, index) => (
                      <div key={index} className="rounded-xl border border-white/10 bg-white/5 p-3">
                        <div className="grid gap-3 md:grid-cols-2">
                          <input value={event.date || ''} onChange={(e) => updateEvent(index, 'date', e.target.value)} className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2" placeholder="Date" />
                          <input value={event.event || ''} onChange={(e) => updateEvent(index, 'event', e.target.value)} className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2" placeholder="Event" />
                          <input value={event.location || ''} onChange={(e) => updateEvent(index, 'location', e.target.value)} className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2" placeholder="Location" />
                          <input value={event.time || ''} onChange={(e) => updateEvent(index, 'time', e.target.value)} className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2" placeholder="Time" />
                        </div>
                        <button onClick={() => removeEvent(index)} className="mt-3 text-sm text-red-400">Remove</button>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}
            </div>

            <div className="space-y-6">
              <section className="rounded-2xl border border-purple-500/30 bg-black/40 p-5">
                <h2 className="mb-4 text-xl font-semibold">Raw JSON</h2>
                <textarea value={jsonText} onChange={(e) => {
                  setJsonText(e.target.value);
                  setError('');
                }} rows={28} className="min-h-[420px] w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-mono text-sm" />
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
