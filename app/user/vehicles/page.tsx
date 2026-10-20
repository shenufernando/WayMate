'use client';

import React from 'react';

interface Vehicle {
  id: string;
  name: string;
  category: string;
  seats: number;
  driverName: string;
  pricePerDay: number;
  image: string;
  features: string[];
}

const VEHICLES: Vehicle[] = [
  {
    id: '1',
    name: 'Toyota KDH Super GL Van',
    category: 'Van / Minibus',
    seats: 9,
    driverName: 'Sunil Perera',
    pricePerDay: 85,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
    features: ['Dual AC', 'Reclining Seats', 'English Speaking Driver', 'Luggage Space']
  }
];

export default function VehiclesPage() {
  return (
    <div className="min-h-screen">
      <div className="bg-[#0b1329] text-white py-14 px-4 text-center">
        <h1 className="text-3xl sm:text-5xl font-extrabold">Private Vehicles & Drivers</h1>
        <p className="text-slate-300 text-sm sm:text-base mt-3">Book verified drivers with comfortable vehicles for your travel.</p>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {VEHICLES.map((v) => (
            <div key={v.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <img src={v.image} alt={v.name} className="h-44 w-full object-cover rounded-xl" />
              <div className="mt-4">
                <h3 className="text-lg font-bold text-slate-900">{v.name}</h3>
                <p className="text-xs text-slate-500 mt-1">Driver: <span className="font-semibold text-slate-800">{v.driverName}</span></p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {v.features.map((f, i) => (
                    <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{f}</span>
                  ))}
                </div>
                <div className="mt-5 flex justify-between items-center pt-3 border-t border-slate-100">
                  <span className="text-emerald-600 font-extrabold text-lg">${v.pricePerDay} <span className="text-xs text-slate-500 font-normal">/ day</span></span>
                  <button className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-4 py-2 rounded-xl font-bold">Book Driver</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}