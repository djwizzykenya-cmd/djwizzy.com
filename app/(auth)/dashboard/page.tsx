'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold mb-12">Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {/* Wallet Card */}
        <motion.div
          whileHover={{ y: -10 }}
          className="p-6 rounded-lg bg-gradient-to-br from-purple-600/20 to-pink-600/10 border border-purple-500/30"
        >
          <h3 className="text-gray-400 mb-2">Wallet Balance</h3>
          <p className="text-3xl font-bold text-purple-400 mb-4">$2,450.50</p>
          <Link href="/dashboard/wallet" className="text-purple-400 hover:text-purple-300">
            View Details →
          </Link>
        </motion.div>

        {/* Earnings Card */}
        <motion.div
          whileHover={{ y: -10 }}
          className="p-6 rounded-lg bg-gradient-to-br from-purple-600/20 to-pink-600/10 border border-purple-500/30"
        >
          <h3 className="text-gray-400 mb-2">This Month</h3>
          <p className="text-3xl font-bold text-green-400 mb-4">+$1,234</p>
          <p className="text-sm text-gray-400">From mixes, tips & more</p>
        </motion.div>

        {/* Stats Card */}
        <motion.div
          whileHover={{ y: -10 }}
          className="p-6 rounded-lg bg-gradient-to-br from-purple-600/20 to-pink-600/10 border border-purple-500/30"
        >
          <h3 className="text-gray-400 mb-2">Profile Stats</h3>
          <p className="text-lg font-bold mb-2">⭐ 4.8 Rating</p>
          <p className="text-sm text-gray-400">285 followers</p>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
        <div className="grid md:grid-cols-4 gap-4">
          <Link href="/mixhub" className="p-4 text-center rounded-lg bg-gradient-to-br from-purple-600/20 to-pink-600/10 border border-purple-500/30 hover:border-purple-500 transition">
            <p className="text-2xl mb-2">📤</p>
            <p className="font-bold">Upload Mix</p>
          </Link>
          <button className="p-4 text-center rounded-lg bg-gradient-to-br from-purple-600/20 to-pink-600/10 border border-purple-500/30 hover:border-purple-500 transition">
            <p className="text-2xl mb-2">🔴</p>
            <p className="font-bold">Go Live</p>
          </button>
          <Link href="/marketplace" className="p-4 text-center rounded-lg bg-gradient-to-br from-purple-600/20 to-pink-600/10 border border-purple-500/30 hover:border-purple-500 transition">
            <p className="text-2xl mb-2">🛍️</p>
            <p className="font-bold">Store</p>
          </Link>
          <Link href="/dashboard/wallet" className="p-4 text-center rounded-lg bg-gradient-to-br from-purple-600/20 to-pink-600/10 border border-purple-500/30 hover:border-purple-500 transition">
            <p className="text-2xl mb-2">💰</p>
            <p className="font-bold">Wallet</p>
          </Link>
        </div>
      </section>

      {/* Recent Activity */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
        <div className="space-y-3">
          {[
            { type: 'Mix Upload', title: 'Tech House Mix #5', date: '2 hours ago', amount: '+$45.50' },
            { type: 'Live Tip', title: 'From user @djvibes', date: '4 hours ago', amount: '+$25.00' },
            { type: 'Withdrawal', title: 'To Bank Account', date: '1 day ago', amount: '-$500.00' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-black/50 rounded-lg border border-purple-500/30">
              <div>
                <p className="font-bold">{item.title}</p>
                <p className="text-sm text-gray-400">{item.type} · {item.date}</p>
              </div>
              <p className={`font-bold ${item.amount.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                {item.amount}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}