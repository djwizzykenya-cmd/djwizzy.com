'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-purple-600/30 text-gray-400 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-white font-bold mb-4">DJ Platform</h3>
            <p className="text-sm">Your all-in-one DJ ecosystem for mixing, sharing, and monetizing your craft.</p>
          </div>

          {/* Pages */}
          <div>
            <h4 className="text-white font-bold mb-4">Pages</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-purple-400">About</Link></li>
              <li><Link href="/services" className="hover:text-purple-400">Services</Link></li>
              <li><Link href="/mixhub" className="hover:text-purple-400">MixHub</Link></li>
              <li><Link href="/academy" className="hover:text-purple-400">Academy</Link></li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-white font-bold mb-4">Community</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/mixhub" className="hover:text-purple-400">MixHub</Link></li>
              <li><Link href="/marketplace" className="hover:text-purple-400">Marketplace</Link></li>
              <li><Link href="/faq" className="hover:text-purple-400">FAQ</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="mailto:contact@djplatform.com" className="hover:text-purple-400">Email</a></li>
              <li><a href="#" className="hover:text-purple-400">Twitter</a></li>
              <li><a href="#" className="hover:text-purple-400">Instagram</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-purple-600/30 pt-8 text-center text-sm">
          <p>&copy; 2026 DJ Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
