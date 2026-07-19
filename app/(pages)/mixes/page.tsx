'use client';

import { motion } from 'framer-motion';

export default function Mixes() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-20 text-center"
      >
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
          My Mixes
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Check out my curated mixes - House, Hip-Hop, Electronic, and more.
        </p>
      </motion.section>

      {/* Mixes Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <motion.div
            key={i}
            whileHover={{ y: -10 }}
            className="p-6 rounded-lg bg-gradient-to-br from-purple-600/20 to-pink-600/10 border border-purple-500/30 hover:border-purple-500 transition cursor-pointer group"
          >
            <div className="h-48 bg-black/50 rounded-lg mb-4 flex items-center justify-center group-hover:bg-black/70 transition">
              <svg className="w-16 h-16 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2">Mix #{i}</h3>
            <p className="text-sm text-gray-400 mb-4">House Mix | 120 BPM | 1h 23m</p>
            <div className="flex gap-2 text-sm">
              <span className="px-2 py-1 bg-purple-600/30 rounded">House</span>
              <span className="px-2 py-1 bg-purple-600/30 rounded">Electronic</span>
            </div>
            <div className="mt-4 flex items-center justify-between text-gray-400">
              <span>👍 234 | 💬 45</span>
              <span>⭐ 4.8</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}