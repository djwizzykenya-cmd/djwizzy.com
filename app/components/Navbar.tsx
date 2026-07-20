"use client";

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  const handleMobileNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full bg-black/90 backdrop-blur-md z-50 border-b border-purple-600/30">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent" style={{ fontFamily: 'var(--font-caveat)' }}>
          DJ Wizzy
        </Link>

        {/* Main Nav Links (Desktop) */}
        <div className="hidden lg:flex gap-6 xl:gap-8 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-xs sm:text-sm font-medium text-gray-300 hover:text-white transition duration-200 hover:text-purple-400"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right Side: Account + Mobile Menu Toggle */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Account Menu (Desktop) */}
          <div className="hidden sm:block relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/50 text-white transition text-sm"
            >
              <span className="hidden sm:inline">{user ? user.name : 'Login'}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-48 bg-gray-900 border border-purple-500/50 rounded-lg shadow-lg z-50"
              >
                {user ? (
                  <>
                    <Link href="/dashboard" className="block px-4 py-2 hover:bg-purple-600/20 text-white text-sm">
                      Dashboard
                    </Link>
                    <Link href="/dashboard/wallet" className="block px-4 py-2 hover:bg-purple-600/20 text-white text-sm">
                      💰 Wallet
                    </Link>
                    <Link href="/admin" className="block px-4 py-2 hover:bg-purple-600/20 text-white text-sm">
                      Admin Panel
                    </Link>
                    <Link href="/faq" className="block px-4 py-2 hover:bg-purple-600/20 text-white text-sm">
                      FAQ
                    </Link>
                    <button
                      onClick={() => { logout(); setIsDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 hover:bg-red-600/20 text-red-400 border-t border-gray-700 text-sm"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="block px-4 py-2 hover:bg-purple-600/20 text-white font-medium text-sm">
                      Login
                    </Link>
                    <Link href="/login" className="block px-4 py-2 hover:bg-purple-600/20 text-white text-sm">
                      Register
                    </Link>
                    <Link href="/faq" className="block px-4 py-2 hover:bg-purple-600/20 text-white border-t border-gray-700 text-sm">
                      FAQ
                    </Link>
                  </>
                )}
              </motion.div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden flex flex-col gap-1.5 p-2 hover:bg-purple-600/20 rounded-lg transition"
            aria-label="Toggle mobile menu"
          >
            <span className={`w-6 h-0.5 bg-white transition-all ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-white transition-all ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-white transition-all ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>

        {/* Mobile Menu Button */}
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, x: -300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -300 }}
          transition={{ duration: 0.3 }}
          className="lg:hidden bg-black/95 backdrop-blur-md border-b border-purple-600/30"
        >
          <div className="px-4 py-4 space-y-3">
            {/* Account Menu in Mobile */}
            <div className="mb-4 pb-4 border-b border-purple-600/30">
              {user ? (
                <>
                  <p className="text-white font-semibold text-sm mb-3">Logged in as {user.name}</p>
                  <div className="space-y-2">
                    <Link href="/dashboard" className="block px-3 py-2 hover:bg-purple-600/20 text-white rounded text-sm" onClick={handleMobileNavClick}>
                      Dashboard
                    </Link>
                    <Link href="/dashboard/wallet" className="block px-3 py-2 hover:bg-purple-600/20 text-white rounded text-sm" onClick={handleMobileNavClick}>
                      💰 Wallet
                    </Link>
                    <Link href="/admin" className="block px-3 py-2 hover:bg-purple-600/20 text-white rounded text-sm" onClick={handleMobileNavClick}>
                      Admin Panel
                    </Link>
                    <button
                      onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                      className="w-full text-left px-3 py-2 hover:bg-red-600/20 text-red-400 rounded text-sm"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <Link href="/login" className="block px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded font-medium text-sm" onClick={handleMobileNavClick}>
                  Login / Register
                </Link>
              )}
            </div>

            {/* Main Navigation Links */}
            <div className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block px-3 py-2 hover:bg-purple-600/20 text-gray-300 hover:text-white rounded transition text-sm font-medium"
                  onClick={handleMobileNavClick}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Additional Links */}
            <div className="border-t border-purple-600/30 pt-3 mt-3 space-y-2">
              <Link href="/faq" className="block px-3 py-2 hover:bg-purple-600/20 text-gray-300 hover:text-white rounded transition text-sm" onClick={handleMobileNavClick}>
                FAQ
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
