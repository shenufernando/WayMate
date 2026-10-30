"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface BlogPost {
  id: number;
  title: { rendered: string };
  excerpt: { rendered: string };
  link: string;
  date: string;
}

export default function Home() {
  const router = useRouter();
  const [totalCost, setTotalCost] = useState<number | "">(10000);
  const [people, setPeople] = useState<number>(4);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Auth Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authMessage, setAuthMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [fromSearch, setFromSearch] = useState("");
  const [toSearch, setToSearch] = useState("");
  const [travelDate, setTravelDate] = useState("");

  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loadingBlogs, setLoadingBlogs] = useState<boolean>(true);

  // Function to open authentication modal
  const openAuthModal = (mode: "signin" | "signup") => {
    setAuthMode(mode);
    setEmail("");
    setPassword("");
    setFullName("");
    setAuthMessage(null);
    setIsAuthOpen(true);
  };

  // Fetch travel news blogs from TechCrunch REST API
  useEffect(() => {
    fetch("https://techcrunch.com/wp-json/wp/v2/posts?per_page=3")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setBlogs(data);
        }
        setLoadingBlogs(false);
      })
      .catch(() => setLoadingBlogs(false));
  }, []);

  // Calculate cost per person for expense splitter
  const costPerPerson =
    totalCost && people > 0 ? (Number(totalCost) / people).toFixed(2) : "0.00";

  // Handle Authentication Submission (Sign In & Sign Up)
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthMessage(null);

    // Hardcoded Admin Check for testing
    if (authMode === "signin" && email.trim().toLowerCase() === "admin@gmail.com" && password === "admin123") {
      setAuthMessage({ type: "success", text: "Admin Sign-in Successful! Redirecting..." });
      localStorage.setItem("userRole", "admin");
      localStorage.setItem("userEmail", email);
      localStorage.setItem("user", JSON.stringify({ email: email, fullName: "Admin User" }));
      
      setTimeout(() => {
        setIsAuthOpen(false);
        router.push("/admin");
      }, 1500);
      setAuthLoading(false);
      return;
    }

    try {
      const endpoint =
        authMode === "signin"
          ? "http://localhost:5000/api/auth/login"
          : "http://localhost:5000/api/auth/register";

      const payload =
        authMode === "signup"
          ? { fullName: fullName, email: email.trim(), password }
          : { email: email.trim(), password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        if (authMode === "signup") {
          setAuthMessage({ type: "success", text: "Registration Successful! Please Sign In." });
          setPassword("");
          setTimeout(() => {
            setAuthMode("signin");
            setAuthMessage({ type: "success", text: "Please sign in with your registered credentials." });
          }, 1500);
        } else {
          setAuthMessage({ type: "success", text: "Sign-in Successful! Redirecting..." });

          // Store authentication session data in localStorage
          if (data.token) localStorage.setItem("token", data.token);
          localStorage.setItem("userRole", data.user?.role || "user");
          localStorage.setItem("userName", data.user?.fullName || data.user?.name || fullName);
          localStorage.setItem("userEmail", data.user?.email || email);
          
          localStorage.setItem("user", JSON.stringify({
            email: data.user?.email || email,
            fullName: data.user?.fullName || data.user?.name || fullName
          }));

          setTimeout(() => {
            setIsAuthOpen(false);
            if (data.user?.role === "admin" || email.trim().toLowerCase() === "admin@gmail.com") {
              router.push("/admin");
            } else {
              router.push("/user"); 
            }
          }, 1500);
        }
      } else {
        setAuthMessage({ type: "error", text: data.message || "Authentication failed! Please check your details." });
      }
    } catch (error) {
      console.error("Auth Error:", error);
      setAuthMessage({ type: "error", text: "Connection error or invalid credentials!" });
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 relative overflow-hidden flex flex-col justify-between font-sans">
      <div>
        {/* Navigation Bar */}
        <nav className="flex justify-between items-center px-8 py-4 bg-white/80 backdrop-blur-lg sticky top-0 z-40 border-b border-slate-200/60 shadow-sm">
          <h1 className="text-2xl font-black tracking-tight text-emerald-600 w-1/4 flex items-center gap-1">
            Way<span className="text-teal-500">Mate</span>
          </h1>

          <div className="flex items-center justify-center space-x-8 text-sm font-semibold text-slate-600 w-2/4">
            <a href="#features" className="hover:text-emerald-600 transition-colors">
              Features
            </a>
            <a href="#calculator" className="hover:text-emerald-600 transition-colors">
              Cost Splitter
            </a>
            <a href="#about" className="hover:text-emerald-600 transition-colors">
              About
            </a>
            <a href="#blogs" className="hover:text-emerald-600 transition-colors">
              News
            </a>
          </div>

          <div className="flex justify-end w-1/4">
            <button
              onClick={() => openAuthModal("signin")}
              className="bg-emerald-600 hover:bg-slate-900 active:bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold transition-all duration-300 shadow-sm hover:shadow-slate-900/20 text-xs tracking-wide"
            >
              Sign In
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="relative pb-16">
          <div className="absolute inset-0 h-[580px] z-0 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=2000&q=80"
              alt="Sri Lanka Landscape"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/50 to-slate-50" />
          </div>

          <section className="relative z-10 flex flex-col items-center justify-center text-center pt-20 px-4">
            <span className="bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-4 py-1.5 rounded-full border border-emerald-400/30 backdrop-blur-md mb-4 uppercase tracking-wider">
              Sri Lanka’s Ultimate All-in-One Travel Companion
            </span>
            <h2 className="text-5xl md:text-6xl font-black text-white leading-tight max-w-4xl drop-shadow-lg tracking-tight">
              Smart Travel &{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                Companion Platform
              </span>
            </h2>
            <p className="text-slate-200 mt-4 max-w-2xl text-lg font-normal drop-shadow-md leading-relaxed">
              Plan custom itineraries with AI, hire private vehicles, book group tours, and explore top attractions — all in one place.
            </p>
          </section>
        </div>

        {/* Features Section (Why WayMate - Updated according to User Dashboard Tabs) */}
        <section id="features" className="mt-28 pt-8 px-6 max-w-7xl mx-auto relative z-20">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-emerald-600 font-bold text-xs uppercase tracking-widest bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-200 inline-block mb-3 shadow-sm">
              Why WayMate
            </span>
            <h3 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Designed for <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">Smarter & Safer</span> Journeys
            </h3>
            <p className="text-slate-500 text-base mt-4 font-normal leading-relaxed">
              Everything you need to plan, connect, and explore Sri Lanka with complete ease and comfort.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group relative bg-white rounded-3xl p-8 border border-slate-200/70 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/5 rounded-bl-full -mr-4 -mt-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-emerald-500/10" />
              <div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-50 to-teal-50 border border-emerald-100 flex items-center justify-center text-emerald-600 text-2xl mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                  🗺️
                </div>
                <h4 className="text-xl font-extrabold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors">
                  Top Attractions
                </h4>
                <p className="text-slate-500 text-sm leading-relaxed font-normal">
                  Discover iconic Sri Lankan landmarks, heritage sites, and scenic natural wonders across the island.
                </p>
              </div>
            </div>

            <div className="group relative bg-white rounded-3xl p-8 border border-slate-200/70 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/5 rounded-bl-full -mr-4 -mt-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-emerald-500/10" />
              <div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-50 to-teal-50 border border-emerald-100 flex items-center justify-center text-emerald-600 text-2xl mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                  🚘
                </div>
                <h4 className="text-xl font-extrabold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors">
                  Private Vehicles & Drivers
                </h4>
                <p className="text-slate-500 text-sm leading-relaxed font-normal">
                  Book verified private rides with experienced drivers or list your own vehicle to offer rides.
                </p>
              </div>
            </div>

            <div className="group relative bg-white rounded-3xl p-8 border border-slate-200/70 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/5 rounded-bl-full -mr-4 -mt-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-emerald-500/10" />
              <div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-50 to-teal-50 border border-emerald-100 flex items-center justify-center text-emerald-600 text-2xl mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                  🎒
                </div>
                <h4 className="text-xl font-extrabold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors">
                  Group Tour Packages
                </h4>
                <p className="text-slate-500 text-sm leading-relaxed font-normal">
                  Explore curated group travel packages tailored for hiking, beach getaways, safari, and cultural tours.
                </p>
              </div>
            </div>

            <div className="group relative bg-white rounded-3xl p-8 border border-slate-200/70 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/5 rounded-bl-full -mr-4 -mt-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-emerald-500/10" />
              <div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-50 to-teal-50 border border-emerald-100 flex items-center justify-center text-emerald-600 text-2xl mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                  🤖
                </div>
                <h4 className="text-xl font-extrabold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors">
                  AI Trip Planner
                </h4>
                <p className="text-slate-500 text-sm leading-relaxed font-normal">
                  Generate instant, personalized day-by-day travel itineraries based on your budget and preferences.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Expense Calculator */}
        <section id="calculator" className="mt-32 px-4 max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-8 md:p-12 shadow-2xl border border-slate-700/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-4">
                <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  Instant Estimator
                </span>
                <h3 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                  Quick Trip Expense <span className="text-emerald-400">Calculator</span>
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Easily split costs for fuel, tolls, meals, and accommodations with your travel mates before setting off.
                </p>
              </div>

              <div className="lg:col-span-7 bg-white/10 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-white/10 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Total Trip Expense (LKR)
                    </label>
                    <input
                      type="number"
                      value={totalCost}
                      onChange={(e) =>
                        setTotalCost(
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                      className="w-full bg-slate-800/80 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 font-bold text-base transition-all"
                      placeholder="e.g. 10000"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Number of Travelers
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={people}
                      onChange={(e) =>
                        setPeople(Math.max(1, Number(e.target.value)))
                      }
                      className="w-full bg-slate-800/80 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 font-bold text-base transition-all"
                    />
                  </div>
                </div>

                <div className="p-5 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-xl text-center">
                  <span className="text-xs text-emerald-300 font-bold uppercase tracking-wider block mb-1">
                    Per Person Share
                  </span>
                  <span className="text-4xl font-black text-emerald-400 tracking-tight">
                    Rs. {costPerPerson}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section id="about" className="mt-32 px-6 max-w-6xl mx-auto">
          <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200/80 shadow-sm relative overflow-hidden">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <span className="text-emerald-600 font-bold text-xs uppercase tracking-widest bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-200 inline-block shadow-sm">
                About WayMate
              </span>
              <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                Empowering Travel Across Sri Lanka
              </h3>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                WayMate is Sri Lanka’s premier travel platform designed to make island exploration effortless, affordable, and smart. Whether you want to discover top attractions, hire verified private vehicles, join curated group tour packages, or let artificial intelligence plan your entire journey, WayMate brings all your travel needs into one seamless ecosystem.
              </p>
            </div>
          </div>
        </section>

        {/* News Section */}
        <section id="blogs" className="mt-32 mb-32 px-4 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-emerald-600 font-bold text-xs uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Stay Updated
            </span>
            <h3 className="text-3xl md:text-4xl font-black text-slate-900 mt-3 tracking-tight">
              Latest <span className="text-emerald-600">Travel News</span> & Stories
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-2">
              ⚡ Powered by Headless WordPress REST API
            </p>
          </div>

          {loadingBlogs ? (
            <div className="flex justify-center items-center py-16">
              <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogs.map((post) => (
                <div
                  key={post.id}
                  className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="text-xs text-emerald-600 font-bold mb-3 uppercase tracking-wider">
                      News Article
                    </div>
                    <h4
                      className="font-extrabold text-lg text-slate-900 mb-3 line-clamp-2 leading-snug group-hover:text-emerald-600 transition-colors"
                      dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                    />
                    <div
                      className="text-slate-500 text-xs line-clamp-3 mb-6 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                    />
                  </div>
                  <a
                    href={post.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-900 font-bold text-xs uppercase tracking-wider flex items-center gap-1 group-hover:text-emerald-600 transition-colors"
                  >
                    Read Full Story ➔
                  </a>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800 mt-auto">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-white tracking-wider">
                Way<span className="text-emerald-400">Mate</span>
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Sri Lanka's premier travel sharing platform. Plan routes, split trip costs, and find verified travel companions with ease.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4 text-base">Quick Links</h4>
              <ul className="space-y-2.5 text-sm">
                <li><a href="#features" className="hover:text-emerald-400 transition-colors">Features</a></li>
                <li><a href="#calculator" className="hover:text-emerald-400 transition-colors">Cost Splitter</a></li>
                <li><a href="#about" className="hover:text-emerald-400 transition-colors">About Us</a></li>
                <li><a href="#blogs" className="hover:text-emerald-400 transition-colors">Travel News</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4 text-base">Popular Routes</h4>
              <ul className="space-y-2.5 text-sm text-slate-400">
                <li>Colombo ➔ Ella</li>
                <li>Kandy ➔ Galle</li>
                <li>Colombo ➔ Arugam Bay</li>
                <li>Jaffna ➔ Trincomalee</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4 text-base">Newsletter</h4>
              <p className="text-xs text-slate-400 mb-3">Subscribe for route updates and travel offers.</p>
              <div className="flex flex-col gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-xl text-sm transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <p>© 2026 WayMate Inc. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-slate-400 transition-colors">Contact Us</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal (Sign In / Register UI) */}
      {isAuthOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl relative border border-slate-100">
            <button
              onClick={() => setIsAuthOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 font-bold text-xl"
            >
              ✕
            </button>

            <h3 className="text-2xl font-black text-slate-900 mb-2">
              {authMode === "signin" ? "Welcome Back" : "Create Account"}
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              {authMode === "signin"
                ? "Enter your credentials to access your account."
                : "Sign up to start sharing rides and splitting travel costs."}
            </p>

            {authMessage && (
              <div
                className={`p-3 rounded-xl text-xs font-semibold mb-4 text-center ${
                  authMessage.type === "success"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-rose-50 text-rose-700 border border-rose-200"
                }`}
              >
                {authMessage.text}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === "signup" && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-xs text-slate-400 font-bold hover:text-slate-600"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-600/20 text-sm mt-2 disabled:opacity-50"
              >
                {authLoading ? "Please wait..." : authMode === "signin" ? "Sign In" : "Register"}
              </button>
            </form>

            <div className="mt-6 text-center text-xs text-slate-500">
              {authMode === "signin" ? (
                <p>
                  Don't have an account?{" "}
                  <button
                    onClick={() => {
                      setAuthMode("signup");
                      setAuthMessage(null);
                    }}
                    className="text-emerald-600 font-bold hover:underline"
                  >
                    Register
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{" "}
                  <button
                    onClick={() => {
                      setAuthMode("signin");
                      setAuthMessage(null);
                    }}
                    className="text-emerald-600 font-bold hover:underline"
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