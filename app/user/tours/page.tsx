'use client';

import React from 'react';

interface TourPackage {
  id: string;
  title: string;
  organizer: string;
  duration: string;
  price: number;
  image: string;
}

const TOURS: TourPackage[] = [
  {
    id: '1',
    title: 'Cultural Triangle & Hill Country Magic',
    organizer: 'Ceylon Discovery Tours (Pvt) Ltd',
    duration: '5 Days / 4 Nights',
    price: 450,
    image: 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=800&q=80'
  }
];

export default function ToursPage() {
  return (
    <div className="min-h-screen">
      <div className="bg-[#0b1329] text-white py-14 px-4 text-center">
        <h1 className="text-3xl sm:text-5xl font-extrabold">Group Tour Packages</h1>
        <p className="text-slate-300 text-sm sm:text-base mt-3">Curated island tours guided by industry professionals.</p>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TOURS.map((t) => (
            <div key={t.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
              <img src={t.image} alt={t.title} className="h-40 md:w-48 object-cover rounded-xl" />
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">{t.duration}</span>
                  <h3 className="text-lg font-bold text-slate-900 mt-2">{t.title}</h3>
                  <p className="text-xs text-slate-500">Organized by {t.organizer}</p>
                </div>
                <div className="mt-4 flex justify-between items-center pt-3 border-t border-slate-100">
                  <span className="text-emerald-600 font-extrabold text-lg">${t.price} <span className="text-xs text-slate-500 font-normal">/ person</span></span>
                  <button className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-4 py-2 rounded-xl font-bold">View Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}