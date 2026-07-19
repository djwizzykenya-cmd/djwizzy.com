'use client';

import Link from 'next/link';

export default function TrainingConsultation() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <h1 className="text-3xl font-bold mb-3">Training & Consultation</h1>
      <p className="text-gray-300 mb-6">One-on-one coaching, group classes, and consultation for DJ career growth.</p>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="p-4 rounded bg-black/40">
          <h3 className="font-semibold">One-on-One</h3>
          <p className="text-sm text-gray-400">Personalized sessions focused on your goals.</p>
          <p className="mt-3 font-semibold">$60 / hour</p>
        </div>
        <div className="p-4 rounded bg-black/40">
          <h3 className="font-semibold">Group Classes</h3>
          <p className="text-sm text-gray-400">Small group workshops and weekend intensives.</p>
          <p className="mt-3 font-semibold">$25 / person</p>
        </div>
      </div>

      <div className="flex gap-3">
        <Link href="/services" className="px-3 py-2 border rounded">Back</Link>
        <a href="#contact" className="px-3 py-2 bg-purple-600 rounded text-white">Book Session</a>
      </div>

      <section id="contact" className="mt-8 bg-gradient-to-r from-purple-900/40 to-pink-900/40 p-6 rounded border border-purple-600/30">
        <h3 className="font-semibold mb-2">Book a Session</h3>
        <form className="space-y-3">
          <input className="w-full px-3 py-2 bg-black/50 rounded" placeholder="Your name" />
          <input className="w-full px-3 py-2 bg-black/50 rounded" placeholder="Your email" />
          <input className="w-full px-3 py-2 bg-black/50 rounded" placeholder="Preferred date/time" />
          <button className="px-3 py-2 bg-purple-600 rounded text-white">Request</button>
        </form>
      </section>
    </div>
  );
}
