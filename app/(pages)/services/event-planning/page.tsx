'use client';

import Link from 'next/link';

export default function EventPlanning() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <h1 className="text-3xl font-bold mb-3">Event Planning</h1>
      <p className="text-gray-300 mb-6">Full-service event planning to craft the perfect music experience for your guests.</p>

      <ul className="list-disc ml-5 text-gray-300 mb-6">
        <li>Music curation and set design</li>
        <li>Vendor coordination (sound, lights)</li>
        <li>Venue liaison and run-of-show</li>
      </ul>

      <div className="flex gap-3">
        <Link href="/services" className="px-3 py-2 border rounded">Back</Link>
        <a href="#contact" className="px-3 py-2 bg-purple-600 rounded text-white">Request Quote</a>
      </div>

      <section id="contact" className="mt-8 bg-gradient-to-r from-purple-900/40 to-pink-900/40 p-6 rounded border border-purple-600/30">
        <h3 className="font-semibold mb-2">Request a Quote</h3>
        <form className="space-y-3">
          <input className="w-full px-3 py-2 bg-black/50 rounded" placeholder="Your name" />
          <input className="w-full px-3 py-2 bg-black/50 rounded" placeholder="Your email" />
          <textarea className="w-full px-3 py-2 bg-black/50 rounded" placeholder="Event details" rows={4}></textarea>
          <button className="px-3 py-2 bg-purple-600 rounded text-white">Send</button>
        </form>
      </section>
    </div>
  );
}
