'use client';

import Link from 'next/link';
import { useAuth } from '../../../app/context/AuthContext';

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <h1 className="text-3xl font-bold mb-4">Profile</h1>
      <p className="text-gray-400 mb-6">Manage your public profile and preferences.</p>

      <div className="p-4 rounded bg-black/40 mb-6">
        <h3 className="font-semibold">Public Info</h3>
        <p className="text-sm text-gray-300 mt-2">Display name: <strong>{user?.name || 'Guest'}</strong></p>
        <p className="text-sm text-gray-300">Email: {user?.email || '—'}</p>
      </div>

      <div className="flex gap-3">
        <Link href="/dashboard" className="px-3 py-2 border rounded">Back</Link>
        <button className="px-3 py-2 bg-purple-600 rounded text-white">Edit Profile</button>
      </div>
    </div>
  );
}
