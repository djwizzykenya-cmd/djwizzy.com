"use client";

import { useEffect, useState } from "react";
import { motion } from 'framer-motion';
import Image from 'next/image';

const defaultMixList = [
  {
    title: 'Tech House Vibes Mix Vol 5',
    description: 'A high-energy tech house set built for late-night crowds.',
    duration: '1h 23m',
    tags: ['House', 'Electronic'],
    videoUrl: 'https://youtu.be/4_Prw-N8pKM?si=08SzyhmLZRilwI5X',
    thumbnail: 'https://img.youtube.com/vi/4_Prw-N8pKM/hqdefault.jpg',
    links: [
      { label: 'YouTube', href: 'https://youtu.be/4_Prw-N8pKM?si=08SzyhmLZRilwI5X' },
      { label: 'SoundCloud', href: 'https://soundcloud.com/' },
      { label: 'Mixcloud', href: 'https://www.mixcloud.com/' },
    ],
  },
  {
    title: 'Afrobeats vs Amapiano Mix Vol 4',
    description: 'A vibrant blend of Afro rhythms and amapiano energy.',
    duration: '58m',
    tags: ['Afrobeats', 'Amapiano'],
    videoUrl: 'https://youtu.be/4_Prw-N8pKM?si=08SzyhmLZRilwI5X',
    thumbnail: 'https://img.youtube.com/vi/4_Prw-N8pKM/hqdefault.jpg',
    links: [
      { label: 'YouTube', href: 'https://youtu.be/4_Prw-N8pKM?si=08SzyhmLZRilwI5X' },
      { label: 'SoundCloud', href: 'https://soundcloud.com/' },
      { label: 'Mixcloud', href: 'https://www.mixcloud.com/' },
    ],
  },
  {
    title: 'Deep House Sessions Mix',
    description: 'Smooth deep house grooves for intimate, immersive listening.',
    duration: '1h 45m',
    tags: ['Deep House', 'Chill'],
    videoUrl: 'https://youtu.be/4_Prw-N8pKM?si=08SzyhmLZRilwI5X',
    thumbnail: 'https://img.youtube.com/vi/4_Prw-N8pKM/hqdefault.jpg',
    links: [
      { label: 'YouTube', href: 'https://youtu.be/4_Prw-N8pKM?si=08SzyhmLZRilwI5X' },
      { label: 'SoundCloud', href: 'https://soundcloud.com/' },
      { label: 'Mixcloud', href: 'https://www.mixcloud.com/' },
    ],
  },
];

type Mix = (typeof defaultMixList)[number];

function getYouTubeId(url: string) {
  const match = url.match(/(?:v=|\/youtu\.be\/|\/embed\/)([A-Za-z0-9_-]{11})/);
  return match ? match[1] : undefined;
}

function getEmbedUrl(mix: Mix) {
  if (!mix?.videoUrl) return undefined;
  const id = getYouTubeId(mix.videoUrl);
  return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : undefined;
}

export default function Mixes() {
  const [playingMix, setPlayingMix] = useState<Mix | null>(null);
  const [mixes, setMixes] = useState<Mix[]>(defaultMixList);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch('/api/admin/page?slug=mixes');
        if (!mounted) return;
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json?.mixes)) setMixes(json.mixes as Mix[]);
        }
      } catch {
        // ignore
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-20 text-center"
      >
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
          My Mixes
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Check out my curated mixes - House, Hip-Hop, Electronic, and more.
        </p>
      </motion.section>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mixes.map((mix, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -10 }}
            className="overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600/20 to-pink-600/10 border border-purple-500/30 hover:border-purple-500 transition group"
          >
            <div className="relative h-48 overflow-hidden bg-black">
              {mix.thumbnail ? (
                <>
                  <Image
                    src={mix.thumbnail}
                    alt={mix.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    unoptimized={!mix.thumbnail.startsWith('/') && !mix.thumbnail.startsWith('https://img.youtube.com/')}
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                </>
              ) : (
                <div className="h-48 w-full bg-gradient-to-br from-purple-600/20 to-pink-600/10 flex items-center justify-center" />
              )}
              <button
                type="button"
                onClick={() => setPlayingMix(mix)}
                className="absolute inset-0 flex items-center justify-center text-white"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-purple-600/90 shadow-lg shadow-purple-950/50 text-2xl">▶</span>
              </button>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-bold mb-2">{mix.title}</h3>
              <p className="text-sm text-gray-400 mb-4">{mix.description}</p>
              <p className="text-sm text-gray-300 mb-4">{mix.duration}</p>
              <div className="flex flex-wrap gap-2 text-sm mb-4">
                {mix.tags?.map((tag: string) => (
                  <span key={tag} className="px-2 py-1 bg-purple-600/30 rounded-full">{tag}</span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {mix.links?.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 text-sm rounded-full bg-purple-600/30 hover:bg-purple-600/50 transition"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setPlayingMix(mix)}
                className="w-full rounded-full bg-purple-600 px-4 py-3 text-sm font-semibold text-white hover:bg-purple-500 transition"
              >
                Play Mix
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {playingMix ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-6 sm:py-8">
          <div className="relative w-full max-w-[90vw] max-h-[90vh] overflow-hidden rounded-3xl bg-black shadow-2xl shadow-purple-950/50 sm:max-w-4xl">
            <button
              onClick={() => setPlayingMix(null)}
              className="absolute right-4 top-4 z-10 rounded-full bg-black/70 px-3 py-2 text-white hover:bg-black/90"
            >
              ✕
            </button>
            {getEmbedUrl(playingMix) ? (
              <div className="relative h-full w-full min-h-[180px] bg-black" style={{ aspectRatio: '16/9' }}>
                <iframe
                  className="h-full w-full"
                  src={getEmbedUrl(playingMix)}
                  title={playingMix.title}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="relative h-full w-full min-h-[180px] bg-black flex items-center justify-center" style={{ aspectRatio: '16/9' }}>
                <p className="text-gray-400">No video available for this mix</p>
              </div>
            )}
            <div className="p-4 sm:p-6 text-white">
              <h3 className="text-xl sm:text-2xl font-bold mb-2">{playingMix.title}</h3>
              <p className="text-sm text-gray-300 mb-3">{playingMix.description}</p>
              <div className="flex flex-wrap gap-2 text-xs sm:text-sm text-gray-400">
                <span>{playingMix.duration}</span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
