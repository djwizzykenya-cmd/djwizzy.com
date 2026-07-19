'use client';

import Link from 'next/link';

export default function MusicProduction() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <h1 className="text-3xl font-bold mb-3">Music Production</h1>
      <p className="text-gray-300 mb-6">Original tracks, remixes, and production services for artists and DJs.</p>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="p-4 rounded bg-black/40">
          <h3 className="font-semibold">Beat Production</h3>
          <p className="text-sm text-gray-400">Custom beats and instrumentals.</p>
          <p className="mt-3 font-semibold">$200+</p>
        </div>
        <div className="p-4 rounded bg-black/40">
          <h3 className="font-semibold">Remix Service</h3>
          <p className="text-sm text-gray-400">Official remixes and edits.</p>
          <p className="mt-3 font-semibold">$300+</p>
        </div>
      </div>

      <div className="flex gap-3">
        <Link href="/services" className="px-3 py-2 border rounded">Back</Link>
        <a href="#contact" className="px-3 py-2 bg-purple-600 rounded text-white">Get Quote</a>
      </div>

      <section id="contact" className="mt-8 bg-gradient-to-r from-purple-900/40 to-pink-900/40 p-6 rounded border border-purple-600/30">
        <h3 className="font-semibold mb-2">Get a Quote</h3>
        <form className="space-y-3">
          <input className="w-full px-3 py-2 bg-black/50 rounded" placeholder="Your name" />
          <input className="w-full px-3 py-2 bg-black/50 rounded" placeholder="Your email" />
          <textarea className="w-full px-3 py-2 bg-black/50 rounded" placeholder="Project details" rows={4}></textarea>
          <button className="px-3 py-2 bg-purple-600 rounded text-white">Send</button>
        </form>
      </section>
    </div>
  );
}
