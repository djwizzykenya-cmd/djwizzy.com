'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

type MixLink = { label: string; href: string };
type Mix = {
  title: string;
  artist: string;
  duration: string;
  date: string;
  videoUrl?: string;
  thumbnail?: string;
  links?: MixLink[];
};
type HomeContent = {
  title: string;
  subtitle: string;
  cta: { text: string; href: string }[];
  stats: { stat: string; label: string }[];
  mixes: Mix[];
  featured: {
    title: string;
    description: string;
    links: { text: string; href: string }[];
  };
  videos: { title: string; date: string }[];
  events: { date: string; event: string; location: string; time: string }[];
};

export default function Home() {
  const [content, setContent] = useState<HomeContent | null>(null);
  const [playingMix, setPlayingMix] = useState<Mix | null>(null);
  const [enableHover, setEnableHover] = useState(false);

  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:v=|\/youtu\.be\/|\/embed\/)([A-Za-z0-9_-]{11})/);
    return match ? match[1] : undefined;
  };

  const getThumbnail = (mix: Mix) => {
    if (mix?.thumbnail) return mix.thumbnail;
    if (mix?.videoUrl) {
      const id = getYouTubeId(mix.videoUrl);
      return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : undefined;
    }
    return undefined;
  };

  const getEmbedUrl = (mix: Mix) => {
    if (!mix?.videoUrl) return undefined;
    const id = getYouTubeId(mix.videoUrl);
    return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : undefined;
  };

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const [homeRes, mixesRes] = await Promise.all([
          fetch('/api/admin/page?slug=home'),
          fetch('/api/admin/page?slug=mixes'),
        ]);
        const homeJson = homeRes.ok ? await homeRes.json() as HomeContent : null;
        const mixesJson = mixesRes.ok ? await mixesRes.json() : null;
        if (!mounted) return;
        if (homeJson) setContent(homeJson);
        if (Array.isArray(mixesJson?.mixes)) {
          setContent((prev) => ({
            ...(prev || homeJson || {}),
            mixes: mixesJson.mixes as Mix[],
          } as HomeContent));
        }
      } catch {
        // ignore
      }
    }
    load();
    if (typeof window !== 'undefined') {
      const mq = window.matchMedia('(min-width: 640px)');
      const onChange = () => setEnableHover(mq.matches);
      onChange();
      mq.addEventListener('change', onChange);
      const cleanup = () => {
        mq.removeEventListener('change', onChange);
      };
      return () => {
        mounted = false;
        cleanup();
      };
    }
    return () => {
      mounted = false;
    };
  }, []);

  const defaultPage: HomeContent = {
    title: 'DJ Wizzy - Your All-in-One DJ Ecosystem',
    subtitle: 'Find your perfect mix curated by DJ Wizzy - the #1 most subscribed DJ on the platform with millions of listeners worldwide.',
    cta: [
      { text: '🎵 Watch on MixHub', href: '/mixhub' },
      { text: '📥 Download Mixes', href: '/mixes' },
    ],
    stats: [
      { stat: '2M+', label: 'YouTube Subscribers' },
      { stat: '500+', label: 'Mixes Released' },
      { stat: '50M+', label: 'Total Plays' },
      { stat: '15+', label: 'Years in the Game' },
    ],
    mixes: [
      {
        title: 'Tech House Vibes Mix Vol 5',
        artist: 'DJ Wizzy',
        duration: '1h 23m',
        date: '2 weeks ago',
        videoUrl: 'https://youtu.be/4_Prw-N8pKM?si=08SzyhmLZRilwI5X',
        thumbnail: 'https://img.youtube.com/vi/4_Prw-N8pKM/hqdefault.jpg',
        links: [
          { label: 'Watch on YouTube', href: 'https://youtu.be/4_Prw-N8pKM?si=08SzyhmLZRilwI5X' },
          { label: 'Listen on SoundCloud', href: 'https://soundcloud.com/' },
          { label: 'Open Mixcloud', href: 'https://www.mixcloud.com/' },
        ],
      },
      {
        title: 'Afrobeats vs Amapiano Mix Vol 4',
        artist: 'DJ Wizzy',
        duration: '58m',
        date: '3 weeks ago',
        videoUrl: 'https://youtu.be/4_Prw-N8pKM?si=08SzyhmLZRilwI5X',
        thumbnail: 'https://img.youtube.com/vi/4_Prw-N8pKM/hqdefault.jpg',
        links: [
          { label: 'Watch on YouTube', href: 'https://youtu.be/4_Prw-N8pKM?si=08SzyhmLZRilwI5X' },
          { label: 'Stream on SoundCloud', href: 'https://soundcloud.com/' },
          { label: 'Open Mixcloud', href: 'https://www.mixcloud.com/' },
        ],
      },
      {
        title: 'Deep House Sessions Mix',
        artist: 'DJ Wizzy',
        duration: '1h 45m',
        date: '1 month ago',
        videoUrl: 'https://youtu.be/4_Prw-N8pKM?si=08SzyhmLZRilwI5X',
        thumbnail: 'https://img.youtube.com/vi/4_Prw-N8pKM/hqdefault.jpg',
        links: [
          { label: 'Watch on YouTube', href: 'https://youtu.be/4_Prw-N8pKM?si=08SzyhmLZRilwI5X' },
          { label: 'Listen on Mixcloud', href: 'https://www.mixcloud.com/' },
          { label: 'Stream on SoundCloud', href: 'https://soundcloud.com/' },
        ],
      },
    ],
    featured: {
      title: 'All I Do is I Win 🏆',
      description: "Experience the latest exclusive content from DJ Wizzy's performances, studio sessions, and behind-the-scenes moments.",
      links: [
        { text: '📺 YouTube', href: '#' },
        { text: '📱 Instagram', href: '#' },
      ],
    },
    videos: [
      { title: 'Tech House Mix - Live Session', date: '2 weeks ago' },
      { title: 'Afrobeats Festival Takeover', date: '3 weeks ago' },
      { title: 'Deep House Studio Session', date: '1 month ago' },
      { title: 'DJ Wizzy Weekly Mix #45', date: '1 month ago' },
    ],
    events: [
      { date: 'JUN 19', event: 'Summer Festival 2024', location: 'New York, USA', time: '10:00 pm' },
      { date: 'JUL 4', event: 'Independence Day Party', location: 'Los Angeles, USA', time: '9:00 pm' },
      { date: 'JUL 15', event: 'Beach Club Takeover', location: 'Miami, USA', time: '11:00 pm' },
      { date: 'AUG 2', event: 'Grand Festival Finale', location: 'Chicago, USA', time: '10:00 pm' },
    ],
  };
  const page: HomeContent = {
    ...defaultPage,
    ...content,
    cta: Array.isArray(content?.cta) ? content.cta : defaultPage.cta,
    stats: Array.isArray(content?.stats) ? content.stats : defaultPage.stats,
    mixes: Array.isArray(content?.mixes) ? content.mixes : defaultPage.mixes,
    featured: {
      ...defaultPage.featured,
      ...content?.featured,
      links: Array.isArray(content?.featured?.links)
        ? content.featured.links
        : defaultPage.featured.links,
    },
    videos: Array.isArray(content?.videos) ? content.videos : defaultPage.videos,
    events: Array.isArray(content?.events) ? content.events : defaultPage.events,
  };

  return (
    <div className="bg-black text-white">
      {/* HERO SECTION - Large DJ Name */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-black relative overflow-hidden py-20 sm:py-24">
        <div className="absolute inset-0 opacity-20 hidden sm:block">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-pink-600 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 text-center max-w-6xl mx-auto px-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 rounded-full border border-purple-500/40 bg-purple-500/10 px-4 py-2 text-sm text-purple-200 mb-6"
          >
            <span className="h-2.5 w-2.5 rounded-full bg-pink-500"></span>
            New releases • live sets • premium DJ experiences
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black mb-4 sm:mb-6 leading-none tracking-tighter" style={{ fontFamily: 'var(--font-caveat)' }}>
              <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                DJ WIZZY
              </span>
            </h1>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-semibold text-gray-200 mb-4 sm:mb-6"
          >
            {page.title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-400 mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            {page.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center"
          >
            {page.cta.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="px-5 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 font-bold text-sm sm:text-base md:text-lg rounded-full transition w-full sm:w-auto text-center shadow-lg shadow-purple-900/30"
              >
                {item.text}
              </Link>
            ))}
          </motion.div>
        </div>
      </section>

      {/* STATS BANNER */}
      <section className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 border-t border-b border-purple-600/30 py-10 sm:py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 text-center">
          {page.stats.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-white/10 bg-black/20 px-3 py-4 backdrop-blur-sm"
            >
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-400 mb-1">{item.stat}</p>
              <p className="text-gray-400 text-xs sm:text-sm md:text-base">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* LATEST MIXES SECTION */}
      <section className="py-16 sm:py-20 lg:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-10 sm:mb-16"
          >
            <p className="text-purple-400 uppercase tracking-[0.25em] text-xs sm:text-sm font-semibold mb-3">Newest releases</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-3">Latest Mixes</h2>
            <p className="text-gray-400 text-sm sm:text-base lg:text-lg">Fresh mixes from DJ Wizzy&apos;s collection</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-10 sm:mb-12">
            {page.mixes.map((mix, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="group bg-gradient-to-br from-black/80 to-purple-950/20 border border-purple-600/30 rounded-2xl overflow-hidden hover:border-purple-500 transition shadow-lg shadow-purple-950/20"
              >
                <div className="relative h-44 overflow-hidden bg-slate-900 sm:h-48">
                  <Image
                    src={getThumbnail(mix) || '/images/mix-placeholder.svg'}
                    alt={mix.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    loading={i === 0 ? 'eager' : 'lazy'}
                    unoptimized={!(getThumbnail(mix) || '').startsWith('https://img.youtube.com/')}
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/35"></div>
                  <button
                    type="button"
                    onClick={() => setPlayingMix(mix)}
                    className="absolute inset-0 flex items-center justify-center text-white"
                  >
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-purple-600/90 shadow-lg shadow-purple-950/50 text-2xl">▶</span>
                  </button>
                </div>
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold mb-2 group-hover:text-purple-400 transition">{mix.title}</h3>
                  <p className="text-sm text-gray-400 mb-4">by {mix.artist}</p>
                  <div className="flex justify-between text-xs text-gray-500 mb-4">
                    <span>{mix.duration}</span>
                    <span>{mix.date}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {(mix.links || []).map((action, j) => (
                      <a
                        key={j}
                        href={action.href || '#'}
                        target={action.href?.startsWith('http') ? '_blank' : undefined}
                        rel={action.href?.startsWith('http') ? 'noreferrer' : undefined}
                        className="py-2 text-[11px] sm:text-xs bg-purple-600/30 hover:bg-purple-600/50 rounded-full transition text-center"
                      >
                        {action.label}
                      </a>
                    ))}
                  </div>
                  {mix.videoUrl ? (
                    <button
                      onClick={() => setPlayingMix(mix)}
                      className="w-full rounded-full bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-500 transition"
                    >
                      Play Mix
                    </button>
                  ) : null}
                </div>
              </motion.div>
            ))}
          </div>

          <Link href="/mixes" className="inline-flex items-center px-6 py-3 border border-purple-500 hover:bg-purple-600/20 rounded-full font-bold transition">
            View All Mixes →
          </Link>
        </div>
      </section>

      {playingMix ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-6 sm:py-8">
          <div className="relative w-full max-w-[90vw] max-h-[90vh] overflow-hidden rounded-3xl bg-black shadow-2xl shadow-purple-950/50 sm:max-w-4xl">
            <button
              onClick={() => setPlayingMix(null)}
              className="absolute right-4 top-4 z-10 rounded-full bg-black/70 px-3 py-2 text-white hover:bg-black/90"
            >
              ✕
            </button>
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
            <div className="p-4 sm:p-6 text-white">
              <h3 className="text-xl sm:text-2xl font-bold mb-2">{playingMix.title}</h3>
              <p className="text-sm text-gray-300 mb-3">by {playingMix.artist}</p>
              <div className="flex flex-wrap gap-2 text-xs sm:text-sm text-gray-400">
                <span>{playingMix.duration}</span>
                <span>{playingMix.date}</span>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* FEATURED INSTAGRAM CONTENT */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 bg-gradient-to-b from-purple-900/20 to-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="h-72 sm:h-80 lg:h-96 rounded-[2rem] border border-purple-600/30 bg-gradient-to-br from-purple-600/20 to-pink-600/10 flex items-center justify-center shadow-2xl shadow-purple-950/20"
            >
              <div className="text-center px-4">
                <p className="text-6xl sm:text-7xl lg:text-8xl mb-4">📸</p>
                <p className="text-gray-400 text-base sm:text-lg">Featured Content</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-purple-400 uppercase tracking-[0.25em] text-xs sm:text-sm font-semibold mb-3">Behind the scenes</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 sm:mb-6">{page.featured?.title}</h2>
              <p className="text-gray-400 text-sm sm:text-base lg:text-lg leading-relaxed mb-6 sm:mb-8">{page.featured?.description}</p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                {page.featured.links.map((link, index) => (
                  <button key={index} className="px-5 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 font-bold rounded-full transition text-sm sm:text-base">
                    {link.text}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* LATEST YOUTUBE VIDEOS */}
      <section className="py-16 sm:py-20 lg:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-10 sm:mb-16"
          >
            <p className="text-purple-400 uppercase tracking-[0.25em] text-xs sm:text-sm font-semibold mb-3">Watch now</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-3">Latest YouTube Videos</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10 sm:mb-12">
            {page.videos.map((video, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="group cursor-pointer rounded-2xl border border-purple-600/20 bg-black/40 p-3 hover:border-purple-500 transition"
              >
                <div className="relative h-40 sm:h-44 bg-gradient-to-br from-purple-600/30 to-pink-600/20 rounded-xl overflow-hidden mb-4 flex items-center justify-center border border-purple-600/30 group-hover:border-purple-500 transition">
                  <span className="text-4xl sm:text-5xl group-hover:scale-110 transition">▶️</span>
                </div>
                <h3 className="font-bold text-sm sm:text-base mb-2 group-hover:text-purple-400 transition line-clamp-2">{video.title}</h3>
                <p className="text-xs sm:text-sm text-gray-500">Dj Wizzy • {video.date}</p>
              </motion.div>
            ))}
          </div>

          <button className="inline-flex items-center px-6 py-3 border border-purple-500 hover:bg-purple-600/20 rounded-full font-bold transition">
            Watch More →
          </button>
        </div>
      </section>

      {/* UPCOMING EVENTS */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 bg-gradient-to-b from-black to-purple-900/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-10 sm:mb-16"
          >
            <p className="text-purple-400 uppercase tracking-[0.25em] text-xs sm:text-sm font-semibold mb-3">Live appearances</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-3">Upcoming Events</h2>
            <p className="text-gray-400 text-sm sm:text-base lg:text-lg">Catch DJ Wizzy live at these upcoming events</p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 mb-10 sm:mb-12">
            {page.events.map((event, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="p-5 sm:p-6 bg-black/50 border border-purple-600/30 rounded-2xl hover:border-purple-500 transition cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-purple-400 font-bold text-base sm:text-lg">{event.date}</p>
                    <h3 className="text-xl sm:text-2xl font-bold">{event.event}</h3>
                  </div>
                  <span className="text-2xl sm:text-3xl">🎤</span>
                </div>
                <p className="text-gray-400 mb-4 text-sm sm:text-base">📍 {event.location}</p>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <span className="text-sm text-gray-500">🕒 {event.time}</span>
                  <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-full text-sm transition">
                    Get Tickets
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <button className="inline-flex items-center px-6 py-3 border border-purple-500 hover:bg-purple-600/20 rounded-full font-bold transition">
            See All Events →
          </button>
        </div>
      </section>

      {/* MERCHANDISE SECTION */}
      <section className="py-16 sm:py-20 lg:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-10 sm:mb-16"
          >
            <p className="text-purple-400 uppercase tracking-[0.25em] text-xs sm:text-sm font-semibold mb-3">Merch</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-3">Gear Up with DJ Wizzy</h2>
            <p className="text-gray-400 text-sm sm:text-base lg:text-lg">High-quality merch inspired by the beats you love</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10 sm:mb-12">
            {[
              { name: 'DJ Wizzy Shield T-Shirt', price: '$30.00' },
              { name: 'Premium Hoodie', price: '$59.99' },
              { name: 'Wizzy 3D FPS Hat', price: '$32.00' },
              { name: 'Limited Edition Bundle', price: '$89.99' },
            ].map((product, i) => (
              <motion.div
                key={i}
                whileHover={enableHover ? { y: -5 } : undefined}
                className="text-center rounded-2xl border border-purple-600/20 bg-black/40 p-4 hover:border-purple-500 transition"
              >
                <div className="h-44 sm:h-48 bg-gradient-to-br from-purple-600/20 to-pink-600/10 rounded-xl mb-4 flex items-center justify-center border border-purple-600/30">
                  <span className="text-5xl sm:text-6xl">👕</span>
                </div>
                <h3 className="font-bold text-base sm:text-lg mb-2">{product.name}</h3>
                <p className="text-purple-400 font-bold mb-4">{product.price}</p>
                <button className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-full transition font-bold text-sm sm:text-base">
                  Shop Now
                </button>
              </motion.div>
            ))}
          </div>

          <button className="inline-flex items-center px-6 py-3 border border-purple-500 hover:bg-purple-600/20 rounded-full font-bold transition">
            Shop All →
          </button>
        </div>
      </section>

      {/* EXPLORE DJ WIZZY'S WORLD */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 bg-gradient-to-b from-purple-900/20 to-black">
        <div className="max-w-7xl mx-auto">
          <p className="text-purple-400 uppercase tracking-[0.25em] text-center text-xs sm:text-sm font-semibold mb-3">Discover more</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-10 sm:mb-16 text-center">Explore DJ Wizzy&apos;s World</h2>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {[
              {
                title: 'MixHub Community',
                desc: 'Connect with DJs, share mixes, and build your reputation in the fastest-growing DJ community.',
                icon: '🎵',
                link: '/mixhub',
              },
              {
                title: 'DJ Academy',
                desc: 'Learn production, mixing techniques, and industry insights from professionals.',
                icon: '📚',
                link: '/academy',
              },
              {
                title: 'Merchandise Store',
                desc: 'Exclusive gear and apparel inspired by DJ Wizzy.',
                icon: '🛍️',
                link: '/marketplace',
              },
              {
                title: 'Booking & Services',
                desc: 'Book DJ Wizzy for your next event or explore professional DJ services.',
                icon: '🎤',
                link: '/services',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={enableHover ? { y: -5 } : undefined}
                className="p-5 sm:p-8 bg-black/50 border border-purple-600/30 rounded-2xl hover:border-purple-500 transition"
              >
                <p className="text-4xl sm:text-5xl mb-4">{item.icon}</p>
                <h3 className="text-xl sm:text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-400 mb-6 leading-relaxed text-sm sm:text-base">{item.desc}</p>
                <Link href={item.link} className="inline-flex items-center text-purple-400 hover:text-purple-300 font-bold transition">
                  Learn More →
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-16 sm:py-20 lg:py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-purple-400 uppercase tracking-[0.25em] text-center text-xs sm:text-sm font-semibold mb-3">Support</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-3 text-center">Frequently Asked Questions</h2>
          <p className="text-gray-400 text-center text-sm sm:text-base lg:text-lg mb-8 sm:mb-10">Everything you need to know before booking or connecting with DJ Wizzy.</p>

          <div className="space-y-4">
            {[
              { q: 'How can I book DJ Wizzy for an event?', a: 'Visit our Services page to submit a booking inquiry. We\'ll respond within 24 hours!' },
              { q: 'Do you offer wedding DJ services?', a: 'Yes! We specialize in wedding mixes and live DJ sets for your special day.' },
              { q: 'How can I download DJ Wizzy\'s mixes?', a: 'All mixes are available on the Mixes page with easy download options.' },
              { q: 'What types of events can DJ Wizzy perform at?', a: 'We perform at festivals, clubs, weddings, corporate events, and private parties.' },
              { q: 'How can I support DJ Wizzy?', a: 'Subscribe on YouTube, purchase merch, download mixes, and share the love!' },
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-5 sm:p-6 bg-gradient-to-r from-purple-600/15 to-pink-600/10 rounded-2xl border border-purple-600/20 hover:border-purple-500 transition cursor-pointer"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-base sm:text-lg group-hover:text-purple-400 transition mb-2">{faq.q}</h3>
                    <p className="text-gray-400 text-sm sm:text-base">{faq.a}</p>
                  </div>
                  <span className="text-xl sm:text-2xl text-purple-400">+</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
