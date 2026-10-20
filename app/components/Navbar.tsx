'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  // Signed In / Registered User Data
  const [user, setUser] = useState<{ name: string; email: string } | null>({
    name: 'Kasun Kalhara', // Dynamic user name
    email: 'kasun@example.com',
  });

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('userToken');
    router.push('/');
  };

  const navLinks = [
    { href: '/user', label: 'Top Attractions' },
    { href: '/vehicles', label: 'Private Vehicles & Drivers' },
    { href: '/tours', label: 'Group Tour Packages' },
    { href: '/ai-planner', label: 'AI Trip Planner' },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/user" className="flex items-center space-x-2">
          <span className="text-2xl font-black text-emerald-600 tracking-tight">Way Mate</span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors hover:text-emerald-600 py-5 ${
                  isActive
                    ? 'text-emerald-600 font-bold border-b-2 border-emerald-600'
                    : 'text-slate-600'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Dynamic User Profile & Logout */}
        <div className="flex items-center space-x-3">
          {user ? (
            <>
              <div className="flex items-center space-x-2 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-bold text-slate-700">{user.name}</span>
              </div>

              <button
                onClick={handleLogout}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-full transition-all shadow-sm"
              >
                Log Out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2 rounded-full transition-all shadow-sm"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}