'use client';

import { motion } from 'framer-motion';

export default function Admin() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold mb-12">Admin Panel</h1>

      {/* Admin Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Total Users', value: '1,250', icon: '👥' },
          { label: 'Active DJs', value: '345', icon: '🎧' },
          { label: 'Total Revenue', value: '$45,230', icon: '💰' },
          { label: 'Pending Approvals', value: '23', icon: '⏳' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -10 }}
            className="p-6 rounded-lg bg-gradient-to-br from-purple-600/20 to-pink-600/10 border border-purple-500/30"
          >
            <p className="text-3xl mb-2">{stat.icon}</p>
            <p className="text-gray-400 mb-2">{stat.label}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Admin Actions */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Management</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 rounded-lg bg-gradient-to-br from-purple-600/20 to-pink-600/10 border border-purple-500/30">
            <h3 className="text-xl font-bold mb-4">👤 Pending Approvals</h3>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-black/50 rounded">
                  <span>DJ Upload #{i}</span>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-green-600/30 hover:bg-green-600/50 rounded text-sm">Approve</button>
                    <button className="px-3 py-1 bg-red-600/30 hover:bg-red-600/50 rounded text-sm">Reject</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-lg bg-gradient-to-br from-purple-600/20 to-pink-600/10 border border-purple-500/30">
            <h3 className="text-xl font-bold mb-4">⚙️ Settings</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="p-2 hover:text-purple-400 cursor-pointer">→ Commission Rates</li>
              <li className="p-2 hover:text-purple-400 cursor-pointer">→ Content Policy</li>
              <li className="p-2 hover:text-purple-400 cursor-pointer">→ Feature Flags</li>
              <li className="p-2 hover:text-purple-400 cursor-pointer">→ Email Templates</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Recent Transactions */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Recent Transactions</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-purple-500/30">
              <tr>
                <th className="text-left py-3 px-4">User</th>
                <th className="text-left py-3 px-4">Type</th>
                <th className="text-left py-3 px-4">Amount</th>
                <th className="text-left py-3 px-4">Date</th>
                <th className="text-left py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4].map((i) => (
                <tr key={i} className="border-b border-purple-500/30 hover:bg-purple-600/10">
                  <td className="py-3 px-4">DJ User #{i}</td>
                  <td className="py-3 px-4">Mix Upload</td>
                  <td className="py-3 px-4">+$45.50</td>
                  <td className="py-3 px-4">2024-01-{20 + i}</td>
                  <td className="py-3 px-4"><span className="px-2 py-1 bg-green-600/30 rounded text-xs">Completed</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}