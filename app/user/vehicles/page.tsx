'use client';

import React, { useState, useEffect } from 'react';

interface Vehicle {
  _id: string;
  ownerName: string;
  ownerContact: string;
  vehicleType: string;
  vehicleModel: string;
  capacity: number;
  serviceType: 'Self-drive' | 'With driver';
  pricePerDay: number;
  pricePerKm?: number;
  image: string;
  location: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  features?: string[];
}

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [myListings, setMyListings] = useState<Vehicle[]>([]);
  const [activeTab, setActiveTab] = useState<'browse' | 'myListings'>('browse');
  const [loading, setLoading] = useState<boolean>(true);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // Form State for Posting New Vehicle
  const [postForm, setPostForm] = useState({
    vehicleModel: '',
    vehicleType: 'Car',
    serviceType: 'With driver',
    capacity: 4,
    ownerName: '',
    ownerContact: '',
    pricePerDay: '',
    pricePerKm: '',
    location: '',
    image: '',
    features: ''
  });

  // 1. Fetch Approved Vehicles for Public Browse
  const fetchApprovedVehicles = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/vehicles/approved');
      const data = await response.json();
      if (Array.isArray(data)) {
        setVehicles(data);
      }
    } catch (error) {
      console.error('Error fetching approved vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Fetch ALL vehicles to let user track their own posts (Pending, Approved, Rejected)
  const fetchAllVehiclesForTracking = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/vehicles/all');
      const data = await response.json();
      if (Array.isArray(data)) {
        setMyListings(data);
      }
    } catch (error) {
      console.error('Error fetching all listings:', error);
    }
  };

  useEffect(() => {
    fetchApprovedVehicles();
    fetchAllVehiclesForTracking();
  }, []);

  // 3. Handle Image Upload & Convert to Base64
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

  // 4. Submit New Vehicle to Backend API
  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!postForm.image) {
      alert('Please upload an image of the vehicle!');
      return;
    }

    const payload = {
      ownerName: postForm.ownerName,
      ownerContact: postForm.ownerContact,
      vehicleType: postForm.vehicleType,
      vehicleModel: postForm.vehicleModel,
      capacity: Number(postForm.capacity),
      serviceType: postForm.serviceType,
      pricePerDay: Number(postForm.pricePerDay),
      pricePerKm: postForm.pricePerKm ? Number(postForm.pricePerKm) : 0,
      location: postForm.location || 'Sri Lanka',
      image: postForm.image,
      features: postForm.features ? postForm.features.split(',').map((f) => f.trim()) : []
    };

    try {
      const response = await fetch('http://localhost:5000/api/vehicles/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert('Your vehicle listing has been submitted successfully! Waiting for Admin approval.');
        setIsPostModalOpen(false);
        
        // Reset Form State
        setPostForm({
          vehicleModel: '',
          vehicleType: 'Car',
          serviceType: 'With driver',
          capacity: 4,
          ownerName: '',
          ownerContact: '',
          pricePerDay: '',
          pricePerKm: '',
          location: '',
          image: '',
          features: ''
        });

        // Refresh Lists
        fetchApprovedVehicles();
        fetchAllVehiclesForTracking();
      } else {
        const errData = await response.json();
        alert(`Failed to submit: ${errData.error || 'Server error'}`);
      }
    } catch (error) {
      console.error('Error submitting vehicle:', error);
      alert('Could not connect to the server. Please ensure Backend is running.');
    }
  };

  // 5. Delete User's Own Vehicle Listing
  const handleDeleteMyListing = async (id: string, modelName: string) => {
    const isConfirmed = confirm(`Are you sure you want to delete your submission for "${modelName}"?`);
    if (!isConfirmed) return;

    try {
      const response = await fetch(`http://localhost:5000/api/vehicles/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Your vehicle listing has been deleted successfully!');
        fetchApprovedVehicles();
        fetchAllVehiclesForTracking();
      } else {
        alert('Failed to delete the listing.');
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      alert('Server connection error.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      {/* Header Banner */}
      <div className="bg-[#0b1329] text-white py-10 px-4 text-center relative shadow-md">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Private Vehicles & Drivers</h1>
        <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-2xl mx-auto">
          Rent vehicles for self-drive or book verified local drivers across Sri Lanka.
        </p>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Actions Bar & View Toggle Tabs */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('browse')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'browse'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              🚗 Browse Approved Vehicles
            </button>
            <button
              onClick={() => setActiveTab('myListings')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'myListings'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              📋 Track My Submissions / Status
            </button>
          </div>

          <button
            onClick={() => setIsPostModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            ➕ Post Your Vehicle
          </button>
        </div>

        {/* Content Display based on Active Tab */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div>
            {activeTab === 'browse' ? (
              /* Browse Approved Vehicles */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehicles.length > 0 ? (
                  vehicles.map((v) => (
                    <div
                      key={v._id}
                      className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                    >
                      <div>
                        <div className="relative h-44 w-full overflow-hidden rounded-xl bg-slate-100">
                          <img
                            src={v.image}
                            alt={v.vehicleModel}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-md">
                            {v.serviceType}
                          </span>
                          <span className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-md">
                            🪑 {v.capacity} Seats
                          </span>
                        </div>

                        <div className="mt-4">
                          <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">{v.vehicleType}</span>
                          <h3 className="text-lg font-extrabold text-slate-900 leading-snug">{v.vehicleModel}</h3>

                          <p className="text-xs text-slate-500 mt-1">
                            Owner: <span className="font-semibold text-slate-800">{v.ownerName}</span>
                          </p>

                          {v.location && (
                            <p className="text-xs text-slate-400 mt-0.5">📍 {v.location}</p>
                          )}
                        </div>
                      </div>

                      <div className="mt-6 pt-3 border-t border-slate-100 flex justify-between items-center">
                        <div>
                          <span className="text-emerald-600 font-black text-lg">
                            LKR {v.pricePerDay?.toLocaleString()}{' '}
                            <span className="text-[10px] text-slate-500 font-normal">/ day</span>
                          </span>
                          {v.pricePerKm ? (
                            <p className="text-[10px] text-slate-400 font-medium">LKR {v.pricePerKm} per KM</p>
                          ) : null}
                        </div>

                        <button
                          onClick={() => setSelectedVehicle(v)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-4 py-2.5 rounded-xl font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
                        >
                          Book Request
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-16 text-slate-400 bg-white rounded-2xl border border-slate-200">
                    No approved vehicles available at the moment.
                  </div>
                )}
              </div>
            ) : (
              /* Track My Submissions & Status with Delete Option */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myListings.length > 0 ? (
                  myListings.map((v) => (
                    <div
                      key={v._id}
                      className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between"
                    >
                      <div>
                        <div className="relative h-44 w-full overflow-hidden rounded-xl bg-slate-100">
                          <img src={v.image} alt={v.vehicleModel} className="h-full w-full object-cover" />
                          <span className="absolute top-3 left-3 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-1 rounded">
                            {v.serviceType}
                          </span>
                          {/* Status Badge */}
                          <span
                            className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded text-white ${
                              v.status === 'Approved'
                                ? 'bg-emerald-600'
                                : v.status === 'Pending'
                                ? 'bg-amber-500'
                                : 'bg-rose-500'
                            }`}
                          >
                            {v.status === 'Pending' && '⏳ Pending Admin Approval'}
                            {v.status === 'Approved' && '✅ Approved & Live'}
                            {v.status === 'Rejected' && '❌ Rejected by Admin'}
                          </span>
                        </div>

                        <div className="mt-4">
                          <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">{v.vehicleType}</span>
                          <h3 className="text-lg font-extrabold text-slate-900">{v.vehicleModel}</h3>

                          <div className="mt-2 text-xs text-slate-600 space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <p>👤 Owner: <span className="font-bold text-slate-800">{v.ownerName}</span></p>
                            <p>📞 Contact: <span className="font-bold text-slate-800">{v.ownerContact}</span></p>
                            <p>📍 Location: <span className="font-bold text-slate-800">{v.location}</span></p>
                            <p>💰 Daily Rate: <span className="font-bold text-emerald-600">LKR {v.pricePerDay?.toLocaleString()}</span></p>
                          </div>
                        </div>
                      </div>

                      <div>
                        {v.status === 'Rejected' && (
                          <div className="mt-4 bg-rose-50 border border-rose-200 p-2.5 rounded-xl text-[11px] text-rose-700 font-semibold text-center">
                            ⚠️ Your listing was rejected by admin.
                          </div>
                        )}
                        {v.status === 'Pending' && (
                          <div className="mt-4 bg-amber-50 border border-amber-200 p-2.5 rounded-xl text-[11px] text-amber-700 font-semibold text-center">
                            🕒 Waiting for moderation.
                          </div>
                        )}

                        {/* Delete Button for User's Submission */}
                        <button
                          onClick={() => handleDeleteMyListing(v._id, v.vehicleModel)}
                          className="w-full mt-4 bg-rose-600 hover:bg-rose-700 text-white text-xs py-2.5 rounded-xl font-bold transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          🗑️ Delete Listing
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-16 text-slate-400 bg-white rounded-2xl border border-slate-200">
                    You haven't posted any vehicle listings yet.
                  </div>
                )}
              </div>
            )}
          </div>
        )}
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
                <label className="block text-slate-700 mb-1">Vehicle Model / Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Toyota Axio / KDH Van"
                  value={postForm.vehicleModel}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  onChange={(e) => setPostForm({ ...postForm, vehicleModel: e.target.value })}
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
                    <option value="With driver">With Driver</option>
                    <option value="Self-drive">Self-Drive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">Seats Capacity</label>
                  <input
                    type="number"
                    required
                    value={postForm.capacity}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
                    onChange={(e) => setPostForm({ ...postForm, capacity: Number(e.target.value) })}
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
                    placeholder="e.g. 0771234567"
                    value={postForm.ownerContact}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
                    onChange={(e) => setPostForm({ ...postForm, ownerContact: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Location / City</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Colombo, Kandy"
                  value={postForm.location}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
                  onChange={(e) => setPostForm({ ...postForm, location: e.target.value })}
                />
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
                    <span className="text-[11px] text-emerald-600 font-bold">Image Selected!</span>
                  </div>
                )}
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
            <p className="text-xs text-slate-500 mb-4">Requesting: <span className="font-bold text-emerald-600">{selectedVehicle.vehicleModel}</span></p>

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
                  alert(`Booking Request Sent to Owner (${selectedVehicle.ownerName})! Owner Contact: ${selectedVehicle.ownerContact}`);
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