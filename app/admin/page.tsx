"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const email = localStorage.getItem("userEmail");

    // Secure Check for Admin Route
    if (role !== "admin" && email !== "admin@gmail.com") {
      router.push("/");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col font-sans">
      {/* Admin Header */}
      <header className="bg-slate-800 border-b border-slate-700 px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-black text-emerald-400 flex items-center gap-2">
          Way<span className="text-white">Mate</span> <span className="text-xs bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-md uppercase font-bold">Admin Panel</span>
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all"
        >
          Logout Admin
        </button>
      </header>

      {/* Admin Content */}
      <main className="p-8 max-w-7xl mx-auto w-full flex-1">
        <h2 className="text-3xl font-extrabold mb-6">System Management Overview</h2>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700">
            <p className="text-xs text-slate-400 font-bold uppercase">Total Users</p>
            <h3 className="text-3xl font-black text-emerald-400 mt-2">1,248</h3>
          </div>
          <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700">
            <p className="text-xs text-slate-400 font-bold uppercase">Active Rides</p>
            <h3 className="text-3xl font-black text-teal-400 mt-2">84</h3>
          </div>
          <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700">
            <p className="text-xs text-slate-400 font-bold uppercase">Pending Approvals</p>
            <h3 className="text-3xl font-black text-amber-400 mt-2">12</h3>
          </div>
          <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700">
            <p className="text-xs text-slate-400 font-bold uppercase">Total Bookings</p>
            <h3 className="text-3xl font-black text-indigo-400 mt-2">3,590</h3>
          </div>
        </div>

        {/* Admin Management Section */}
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <h3 className="text-xl font-bold mb-4">Quick Admin Controls</h3>
          <div className="flex gap-4">
            <button className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all">
              Manage Users
            </button>
            <button className="bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all">
              Review Ride Postings
            </button>
            <button className="bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all">
              System Logs
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}