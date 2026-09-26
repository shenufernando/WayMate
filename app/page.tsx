"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Ride {
  _id: string;
  driver: string;
  from: string;
  to: string;
  date: string;
  seatsLeft: number;
  pricePerSeat: number;
  vehicle: string;
  rating?: string;
}

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

  const [fromSearch, setFromSearch] = useState("");
  const [toSearch, setToSearch] = useState("");
  const [travelDate, setTravelDate] = useState("");

  // Rides backend එකෙන් ලබා ගැනීම සඳහා State එක
  const [rides, setRides] = useState<Ride[]>([]);
  const [loadingRides, setLoadingRides] = useState<boolean>(true);

  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loadingBlogs, setLoadingBlogs] = useState<boolean>(true);

  // Backend API එකෙන් Rides දත්ත ලබා ගැනීම (Fetch)
  useEffect(() => {
    fetch("http://localhost:5000/api/rides")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setRides(data);
        }
        setLoadingRides(false);
      })
      .catch((err) => {
        console.error("Error fetching rides:", err);
        setLoadingRides(false);
      });
  }, []);

  // News/Blogs Fetch කිරීම
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

  const costPerPerson =
    totalCost && people > 0 ? (Number(totalCost) / people).toFixed(2) : "0.00";

  const filteredRides = rides.filter((ride) => {
    const matchesFrom = ride.from
      .toLowerCase()
      .includes(fromSearch.toLowerCase());
    const matchesTo = ride.to.toLowerCase().includes(toSearch.toLowerCase());
    const matchesDate = travelDate ? ride.date === travelDate : true;
    return matchesFrom && matchesTo && matchesDate;
  });

  // Auth Submit Handle කිරීම සහ Dashboard Redirect Logic එක
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);

    // Hardcoded Admin Check (Optional Quick Check)
    if (authMode === "signin" && email === "admin@gmail.com" && password === "admin123") {
      localStorage.setItem("userRole", "admin");
      localStorage.setItem("userEmail", email);
      router.push("/admin");
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
          ? { name: fullName, email, password }
          : { email, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.token) localStorage.setItem("token", data.token);
        localStorage.setItem("userRole", data.user?.role || "user");
        localStorage.setItem("userName", data.user?.name || fullName);
        localStorage.setItem("userEmail", data.user?.email || email);

        setIsAuthOpen(false);

        if (data.user?.role === "admin" || email === "admin@gmail.com") {
          router.push("/admin");
        } else {
          router.push("/user");
        }
      } else {
        alert(data.message || "Authentication failed!");
      }
    } catch (error) {
      console.error("Auth Error:", error);
      // Backend එක නැති විට Demo Mode redirection
      if (email === "admin@gmail.com") {
        router.push("/admin");
      } else {
        router.push("/user");
      }
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
            <a href="#routes" className="hover:text-emerald-600 transition-colors">
              Find Rides
            </a>
            <a href="#calculator" className="hover:text-emerald-600 transition-colors">
              Cost Splitter
            </a>
            <a href="#blogs" className="hover:text-emerald-600 transition-colors">
              News
            </a>
          </div>

          <div className="flex justify-end w-1/4">
            <button
              onClick={() => {
                setAuthMode("signin");
                setIsAuthOpen(true);
              }}
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
              Sri Lanka's #1 Ride Sharing Platform
            </span>
            <h2 className="text-5xl md:text-6xl font-black text-white leading-tight max-w-4xl drop-shadow-lg tracking-tight">
              Smart Travel &{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                Cost Sharing
              </span>{" "}
              Made Easy
            </h2>
            <p className="text-slate-200 mt-4 max-w-xl text-lg font-normal drop-shadow-md leading-relaxed">
              Plan your route, find travel mates, split expenses, and explore Sri Lanka together seamlessly.
            </p>

            {/* Search Box */}
            <div className="bg-white/95 backdrop-blur-xl p-3.5 rounded-2xl shadow-2xl mt-10 flex flex-col md:flex-row gap-3 w-full max-w-4xl border border-white/40">
              <input
                type="text"
                placeholder="From (e.g. Colombo)"
                value={fromSearch}
                onChange={(e) => setFromSearch(e.target.value)}
                className="bg-slate-50/80 border border-slate-200/80 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 flex-1 placeholder:text-slate-400 font-medium text-sm transition-all"
              />
              <input
                type="text"
                placeholder="To (e.g. Ella)"
                value={toSearch}
                onChange={(e) => setToSearch(e.target.value)}
                className="bg-slate-50/80 border border-slate-200/80 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 flex-1 placeholder:text-slate-400 font-medium text-sm transition-all"
              />
              <input
                type="date"
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                className="bg-slate-50/80 border border-slate-200/80 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-sm transition-all"
              />
              <a
                href="#routes"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-3 rounded-xl transition-all text-center flex items-center justify-center shadow-lg shadow-emerald-600/30 text-sm"
              >
                Find Matches
              </a>
            </div>
          </section>
        </div>

        {/* Features Section */}
        <section id="features" className="mt-28 pt-8 px-6 max-w-7xl mx-auto relative z-20">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-emerald-600 font-bold text-xs uppercase tracking-widest bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-200 inline-block mb-3 shadow-sm">
              Why WayMate
            </span>
            <h3 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Designed for <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">Smarter & Safer</span> Journeys
            </h3>
            <p className="text-slate-500 text-base mt-4 font-normal leading-relaxed">
              Everything you need to plan, connect, and save money while traveling across Sri Lanka with ease and security.
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
                  Smart Route Search
                </h4>
                <p className="text-slate-500 text-sm leading-relaxed font-normal">
                  Discover optimal travel routes across Sri Lanka with real-time seat availability and route matching.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-emerald-600">
                Explore Routes <span className="ml-1 transition-transform group-hover:translate-x-1">➔</span>
              </div>
            </div>

            <div className="group relative bg-white rounded-3xl p-8 border border-slate-200/70 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/5 rounded-bl-full -mr-4 -mt-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-emerald-500/10" />
              <div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-50 to-teal-50 border border-emerald-100 flex items-center justify-center text-emerald-600 text-2xl mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                  🚘
                </div>
                <h4 className="text-xl font-extrabold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors">
                  Verified Ride Match
                </h4>
                <p className="text-slate-500 text-sm leading-relaxed font-normal">
                  Connect securely with rated hosts and trustworthy co-travelers heading to your exact destination.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-emerald-600">
                Find Mates <span className="ml-1 transition-transform group-hover:translate-x-1">➔</span>
              </div>
            </div>

            <div className="group relative bg-white rounded-3xl p-8 border border-slate-200/70 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/5 rounded-bl-full -mr-4 -mt-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-emerald-500/10" />
              <div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-50 to-teal-50 border border-emerald-100 flex items-center justify-center text-emerald-600 text-2xl mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                  💸
                </div>
                <h4 className="text-xl font-extrabold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors">
                  Fair Cost Splitter
                </h4>
                <p className="text-slate-500 text-sm leading-relaxed font-normal">
                  Calculate and split fuel, tolls, and trip expenses transparently with zero hidden fees.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-emerald-600">
                Split Expenses <span className="ml-1 transition-transform group-hover:translate-x-1">➔</span>
              </div>
            </div>

            <div className="group relative bg-white rounded-3xl p-8 border border-slate-200/70 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/5 rounded-bl-full -mr-4 -mt-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-emerald-500/10" />
              <div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-50 to-teal-50 border border-emerald-100 flex items-center justify-center text-emerald-600 text-2xl mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                  🤖
                </div>
                <h4 className="text-xl font-extrabold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors">
                  AI Itinerary Planner
                </h4>
                <p className="text-slate-500 text-sm leading-relaxed font-normal">
                  Get personalized day-by-day travel plans tailored specifically to your budget and interests.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-emerald-600">
                Plan Trip <span className="ml-1 transition-transform group-hover:translate-x-1">➔</span>
              </div>
            </div>
          </div>
        </section>

        {/* Available Rides Section */}
        <section id="routes" className="mt-32 px-4 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-emerald-600 font-bold text-xs uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Verified Trips
            </span>
            <h3 className="text-3xl md:text-4xl font-black text-slate-900 mt-3 tracking-tight">
              Available <span className="text-emerald-600">Rides & Travel Mates</span>
            </h3>
            <p className="text-slate-500 text-sm mt-2 max-w-md mx-auto">
              Find verified drivers and fellow travelers sharing costs on your route.
            </p>
          </div>

          {loadingRides ? (
            <div className="flex justify-center items-center py-16">
              <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRides.length > 0 ? (
                filteredRides.map((ride) => (
                  <div
                    key={ride._id}
                    className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-5">
                        <span className="bg-emerald-50 text-emerald-700 text-xs px-3 py-1 rounded-lg font-bold border border-emerald-200/60 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                          {ride.vehicle}
                        </span>
                        <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg flex items-center gap-1">
                          ⭐ {ride.rating || "4.8"}
                        </span>
                      </div>

                      <div className="mb-6">
                        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-1">
                          <span>📅 {ride.date}</span>
                        </div>
                        <h4 className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-emerald-600 transition-colors">
                          {ride.from} <span className="text-emerald-500 font-normal">➔</span> {ride.to}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 font-medium flex items-center gap-1">
                          <span>👤 Host:</span> <strong className="text-slate-700">{ride.driver}</strong>
                        </p>
                      </div>

                      <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 flex justify-between items-center text-sm mb-6">
                        <div>
                          <span className="text-slate-400 block text-xs font-medium">Seats Left</span>
                          <span className="font-extrabold text-emerald-600 text-sm">{ride.seatsLeft} Seats</span>
                        </div>
                        <div className="h-8 w-px bg-slate-200"></div>
                        <div className="text-right">
                          <span className="text-slate-400 block text-xs font-medium">Price / Seat</span>
                          <span className="font-black text-slate-900 text-base">Rs. {Number(ride.pricePerSeat).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => alert(`Booking request sent to ${ride.driver}!`)}
                      className="w-full bg-slate-900 hover:bg-emerald-600 text-white font-bold py-3.5 rounded-xl transition-all duration-300 text-sm shadow-md shadow-slate-900/10 group-hover:shadow-emerald-600/20"
                    >
                      Request to Join
                    </button>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-16 text-slate-400 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
                  No rides found matching your search parameters.
                </div>
              )}
            </div>
          )}
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
                <li><a href="#routes" className="hover:text-emerald-400 transition-colors">Find Rides</a></li>
                <li><a href="#calculator" className="hover:text-emerald-400 transition-colors">Cost Splitter</a></li>
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
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 w-full max-w-md p-6 rounded-2xl shadow-2xl relative">
            <button
              onClick={() => setIsAuthOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-xl font-bold"
            >
              ✕
            </button>

            <h3 className="text-2xl font-bold text-slate-800 text-center mb-6">
              {authMode === "signin" ? "Welcome Back" : "Create Account"}
            </h3>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === "signup" && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-xs text-slate-500 font-semibold"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-emerald-600/20 text-sm mt-2 disabled:opacity-50"
              >
                {authLoading
                  ? "Processing..."
                  : authMode === "signin"
                  ? "Sign In"
                  : "Register"}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-500">
              {authMode === "signin" ? (
                <p>
                  Don't have an account?{" "}
                  <button
                    onClick={() => setAuthMode("signup")}
                    className="text-emerald-600 font-bold hover:underline"
                  >
                    Register
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{" "}
                  <button
                    onClick={() => setAuthMode("signin")}
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