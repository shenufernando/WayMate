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

  // State to track logged-in status
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);

  // Check user authentication status from LocalStorage when component mounts
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    const token = localStorage.getItem('userToken') || localStorage.getItem('token');
    
    if (savedUser || token) {
      setIsLoggedIn(true);
    }
  }, []);

  // Handle user logout and redirect directly to Home Page
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('userToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    
    // Redirect directly to the Home Page
    router.push('/');
  };

  const navLinks = [
    { href: '/user', label: 'Top Attractions' },
    { href: '/user/vehicles', label: 'Private Vehicles & Drivers' },
    { href: '/user/tours', label: 'Group Tour Packages' },
    { href: '/user/ai-planner', label: 'AI Trip Planner' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      {/* Primary Navigation Bar */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link href="/user" className="flex items-center gap-1">
            <span className="text-2xl font-black tracking-tight text-emerald-600">
              Way<span className="text-teal-500">Mate</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors hover:text-emerald-600 py-1 ${
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

          {/* Logout Button */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handleLogout}
              className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">{children}</main>
    </div>
  );
}