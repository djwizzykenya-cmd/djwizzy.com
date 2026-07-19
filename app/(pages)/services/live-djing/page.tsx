'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function LiveDj() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">Live DJing</h1>
        <p className="text-gray-300 max-w-2xl mx-auto">Book live DJ performances for weddings, private parties, clubs, corporate events, and festivals. Choose a package, view availability, and request a quote.</p>
      </motion.div>

      <section className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 rounded-lg bg-gradient-to-br from-purple-600/10 to-pink-600/5 border border-purple-500/10">
          <h3 className="font-bold text-lg">Standard Set</h3>
          <p className="text-sm text-gray-400 mt-2">Up to 2 hours performance • Basic light show</p>
          <p className="mt-4 font-semibold">From $500</p>
        </div>

        <div className="p-6 rounded-lg bg-gradient-to-br from-purple-600/10 to-pink-600/5 border border-purple-500/10">
          <h3 className="font-bold text-lg">Extended Set</h3>
          <p className="text-sm text-gray-400 mt-2">Up to 4 hours • Advanced lighting and MC</p>
          <p className="mt-4 font-semibold">From $900</p>
        </div>

        <div className="p-6 rounded-lg bg-gradient-to-br from-purple-600/10 to-pink-600/5 border border-purple-500/10">
          <h3 className="font-bold text-lg">Festival / Headline</h3>
          <p className="text-sm text-gray-400 mt-2">Headline sets, travel & rider included (quote)</p>
          <p className="mt-4 font-semibold">Quote</p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">What I Bring</h2>
        <ul className="list-disc ml-5 text-gray-300 space-y-2">
          <li>Professional DJ setup (optional)</li>
          <li>Custom playlist and requests</li>
          <li>MC / crowd interaction</li>
          <li>Lighting options and stage tech</li>
          <li>Flexible travel and rider</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">FAQ</h2>
        <div className="space-y-3 text-gray-300">
          <details className="bg-black/40 p-3 rounded">
            <summary className="font-medium">Do you provide equipment?</summary>
            <p className="mt-2 text-sm">Yes — I can provide a full DJ rig for an additional fee, or plug into your house PA.</p>
          </details>
          <details className="bg-black/40 p-3 rounded">
            <summary className="font-medium">What is your travel policy?</summary>
            <p className="mt-2 text-sm">Travel expenses for events outside the local area may apply — we'll include this in the quote.</p>
          </details>
        </div>
      </section>

      <div className="flex gap-4">
        <Link href="/services" className="px-4 py-2 border border-purple-600 rounded">Back</Link>
        <a href="#contact" className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white">Request Booking</a>
      </div>

      <section id="contact" className="mt-10 bg-gradient-to-r from-purple-900/40 to-pink-900/40 p-6 rounded-lg border border-purple-600/30">
        <h3 className="text-xl font-semibold mb-3">Request a Booking</h3>
        <form className="space-y-3">
          <input type="text" placeholder="Your name" className="w-full px-3 py-2 bg-black/50 rounded" />
          <input type="email" placeholder="Your email" className="w-full px-3 py-2 bg-black/50 rounded" />
          <input type="text" placeholder="Event date & venue" className="w-full px-3 py-2 bg-black/50 rounded" />
          <textarea placeholder="Notes or special requests" className="w-full px-3 py-2 bg-black/50 rounded" rows={4}></textarea>
          <button className="px-4 py-2 bg-purple-600 rounded text-white">Send Request</button>
        </form>
      </section>
    </div>
  );
}
