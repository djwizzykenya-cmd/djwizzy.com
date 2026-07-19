'use client';

import Link from 'next/link';

export default function CustomMixing() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <h1 className="text-3xl font-bold mb-3">Custom Mixing</h1>
      <p className="text-gray-300 mb-6">Get a personalized mix tailored to your event, mood, or playlist. Options include stem-level mixing, transitions, and mastering.</p>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="p-4 rounded bg-black/40">
          <h3 className="font-semibold">Standard Mix</h3>
          <p className="text-sm text-gray-400">Up to 30 minutes • Basic transitions</p>
          <p className="mt-3 font-semibold">$100</p>
        </div>
        <div className="p-4 rounded bg-black/40">
          <h3 className="font-semibold">Extended Mix</h3>
          <p className="text-sm text-gray-400">Up to 60 minutes • Smooth blending & mastering</p>
          <p className="mt-3 font-semibold">$180</p>
        </div>
      </div>

      <div className="flex gap-3">
        <Link href="/services" className="px-3 py-2 border rounded">Back</Link>
        <a href="#contact" className="px-3 py-2 bg-purple-600 rounded text-white">Order Mix</a>
      </div>

      <section id="contact" className="mt-8 bg-gradient-to-r from-purple-900/40 to-pink-900/40 p-6 rounded border border-purple-600/30">
        <h3 className="font-semibold mb-2">Place an Order</h3>
        <form className="space-y-3">
          <input className="w-full px-3 py-2 bg-black/50 rounded" placeholder="Your name" />
          <input className="w-full px-3 py-2 bg-black/50 rounded" placeholder="Your email" />
          <textarea className="w-full px-3 py-2 bg-black/50 rounded" placeholder="Links, references, notes" rows={4}></textarea>
          <button className="px-3 py-2 bg-purple-600 rounded text-white">Send Request</button>
        </form>
      </section>
    </div>
  );
}
