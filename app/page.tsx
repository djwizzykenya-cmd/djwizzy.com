'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Home() {
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    fetch('/api/admin/page?slug=home')
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json) setContent(json);
      })
      .catch(() => null);
  }, []);

  const page = content || {
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
        actions: ['Play mix', 'Watch on YouTube', 'Listen on SoundCloud', 'Download mix'],
      },
      {
        title: 'Afrobeats vs Amapiano Mix Vol 4',
        artist: 'DJ Wizzy',
        duration: '58m',
        date: '3 weeks ago',
        actions: ['Play mix', 'Watch on YouTube', 'Listen on SoundCloud', 'Download mix'],
      },
      {
        title: 'Deep House Sessions Mix',
        artist: 'DJ Wizzy',
        duration: '1h 45m',
        date: '1 month ago',
        actions: ['Play mix', 'Watch on YouTube', 'Listen on Mixcloud', 'Download mix'],
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

  return (
    <div className="bg-black text-white">
      {/* HERO SECTION - Large DJ Name */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 bg-black relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-20 hidden sm:block">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-pink-600 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 text-center max-w-6xl mx-auto px-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black mb-3 sm:mb-4 leading-none tracking-tighter" style={{ fontFamily: 'var(--font-caveat)' }}>
              <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                DJ WIZZY
              </span>
            </h1>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-gray-300 mb-4 sm:mb-8"
          >
            {page.title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-400 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            {page.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-6 justify-center"
          >
            {(page.cta || []).map((item: any, index: number) => (
              <Link
                key={index}
                href={item.href}
                className="px-4 sm:px-8 py-3 sm:py-4 bg-purple-600 hover:bg-purple-700 font-bold text-sm sm:text-base md:text-lg rounded-lg transition w-full sm:w-auto text-center"
              >
                {item.text}
              </Link>
            ))}
          </motion.div>
        </div>
      </section>

      {/* STATS BANNER */}
      <section className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 border-t border-b border-purple-600/30 py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {(page.stats || []).map((item: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <p className="text-3xl md:text-4xl font-bold text-purple-400 mb-2">{item.stat}</p>
              <p className="text-gray-400 text-sm md:text-base">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* LATEST MIXES SECTION */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-black mb-4">Latest Mixes</h2>
            <p className="text-gray-400 text-lg">Fresh mixes from DJ Wizzy's collection</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {(page.mixes || []).map((mix: any, i: number) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="group bg-black/50 border border-purple-600/30 rounded-xl overflow-hidden hover:border-purple-500 transition"
              >
                <div className="h-48 bg-gradient-to-br from-purple-600/20 to-pink-600/10 flex items-center justify-center cursor-pointer group-hover:from-purple-600/30 group-hover:to-pink-600/20 transition">
                  <svg className="w-20 h-20 text-purple-400 group-hover:scale-110 transition" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition">{mix.title}</h3>
                  <p className="text-sm text-gray-400 mb-4">by {mix.artist}</p>
                  <div className="flex justify-between text-xs text-gray-500 mb-4">
                    <span>{mix.duration}</span>
                    <span>{mix.date}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {(mix.actions || []).map((action: string, j: number) => (
                      <button key={j} className="py-2 text-xs bg-purple-600/30 hover:bg-purple-600/50 rounded transition">
                        {action}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <Link href="/mixes" className="inline-flex items-center px-6 py-3 border border-purple-500 hover:bg-purple-600/20 rounded-lg font-bold transition">
            View All Mixes →
          </Link>
        </div>
      </section>

      {/* FEATURED INSTAGRAM CONTENT */}
      <section className="py-24 px-4 bg-gradient-to-b from-purple-900/20 to-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="h-96 bg-gradient-to-br from-purple-600/20 to-pink-600/10 rounded-2xl border border-purple-600/30 flex items-center justify-center"
            >
              <div className="text-center">
                <p className="text-8xl mb-4">📸</p>
                <p className="text-gray-400 text-lg">Featured Content</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-6xl font-black mb-6">{page.featured?.title}</h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">{page.featured?.description}</p>
              <div className="flex gap-4">
                {(page.featured?.links || []).map((link: any, index: number) => (
                  <button key={index} className="px-6 py-3 bg-purple-600 hover:bg-purple-700 font-bold rounded-lg transition">
                    {link.text}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* LATEST YOUTUBE VIDEOS */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-black mb-4">Latest YouTube Videos</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {(page.videos || []).map((video: any, i: number) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="group cursor-pointer"
              >
                <div className="relative h-44 bg-gradient-to-br from-purple-600/30 to-pink-600/20 rounded-lg overflow-hidden mb-4 flex items-center justify-center border border-purple-600/30 group-hover:border-purple-500 transition">
                  <span className="text-5xl group-hover:scale-110 transition">▶️</span>
                </div>
                <h3 className="font-bold text-sm mb-2 group-hover:text-purple-400 transition line-clamp-2">{video.title}</h3>
                <p className="text-xs text-gray-500">Dj Wizzy • {video.date}</p>
              </motion.div>
            ))}
          </div>

          <button className="inline-flex items-center px-6 py-3 border border-purple-500 hover:bg-purple-600/20 rounded-lg font-bold transition">
            Watch More →
          </button>
        </div>
      </section>

      {/* UPCOMING EVENTS */}
      <section className="py-24 px-4 bg-gradient-to-b from-black to-purple-900/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-black mb-4">Upcoming Events</h2>
            <p className="text-gray-400 text-lg">Catch DJ Wizzy live at these upcoming events</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {(page.events || []).map((event: any, i: number) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="p-6 bg-black/50 border border-purple-600/30 rounded-xl hover:border-purple-500 transition cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-purple-400 font-bold text-lg">{event.date}</p>
                    <h3 className="text-2xl font-bold">{event.event}</h3>
                  </div>
                  <span className="text-3xl">🎤</span>
                </div>
                <p className="text-gray-400 mb-4">📍 {event.location}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">🕒 {event.time}</span>
                  <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm transition">
                    Get Tickets
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <button className="inline-flex items-center px-6 py-3 border border-purple-500 hover:bg-purple-600/20 rounded-lg font-bold transition">
            See All Events →
          </button>
        </div>
      </section>

      {/* MERCHANDISE SECTION */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-black mb-4">Gear Up with DJ Wizzy</h2>
            <p className="text-gray-400 text-lg">High-quality merch inspired by the beats you love</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { name: 'DJ Wizzy Shield T-Shirt', price: '$30.00' },
              { name: 'Premium Hoodie', price: '$59.99' },
              { name: 'Wizzy 3D FPS Hat', price: '$32.00' },
              { name: 'Limited Edition Bundle', price: '$89.99' },
            ].map((product, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="text-center"
              >
                <div className="h-48 bg-gradient-to-br from-purple-600/20 to-pink-600/10 rounded-lg mb-4 flex items-center justify-center border border-purple-600/30">
                  <span className="text-6xl">👕</span>
                </div>
                <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                <p className="text-purple-400 font-bold mb-4">{product.price}</p>
                <button className="w-full py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition font-bold">
                  Shop Now
                </button>
              </motion.div>
            ))}
          </div>

          <button className="inline-flex items-center px-6 py-3 border border-purple-500 hover:bg-purple-600/20 rounded-lg font-bold transition">
            Shop All →
          </button>
        </div>
      </section>

      {/* EXPLORE DJ WIZZY'S WORLD */}
      <section className="py-24 px-4 bg-gradient-to-b from-purple-900/20 to-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-black mb-16 text-center">Explore DJ Wizzy's World</h2>

          <div className="grid md:grid-cols-2 gap-12">
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
                whileHover={{ y: -5 }}
                className="p-8 bg-black/50 border border-purple-600/30 rounded-xl hover:border-purple-500 transition"
              >
                <p className="text-5xl mb-4">{item.icon}</p>
                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-400 mb-6 leading-relaxed">{item.desc}</p>
                <Link href={item.link} className="inline-flex items-center text-purple-400 hover:text-purple-300 font-bold transition">
                  Learn More →
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-black mb-16 text-center">Frequently Asked Questions</h2>

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
                className="p-6 bg-gradient-to-r from-purple-600/20 to-pink-600/10 rounded-lg border border-purple-600/30 hover:border-purple-500 transition cursor-pointer group"
              >
                <h3 className="font-bold text-lg group-hover:text-purple-400 transition mb-3">{faq.q}</h3>
                <p className="text-gray-400 text-sm">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
