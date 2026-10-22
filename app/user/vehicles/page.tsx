'use client';

import React, { useState } from 'react';

interface Vehicle {
  id: string;
  name: string;
  category: string;
  serviceType: 'Self-Drive' | 'With Driver' | 'Both';
  seats: number;
  ownerName: string;
  contactNumber: string;
  pricePerDay: number;
  pricePerKm?: number;
  image: string;
  features: string[];
  status: 'Approved' | 'Pending' | 'Rejected';
}

const DUMMY_VEHICLES: Vehicle[] = [
  {
    id: '1',
    name: 'Toyota KDH Super GL Van',
    category: 'Van / Minibus',
    serviceType: 'With Driver',
    seats: 9,
    ownerName: 'Kasun Silva',
    contactNumber: '94771234567',
    pricePerDay: 25000,
    pricePerKm: 180,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
    features: ['Dual AC', 'Reclining Seats', 'English Speaking Driver', 'Luggage Space'],
    status: 'Approved'
  },
  {
    id: '2',
    name: 'Honda Vezel Z Grade',
    category: 'SUV / Crossover',
    serviceType: 'Self-Drive',
    seats: 5,
    ownerName: 'Nuwan Perera',
    contactNumber: '94719876543',
    pricePerDay: 18000,
    pricePerKm: 120,
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    features: ['Automatic', 'Sunroof', 'Bluetooth', 'Unlimited Mileage Option'],
    status: 'Approved'
  }
];

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(DUMMY_VEHICLES);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // Form State for Posting New Vehicle
  const [postForm, setPostForm] = useState({
    name: '',
    category: 'Car',
    serviceType: 'With Driver',
    seats: 4,
    ownerName: '',
    contactNumber: '',
    pricePerDay: '',
    pricePerKm: '',
    image: '',
    features: ''
  });

  // Handle Image File Upload & Base64 Conversion
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPostForm((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Post Vehicle Form Submit
  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!postForm.image) {
      alert('Please upload a vehicle image!');
      return;
    }

    const newVehicle: Vehicle = {
      id: Date.now().toString(),
      name: postForm.name,
      category: postForm.category,
      serviceType: postForm.serviceType as any,
      seats: Number(postForm.seats),
      ownerName: postForm.ownerName,
      contactNumber: postForm.contactNumber,
      pricePerDay: Number(postForm.pricePerDay),
      pricePerKm: postForm.pricePerKm ? Number(postForm.pricePerKm) : undefined,
      image: postForm.image,
      features: postForm.features.split(',').map((f) => f.trim()),
      status: 'Pending' // Admin Approval එක සඳහා Pending ලෙස යැවීම
    };

    setVehicles([newVehicle, ...vehicles]);
    alert('Your vehicle post has been submitted successfully! Waiting for Admin verification.');
    setIsPostModalOpen(false);
    setPostForm({
      name: '',
      category: 'Car',
      serviceType: 'With Driver',
      seats: 4,
      ownerName: '',
      contactNumber: '',
      pricePerDay: '',
      pricePerKm: '',
      image: '',
      features: ''
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      {/* Header Banner */}
      <div className="bg-[#0b1329] text-white py-12 px-4 text-center relative shadow-md">
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight">Private Vehicles & Drivers</h1>
        <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-2xl mx-auto">
          Rent vehicles for self-drive or book verified local drivers across Sri Lanka.
        </p>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <div>
            <h2 className="text-lg font-extrabold text-slate-800">Available Rental Vehicles</h2>
            <p className="text-xs text-slate-500">Browse verified listings or offer your own vehicle</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPostModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              🚗 Post Your Vehicle
            </button>
          </div>
        </div>

        {/* Vehicle Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((v) => (
            <div
              key={v.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-44 w-full overflow-hidden rounded-xl bg-slate-100">
                  <img
                    src={v.image}
                    alt={v.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-md">
                    {v.serviceType}
                  </span>
                  <span className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-md">
                    🪑 {v.seats} Seats
                  </span>
                  {v.status === 'Pending' && (
                    <span className="absolute bottom-3 left-3 bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-md">
                      ⏳ Pending Approval
                    </span>
                  )}
                </div>

                <div className="mt-4">
                  <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">{v.category}</span>
                  <h3 className="text-lg font-extrabold text-slate-900 leading-snug">{v.name}</h3>

                  <p className="text-xs text-slate-500 mt-1">
                    Owner: <span className="font-semibold text-slate-800">{v.ownerName}</span>
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {v.features.map((f, i) => (
                      <span key={i} className="text-[10px] bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded-md border border-slate-200/60">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100 flex justify-between items-center">
                <div>
                  <span className="text-emerald-600 font-black text-lg">
                    LKR {v.pricePerDay.toLocaleString()}{' '}
                    <span className="text-[10px] text-slate-500 font-normal">/ day</span>
                  </span>
                  {v.pricePerKm && (
                    <p className="text-[10px] text-slate-400 font-medium">LKR {v.pricePerKm} per KM</p>
                  )}
                </div>

                <button
                  onClick={() => setSelectedVehicle(v)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-4 py-2.5 rounded-xl font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
                >
                  Book Request
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* 1. Modal: Post Your Vehicle Form */}
      {isPostModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsPostModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 font-bold text-lg"
            >
              ✕
            </button>
            <h3 className="text-xl font-black text-slate-800 mb-1">Post Your Vehicle / Driver Service</h3>
            <p className="text-xs text-slate-500 mb-4">List your vehicle for hire. Admin review required before public listing.</p>

            <form onSubmit={handlePostSubmit} className="space-y-3 text-xs font-semibold">
              <div>
                <label className="block text-slate-700 mb-1">Vehicle Name / Model</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Toyota Axio / KDH Van"
                  value={postForm.name}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  onChange={(e) => setPostForm({ ...postForm, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">Service Option</label>
                  <select
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
                    value={postForm.serviceType}
                    onChange={(e) => setPostForm({ ...postForm, serviceType: e.target.value as any })}
                  >
                    <option value="With Driver">With Driver</option>
                    <option value="Self-Drive">Self-Drive</option>
                    <option value="Both">Both Options</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">Seats Capacity</label>
                  <input
                    type="number"
                    required
                    value={postForm.seats}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
                    onChange={(e) => setPostForm({ ...postForm, seats: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">Daily Rate (LKR)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 15000"
                    value={postForm.pricePerDay}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
                    onChange={(e) => setPostForm({ ...postForm, pricePerDay: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">Rate per KM (Optional)</label>
                  <input
                    type="number"
                    placeholder="e.g. 150"
                    value={postForm.pricePerKm}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
                    onChange={(e) => setPostForm({ ...postForm, pricePerKm: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">Owner Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={postForm.ownerName}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
                    onChange={(e) => setPostForm({ ...postForm, ownerName: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">WhatsApp / Contact No</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 94771234567"
                    value={postForm.contactNumber}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
                    onChange={(e) => setPostForm({ ...postForm, contactNumber: e.target.value })}
                  />
                </div>
              </div>

              {/* File Image Upload */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <label className="block text-slate-700 mb-1">Upload Vehicle Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 cursor-pointer"
                />
                {postForm.image && (
                  <div className="mt-2 flex items-center gap-2">
                    <img src={postForm.image} alt="Preview" className="w-14 h-14 object-cover rounded-lg border" />
                    <span className="text-[11px] text-emerald-600 font-bold">Image Uploaded Successfully!</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Key Features (Comma separated)</label>
                <input
                  type="text"
                  placeholder="AC, Bluetooth, Automatic..."
                  value={postForm.features}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
                  onChange={(e) => setPostForm({ ...postForm, features: e.target.value })}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold transition-all shadow-md mt-2 cursor-pointer"
              >
                Submit Listing for Admin Approval
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. Modal: Booking Request Form */}
      {selectedVehicle && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedVehicle(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 font-bold text-lg"
            >
              ✕
            </button>

            <h3 className="text-xl font-black text-slate-800 mb-1">Book Request</h3>
            <p className="text-xs text-slate-500 mb-4">Requesting: <span className="font-bold text-emerald-600">{selectedVehicle.name}</span></p>

            <div className="space-y-3 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 mb-1">Pickup Date</label>
                  <input type="date" className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none" />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">Return Date</label>
                  <input type="date" className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Destination / Route</label>
                <input type="text" placeholder="e.g. Colombo to Ella" className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none" />
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Special Notes / Passengers</label>
                <textarea rows={2} placeholder="Any specific requirements..." className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none" />
              </div>

              <button
                onClick={() => {
                  alert(`Booking Request Sent to Owner (${selectedVehicle.ownerName})! You will get notified once confirmed.`);
                  setSelectedVehicle(null);
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold transition-all shadow-md mt-2 cursor-pointer"
              >
                Send Request to Owner
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}