'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // User details dynamically load කරගැනීම සඳහා initial value null ලෙස තැබීය
  const [user, setUser] = useState<{ name?: string; fullName?: string; email: string } | null>(null);

  // Component එක Load වෙනවිට LocalStorage එකෙන් Login වූ Userගේ විස්තර ලබාගැනීම
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('userToken');
    localStorage.removeItem('currentUser');
    router.push('/login'); // Logout වූ පසු කෙළින්ම Sign In පිටුවට යවයි
  };

  const navLinks = [
    { href: '/user', label: 'Top Attractions' },
    { href: '/user/vehicles', label: 'Private Vehicles & Drivers' },
    { href: '/user/tours', label: 'Group Tour Packages' },
    { href: '/user/ai-planner', label: 'AI Trip Planner' },
  ];

  // Userගේ නම ලබා ගැනීම (fullName හෝ name)
  const displayName = user?.fullName || user?.name || 'User';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Navigation Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/user" className="flex items-center space-x-2">
            <span className="text-2xl font-black text-emerald-600 tracking-tight">Way Mate</span>
          </Link>

          {/* Menus */}
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

          {/* User Avatar & Logout Button */}
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <div className="flex items-center space-x-2 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-bold text-slate-700">{displayName}</span>
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

      {/* Main Content */}
      <main className="flex-1">{children}</main>
    </div>
  );
}