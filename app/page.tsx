"use client";
import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [totalCost, setTotalCost] = useState<number | "">(10000);
  const [people, setPeople] = useState<number>(4);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");

  const costPerPerson = totalCost && people > 0 ? (Number(totalCost) / people).toFixed(2) : 0;

  return (
    <main className="min-h-screen bg-slate-950 text-white pb-20 relative overflow-hidden">
      {/* Scenic Sri Lanka Travel Background - Adjusted for Better Brightness */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-65 h-[650px] pointer-events-none z-0"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=1920&auto=format&fit=crop')`,
        }}
      >
        {/* Lighter Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/40 to-slate-950" />
      </div>

      {/* Content Layer */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="flex justify-between items-center px-8 py-5 border-b border-slate-800/80 backdrop-blur-md bg-slate-950/40">
          <h1 className="text-2xl font-bold tracking-wider text-emerald-400">
            Way<span className="text-cyan-400">Mate</span>
          </h1>
          <div className="space-x-6">
            <a href="#features" className="hover:text-emerald-400 transition">Features</a>
            <a href="#calculator" className="hover:text-emerald-400 transition">Cost Splitter</a>
            <button 
              onClick={() => { setAuthMode("signin"); setIsAuthOpen(true); }}
              className="bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-lg font-medium transition cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center text-center mt-16 px-4">
          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-4 py-1.5 rounded-full text-sm font-semibold mb-4 backdrop-blur-md shadow-lg">
            🌟 Travel Together & Save Costs Across Sri Lanka
          </span>
          <h2 className="text-5xl md:text-6xl font-extrabold leading-tight max-w-4xl tracking-tight drop-shadow-xl">
            Smart Travel & <span className="text-emerald-400">Cost Sharing</span> Made Easy
          </h2>
          <p className="text-slate-100 mt-4 max-w-xl text-lg font-medium drop-shadow-md">
            Plan your route, find travel mates, split expenses, and get AI-powered itineraries for your next adventure.
          </p>

          {/* Search Bar */}
          <div className="bg-slate-900/85 backdrop-blur-md p-4 rounded-xl shadow-2xl mt-8 flex flex-col md:flex-row gap-4 w-full max-w-2xl border border-slate-700/80">
            <input 
              type="text" 
              placeholder="From (e.g. Colombo)" 
              className="bg-slate-950/90 border border-slate-700/80 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-400 flex-1 placeholder:text-slate-400"
            />
            <input 
              type="text" 
              placeholder="To (e.g. Ella)" 
              className="bg-slate-950/90 border border-slate-700/80 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-400 flex-1 placeholder:text-slate-400"
            />
            <Link 
              href="/routes"
              className="bg-cyan-500 hover:bg-cyan-600 font-semibold px-6 py-3 rounded-lg transition text-center flex items-center justify-center cursor-pointer shadow-lg"
            >
              Find Matches
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="mt-32 px-8 max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-slate-200">
            Why Choose <span className="text-emerald-400">WayMate</span>?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-900/80 backdrop-blur-md p-6 rounded-xl border border-slate-800 hover:border-emerald-500/50 transition">
              <div className="text-emerald-400 text-3xl mb-3">🗺️</div>
              <h4 className="text-xl font-semibold mb-2">Smart Route Search</h4>
              <p className="text-slate-400 text-sm">Find the best travel routes across Sri Lanka with real-time updates.</p>
            </div>
            <div className="bg-slate-900/80 backdrop-blur-md p-6 rounded-xl border border-slate-800 hover:border-emerald-500/50 transition">
              <div className="text-emerald-400 text-3xl mb-3">🚘</div>
              <h4 className="text-xl font-semibold mb-2">Ride Matching</h4>
              <p className="text-slate-400 text-sm">Connect with trustworthy travelers heading to the same destination.</p>
            </div>
            <div className="bg-slate-900/80 backdrop-blur-md p-6 rounded-xl border border-slate-800 hover:border-emerald-500/50 transition">
              <div className="text-emerald-400 text-3xl mb-3">💸</div>
              <h4 className="text-xl font-semibold mb-2">Cost Splitter</h4>
              <p className="text-slate-400 text-sm">Fairly divide fuel, food, and accommodation costs among travel mates.</p>
            </div>
            <div className="bg-slate-900/80 backdrop-blur-md p-6 rounded-xl border border-slate-800 hover:border-emerald-500/50 transition">
              <div className="text-emerald-400 text-3xl mb-3">🤖</div>
              <h4 className="text-xl font-semibold mb-2">AI Trip Planner</h4>
              <p className="text-slate-400 text-sm">Get instant personalized day itineraries tailored to your budget.</p>
            </div>
          </div>
        </section>

        {/* Expense Calculator Section */}
        <section id="calculator" className="mt-28 px-4">
          <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 max-w-xl mx-auto p-8 rounded-2xl shadow-xl">
            <h3 className="text-2xl font-bold text-center mb-2">Quick Expense Calculator</h3>
            <p className="text-slate-400 text-center text-sm mb-6">Estimate your share before heading out!</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-300 mb-1">Total Trip Expense (LKR)</label>
                <input 
                  type="number" 
                  value={totalCost}
                  onChange={(e) => setTotalCost(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-400"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">Number of Travelers</label>
                <input 
                  type="number" 
                  min="1"
                  value={people}
                  onChange={(e) => setPeople(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-400"
                />
              </div>
              
              <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center">
                <span className="text-sm text-slate-400 block">Cost Per Person</span>
                <span className="text-3xl font-extrabold text-emerald-400">Rs. {costPerPerson}</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Login / Register Popup Modal */}
      {isAuthOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-md p-6 rounded-2xl shadow-2xl relative">
            <button 
              onClick={() => setIsAuthOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl"
            >
              ✕
            </button>

            <h3 className="text-2xl font-bold text-center mb-6">
              {authMode === "signin" ? "Welcome Back" : "Create Account"}
            </h3>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              {authMode === "signup" && (
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="John Doe" 
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm text-slate-300 mb-1">Email Address</label>
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-1">Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-600 font-semibold py-3 rounded-lg transition mt-2 cursor-pointer"
              >
                {authMode === "signin" ? "Sign In" : "Register"}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-400">
              {authMode === "signin" ? (
                <p>
                  Don't have an account?{" "}
                  <button 
                    onClick={() => setAuthMode("signup")}
                    className="text-emerald-400 hover:underline font-medium"
                  >
                    Register
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{" "}
                  <button 
                    onClick={() => setAuthMode("signin")}
                    className="text-emerald-400 hover:underline font-medium"
                  >
                    Sign In
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}