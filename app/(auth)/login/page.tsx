'use client';

import { motion } from 'framer-motion';
import { useState, type FormEvent } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

const MAX_PASSWORD_LENGTH = 1024;

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login, register, authError } = useAuth();
  const router = useRouter();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setMessage('');

    if (password.length > MAX_PASSWORD_LENGTH) {
      setError('The password field is too long. Enter only your password and try again.');
      return;
    }

    setSubmitting(true);
    try {
      if (isRegister) {
        await register(email, password, name);
        setMessage('Account created. Check your email if confirmation is enabled, then sign in.');
        setIsRegister(false);
      } else {
        await login(email, password);
        router.push('/dashboard');
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Authentication failed.');
    } finally {
      setSubmitting(false);
    }
  }

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

        <form className="space-y-4" onSubmit={submit}>
          {isRegister && (
            <input
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-3 bg-black/50 border border-purple-500/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />
          )}
          <input
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            placeholder="Email"
            autoComplete="email"
            className="w-full px-4 py-3 bg-black/50 border border-purple-500/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
          />
          <input
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            placeholder="Password"
            autoComplete={isRegister ? 'new-password' : 'current-password'}
            className="w-full px-4 py-3 bg-black/50 border border-purple-500/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-60 rounded-lg font-bold transition"
          >
            {submitting ? 'Please wait…' : isRegister ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        {(error || authError) && <p role="alert" className="mt-4 text-sm text-red-400">{error || authError}</p>}
        {message && <p role="status" className="mt-4 text-sm text-green-400">{message}</p>}

        <div className="mt-6 pt-6 border-t border-purple-500/30 text-center">
          <p className="text-gray-400">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
                setMessage('');
              }}
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
