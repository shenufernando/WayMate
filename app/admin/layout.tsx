'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // Admin User details
  const [admin, setAdmin] = useState<{ name: string; email: string; role: string } | null>({
    name: 'Admin User',
    email: 'admin@waymate.com',
    role: 'Super Admin',
  });

  // 👈 මෙන්න මෙතැන හැادුවා: LocalStorage Clear කර කෙලින්ම Home Page එකට යැවීම
  const handleLogout = () => {
    setAdmin(null);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('user');
    
    // 404 error එක නොදී හරියටම Home Page එකට යැවීමට
    window.location.href = '/';
  };

  const navLinks = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/attractions', label: 'Manage Attractions', icon: '🏞️' },
    { href: '/admin/vehicles', label: 'Manage Vehicles & Drivers', icon: '🚘' },
    { href: '/admin/tours', label: 'Manage Tour Packages', icon: '🌴' },
    { href: '/admin/bookings', label: 'Bookings & Orders', icon: '📑' },
    { href: '/admin/users', label: 'User Management', icon: '👥' },
  ];

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between hidden md:flex min-h-screen sticky top-0">
        <div>
          {/* Logo */}
          <div className="p-6 border-b border-slate-800">
            <Link href="/admin" className="text-2xl font-black text-emerald-400 tracking-tight">
              WayMate <span className="text-xs font-normal bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full ml-1">Admin</span>
            </Link>
          </div>

          {/* Nav Links */}
          <nav className="p-4 space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span className="text-lg">{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Admin Profile & Logout */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center justify-between bg-slate-800/60 p-3 rounded-xl mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white font-bold text-sm flex items-center justify-center">
                {admin?.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-200 truncate">{admin?.name}</p>
                <p className="text-[10px] text-slate-400">{admin?.role}</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white font-semibold text-xs py-2.5 rounded-xl transition-all text-center block"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 h-16 px-6 flex items-center justify-between sticky top-0 z-30">
          <h1 className="text-lg font-bold text-slate-800">Admin Management Portal</h1>
          <div className="flex items-center space-x-4">
            <span className="text-xs font-medium bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
              System Active
            </span>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-6 flex-1">{children}</main>
      </div>
    </div>
  );
}