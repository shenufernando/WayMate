"use client";
import { useState, useEffect } from "react";

interface Attraction {
  _id: string;
  title: string;
  location: string;
  image: string;
  shortDescription: string;
  fullDescription: string;
  bestTime: string;
  entryFee: string;
}

export default function UserDashboard() {
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch attractions data from Backend API
  useEffect(() => {
    fetch("http://localhost:5000/api/attractions")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setAttractions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching attractions:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col justify-between">
      <div>
        {/* The Navigation Bar section has been removed. (It will be displayed automatically via app/user/layout.tsx) */}

        {/* Hero Banner Section */}
        <div className="bg-slate-900 text-white py-8 px-4 text-center relative overflow-hidden shadow-md">
          <div className="max-w-4xl mx-auto relative z-10">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">
              Explore Top Attractions in Sri Lanka
            </h1>
            <p className="text-slate-300 text-xs md:text-sm font-normal max-w-2xl mx-auto">
              Discover iconic landmarks, historical ruins, and natural wonders across the island.
            </p>
          </div>
        </div>

        {/* Main Content Section */}
        <main className="max-w-7xl mx-auto px-6 py-6" id="attractions">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 tracking-tight">
            Must-Visit Destinations
          </h2>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {attractions.length > 0 ? (
                attractions.map((place) => (
                  <div
                    key={place._id}
                    className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between group"
                  >
                    <div>
                      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                        <img
                          src={place.image}
                          alt={place.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-5">
                        <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-md border border-emerald-200/60 inline-block mb-2">
                          {place.location}
                        </span>
                        <h3 className="text-xl font-extrabold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
                          {place.title}
                        </h3>
                        <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">
                          {place.shortDescription}
                        </p>
                      </div>
                    </div>

                    <div className="p-5 pt-0">
                      <button
                        onClick={() => setSelectedAttraction(place)}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-sm active:scale-98 cursor-pointer"
                      >
                        More
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-16 text-slate-400 bg-white rounded-2xl border border-slate-200/80">
                  No destinations available right now.
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Detail Modal Popup */}
      {selectedAttraction && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative border border-slate-100 animate-in fade-in zoom-in duration-200">
            {/* Close Button (✕) on Top Right Corner */}
            <button
              onClick={() => setSelectedAttraction(null)}
              className="absolute top-4 right-4 bg-slate-900/70 hover:bg-slate-900 text-white w-9 h-9 rounded-full flex items-center justify-center font-bold text-base shadow-md z-10 transition-colors cursor-pointer"
            >
              ✕
            </button>

            <div className="relative h-60 w-full bg-slate-100">
              <img
                src={selectedAttraction.image}
                alt={selectedAttraction.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6">
              <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-md border border-emerald-200/60 inline-block mb-2">
                {selectedAttraction.location}
              </span>
              <h3 className="text-2xl font-black text-slate-900 mb-3">
                {selectedAttraction.title}
              </h3>

              <p className="text-slate-600 text-sm leading-relaxed mb-6 max-h-40 overflow-y-auto pr-1">
                {selectedAttraction.fullDescription}
              </p>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center text-xs font-semibold text-slate-700">
                <div>
                  🕒 Best Time: <span className="text-slate-900 font-bold">{selectedAttraction.bestTime}</span>
                </div>
                <div>
                  🎟️ Entry: <span className="text-emerald-600 font-bold">{selectedAttraction.entryFee}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}