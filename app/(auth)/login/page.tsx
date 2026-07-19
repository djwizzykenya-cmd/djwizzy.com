'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '../../../app/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 rounded-lg bg-gradient-to-br from-purple-600/20 to-pink-600/10 border border-purple-500/30"
      >
        <h1 className="text-3xl font-bold text-center mb-2">
          {isRegister ? 'Create Account' : 'Welcome Back'}
        </h1>
        <p className="text-gray-400 text-center mb-8">
          {isRegister ? 'Join the DJ Platform community' : 'Sign in to your account'}
        </p>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          {isRegister && (
            <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Full Name" className="w-full px-4 py-3 bg-black/50 border border-purple-500/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" />
          )}
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" className="w-full px-4 py-3 bg-black/50 border border-purple-500/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" />
          <input type="password" placeholder="Password" className="w-full px-4 py-3 bg-black/50 border border-purple-500/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" />
          {isRegister && (
            <select className="w-full px-4 py-3 bg-black/50 border border-purple-500/50 rounded-lg text-white focus:outline-none focus:border-purple-500">
              <option>I am a...</option>
              <option>Regular User</option>
              <option>DJ</option>
              <option>Event Organizer</option>
            </select>
          )}

          <button
            type="button"
            onClick={() => {
              // simple mock login
              const userName = isRegister ? name || 'New User' : name || email.split('@')[0] || 'User';
              login({ name: userName, email: email || 'user@example.com' });
              router.push('/dashboard');
            }}
            className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold transition"
          >
            {isRegister ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-purple-500/30 text-center">
          <p className="text-gray-400">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-purple-400 hover:text-purple-300 font-bold"
            >
              {isRegister ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}