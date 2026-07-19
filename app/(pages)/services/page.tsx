'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Services() {
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    fetch('/api/admin/page?slug=services')
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json) setContent(json);
      })
      .catch(() => null);
  }, []);

  const page = content || {
    title: 'My Services',
    description: "From live DJ sets to custom mixes and more. Let's create something amazing together.",
    cards: [
      {
        title: 'Live DJing',
        desc: 'Book me for weddings, parties, clubs, and corporate events.',
        price: '$500+',
        href: '/services/live-djing',
        buttonText: 'Learn',
      },
      {
        title: 'Custom Mixing',
        desc: 'Get a personalized mix tailored to your event or mood.',
        price: '$100+',
        href: '/services/custom-mixing',
        buttonText: 'Learn',
      },
      {
        title: 'Website Creation',
        desc: 'I build professional DJ websites for other creators.',
        price: '$500+',
        href: '/services/website-creation',
        buttonText: 'Learn',
      },
      {
        title: 'Training & Consultation',
        desc: 'Learn DJing techniques and industry tips from me.',
        price: '$200+',
        href: '/services/training-consultation',
        buttonText: 'Learn',
      },
      {
        title: 'Music Production',
        desc: 'Get original tracks and remixes created for you.',
        price: '$300+',
        href: '/services/music-production',
        buttonText: 'Learn',
      },
      {
        title: 'Event Planning',
        desc: 'Let me plan the perfect music experience for your event.',
        price: 'Quote',
        href: '/services/event-planning',
        buttonText: 'Book',
      },
    ],
    contactTitle: 'Ready to Book?',
    contactDescription: "Tell me about your event and I'll get back to you with a custom quote.",
    contactFields: [
      { type: 'text', placeholder: 'Your Name' },
      { type: 'email', placeholder: 'Your Email' },
      { type: 'text', placeholder: 'Event Date & Type' },
      { type: 'textarea', placeholder: 'Tell me about your event...' },
    ],
    contactButtonText: 'Send Booking Request',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-20" role="main">
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-20 text-center">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
          {page.title}
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">{page.description}</p>
      </motion.section>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        {(page.cards || []).map((service: any, i: number) => (
          <motion.div
            key={i}
            whileHover={{ y: -10 }}
            className="p-6 rounded-lg bg-gradient-to-br from-purple-600/20 to-pink-600/10 border border-purple-500/30 hover:border-purple-500 transition"
          >
            <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
            <p className="text-gray-300 mb-4">{service.desc}</p>
            <div className="flex items-center justify-between">
              <span className="text-purple-400 font-bold">{service.price}</span>
              {service.href ? (
                <Link href={service.href} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm transition">
                  {service.buttonText || 'Learn'}
                </Link>
              ) : (
                <Link href="#contact" className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm transition">
                  {service.buttonText || 'Book'}
                </Link>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <section id="contact" className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 p-12 rounded-lg border border-purple-600/30">
        <h2 className="text-3xl font-bold mb-8 text-center">{page.contactTitle}</h2>
        <p className="text-gray-300 text-center mb-8">{page.contactDescription}</p>
        <form className="max-w-2xl mx-auto space-y-4">
          {(page.contactFields || []).map((field: any, index: number) => {
            if (field.type === 'textarea') {
              return (
                <textarea
                  key={index}
                  placeholder={field.placeholder}
                  rows={5}
                  className="w-full px-4 py-3 bg-black/50 border border-purple-500/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              );
            }
            return (
              <input
                key={index}
                type={field.type || 'text'}
                placeholder={field.placeholder}
                className="w-full px-4 py-3 bg-black/50 border border-purple-500/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            );
          })}
          <button className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold transition">
            {page.contactButtonText}
          </button>
        </form>
      </section>
    </div>
  );
}
