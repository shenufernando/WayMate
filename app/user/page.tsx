"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UserDashboard() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const email = localStorage.getItem("userEmail") || "User";
    const name = localStorage.getItem("userName") || "Traveler";
    setUserEmail(email);
    setUserName(name);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-sm">
        <h1 className="text-2xl font-black text-emerald-600">
          Way<span className="text-teal-500">Mate</span> <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md font-bold ml-2">User Portal</span>
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-slate-600">Welcome, <strong>{userName}</strong></span>
          <button
            onClick={handleLogout}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-8 max-w-6xl mx-auto w-full flex-1">
        <div className="bg-emerald-600 text-white rounded-3xl p-8 mb-8 shadow-lg relative overflow-hidden">
          <h2 className="text-3xl font-black mb-2">Hello, {userName}! 👋</h2>
          <p className="text-emerald-100 text-sm">Ready for your next journey across Sri Lanka?</p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <div className="text-3xl mb-3">🚘</div>
            <h3 className="font-bold text-slate-800 text-lg mb-1">Post a Ride</h3>
            <p className="text-xs text-slate-500 mb-4">Share empty seats in your vehicle and split costs.</p>
            <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 rounded-xl transition-all">
              Create Ride Offer
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <div className="text-3xl mb-3">🔍</div>
            <h3 className="font-bold text-slate-800 text-lg mb-1">Find Rides</h3>
            <p className="text-xs text-slate-500 mb-4">Search verified routes and connect with drivers.</p>
            <button 
              onClick={() => router.push("/#routes")}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 rounded-xl transition-all"
            >
              Browse Routes
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <div className="text-3xl mb-3">📅</div>
            <h3 className="font-bold text-slate-800 text-lg mb-1">My Bookings</h3>
            <p className="text-xs text-slate-500 mb-4">View your active ride requests and travel history.</p>
            <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2.5 rounded-xl transition-all">
              View Requests
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}