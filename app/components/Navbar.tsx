"use client";

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout } = useAuth();

  const navLinks = [
    { name: 'HOME', href: '/' },
    { name: 'ABOUT', href: '/about' },
    { name: 'SERVICES', href: '/services' },
    { name: 'MIXES', href: '/mixes' },
    { name: 'MIXHUB', href: '/mixhub' },
    { name: 'MUSIC POOL', href: '/music-pool' },
    { name: 'MARKETPLACE', href: '/marketplace' },
    { name: 'ACADEMY', href: '/academy' },
  ];

  return (
    <nav className="fixed top-0 w-full bg-black/90 backdrop-blur-md z-50 border-b border-purple-600/30">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent" style={{ fontFamily: 'var(--font-caveat)' }}>
          DJ Wizzy
        </Link>

        {/* Main Nav Links */}
        <div className="hidden md:flex gap-8 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-gray-300 hover:text-white transition duration-200 hover:text-purple-400"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Account Menu (Top Right) */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/50 text-white transition"
          >
            <span className="text-sm">{user ? user.name : 'Login'}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 mt-2 w-48 bg-gray-900 border border-purple-500/50 rounded-lg shadow-lg"
            >
              {user ? (
                <>
                  <Link href="/dashboard" className="block px-4 py-2 hover:bg-purple-600/20 text-white">
                    Dashboard
                  </Link>
                  <Link href="/dashboard/wallet" className="block px-4 py-2 hover:bg-purple-600/20 text-white">
                    💰 Wallet
                  </Link>
                  <Link href="/admin" className="block px-4 py-2 hover:bg-purple-600/20 text-white">
                    Admin Panel
                  </Link>
                  <Link href="/faq" className="block px-4 py-2 hover:bg-purple-600/20 text-white">
                    FAQ
                  </Link>
                  <button
                    onClick={() => { logout(); setIsDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-red-600/20 text-red-400 border-t border-gray-700"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="block px-4 py-2 hover:bg-purple-600/20 text-white font-medium">
                    Login
                  </Link>
                  <Link href="/login" className="block px-4 py-2 hover:bg-purple-600/20 text-white">
                    Register
                  </Link>
                  <Link href="/faq" className="block px-4 py-2 hover:bg-purple-600/20 text-white border-t border-gray-700">
                    FAQ
                  </Link>
                </>
              )}
            </motion.div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </nav>
  );
}
