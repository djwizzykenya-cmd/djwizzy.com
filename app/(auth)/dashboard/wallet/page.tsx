'use client';

import Link from 'next/link';

export default function Wallet() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <h1 className="text-3xl font-bold mb-4">Wallet</h1>
      <p className="text-gray-400 mb-6">Manage your balance, withdrawals, and payout methods.</p>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="p-4 rounded bg-black/40">
          <h3 className="font-semibold">Current Balance</h3>
          <p className="text-3xl font-bold text-purple-400">$2,450.50</p>
        </div>
        <div className="p-4 rounded bg-black/40">
          <h3 className="font-semibold">Pending</h3>
          <p className="text-lg font-bold text-yellow-400">$120.00</p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">Payout Methods</h3>
        <div className="space-y-3">
          <div className="p-3 bg-black/40 rounded flex items-center justify-between">
            <div>
              <p className="font-medium">Bank ending ••1234</p>
              <p className="text-sm text-gray-400">USD • Verified</p>
            </div>
            <button className="px-3 py-2 bg-purple-600 rounded text-white">Remove</button>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Link href="/dashboard" className="px-3 py-2 border rounded">Back</Link>
        <button className="px-3 py-2 bg-purple-600 rounded text-white">Request Withdrawal</button>
      </div>
    </div>
  );
}
