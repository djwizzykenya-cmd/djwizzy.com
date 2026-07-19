'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function About() {
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    fetch('/api/admin/page?slug=about')
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json) setContent(json);
      })
      .catch(() => null);
  }, []);

  const page = content || {
    title: 'About Me & Portfolio',
    description: 'Learn about my journey as a DJ, past events, and what makes me stand out in the industry.',
    bioHeading: 'My Story',
    bioText: [
      "I'm a passionate DJ with over 10 years of experience in the industry. Starting from small clubs to major festivals, I've developed a unique style that blends electronic, hip-hop, and house music.",
      'My mission is to create unforgettable experiences through music and help other DJs succeed in their careers.',
    ],
    heroImage: '/images/about-hero.jpg',
    portfolioTitle: 'Past Events & Gallery',
    portfolioItems: [
      { title: 'Festival Takeover', subtitle: 'Main stage headline set', rating: '5.0/5', link: '/events/festival' },
      { title: 'Club Residency', subtitle: 'Weekly late night club sessions', rating: '4.9/5', link: '/events/club' },
      { title: 'Studio Session', subtitle: 'Exclusive production behind-the-scenes', rating: '5.0/5', link: '/events/studio' },
      { title: 'International Tour', subtitle: 'Sold-out show highlights', rating: '4.8/5', link: '/events/tour' },
      { title: 'VIP Experience', subtitle: 'Private event and VIP lounge', rating: '4.9/5', link: '/events/vip' },
      { title: 'Collab Release', subtitle: 'Featured artist collabs and drops', rating: '5.0/5', link: '/events/collab' },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-20 text-center">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
          {page.title}
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">{page.description}</p>
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-4">{page.bioHeading}</h2>
          {(page.bioText || []).map((paragraph: string, idx: number) => (
            <p key={idx} className="text-gray-300 mb-4 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
        <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/10 h-96 rounded-lg border border-purple-500/30 overflow-hidden">
          {page.heroImage ? (
            <img src={page.heroImage} alt="About DJ Wizzy" className="w-full h-full object-cover" />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">📸 Bio Photo Placeholder</div>
          )}
        </div>
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-3xl font-bold mb-12">{page.portfolioTitle}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {(page.portfolioItems || []).map((item: any, i: number) => (
            <a
              key={i}
              href={item.link || '#'}
              className="bg-gradient-to-br from-purple-600/20 to-pink-600/10 h-64 rounded-lg border border-purple-500/30 flex flex-col items-center justify-center hover:border-purple-500 transition"
            >
              <p className="text-gray-400 mb-2">{item.title}</p>
              <p className="text-sm text-gray-500 mb-3">{item.subtitle}</p>
              <p className="text-sm text-purple-300 font-semibold">{item.rating}</p>
            </a>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
