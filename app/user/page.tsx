'use client';

import React, { useState } from 'react';

interface Attraction {
  id: string;
  name: string;
  location: string;
  image: string;
  bestTime: string;
  tips: string;
  description: string;
  entryFee: string;
}

const ATTRACTIONS: Attraction[] = [
  {
    id: '1',
    name: 'Sigiriya Rock Fortress',
    location: 'Matale District',
    image: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=800&q=80',
    bestTime: '6:30 AM - 9:00 AM',
    tips: 'Start early morning to avoid peak sun heat and heavy crowds. Carry plenty of water.',
    description: 'An ancient palace and fortress complex with significant archaeological importance and massive rock walls.',
    entryFee: '$36 / LKR 10,800'
  },
  {
    id: '2',
    name: 'Ella Nine Arches Bridge',
    location: 'Ella',
    image: 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=800&q=80',
    bestTime: '9:00 AM or 11:30 AM (Train Times)',
    tips: 'Check the train schedule beforehand to catch the iconic train crossing over the bridge.',
    description: 'A masterpiece of colonial-era railway construction hidden among lush tea plantations.',
    entryFee: 'Free'
  }
];

export default function UserDashboard() {
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div className="bg-[#0b1329] text-white py-14 px-4 text-center">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          Explore Top Attractions in Sri Lanka
        </h1>
        <p className="text-slate-300 text-sm sm:text-base mt-3 max-w-2xl mx-auto">
          Discover iconic landmarks, historical ruins, and natural wonders across the island.
        </p>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Must-Visit Destinations</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ATTRACTIONS.map((item) => (
            <div 
              key={item.id} 
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedAttraction(item)}
            >
              <img src={item.image} alt={item.name} className="h-48 w-full object-cover" />
              <div className="p-5">
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                  {item.location}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-2">{item.name}</h3>
                <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                  <span className="text-slate-500">Best Time: <b>{item.bestTime}</b></span>
                  <span className="font-bold text-emerald-600">{item.entryFee}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Detail Modal */}
      {selectedAttraction && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl relative">
            <button 
              onClick={() => setSelectedAttraction(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold"
            >
              ✕
            </button>
            <img src={selectedAttraction.image} alt={selectedAttraction.name} className="h-48 w-full object-cover rounded-xl mb-4" />
            <h3 className="text-xl font-bold text-slate-900">{selectedAttraction.name}</h3>
            <p className="text-xs text-slate-500 font-semibold mb-2">{selectedAttraction.location}</p>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">{selectedAttraction.description}</p>
            <div className="bg-slate-50 p-3 rounded-xl space-y-1 text-xs">
              <p>💡 <b>Visiting Tip:</b> {selectedAttraction.tips}</p>
              <p>🎟️ <b>Entry Fee:</b> {selectedAttraction.entryFee}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}