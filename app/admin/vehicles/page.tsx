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
  createdAt: string;
}

export default function AdminVehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterStatus, setFilterStatus] = useState<string>('All');

  // 1. Fetch all vehicles for Admin view
  const fetchAllVehicles = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/vehicles/all');
      const data = await response.json();
      if (Array.isArray(data)) {
        setVehicles(data);
      }
    } catch (error) {
      console.error('Error fetching all vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllVehicles();
  }, []);

  // 2. Handle status change (Approve / Reject)
  const handleStatusChange = async (id: string, newStatus: 'Approved' | 'Rejected') => {
    try {
      const response = await fetch(`http://localhost:5000/api/vehicles/status/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        alert(`Vehicle status successfully updated to ${newStatus}!`);
        fetchAllVehicles(); // Refresh list
      } else {
        alert('Failed to update status.');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Server connection error.');
    }
  };

  // 3. Handle vehicle deletion
  const handleDeleteVehicle = async (id: string, modelName: string) => {
    const isConfirmed = confirm(`Are you sure you want to delete "${modelName}"? This action cannot be undone.`);
    
    if (!isConfirmed) return;

    try {
      const response = await fetch(`http://localhost:5000/api/vehicles/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Vehicle listing deleted successfully!');
        fetchAllVehicles(); // Refresh list
      } else {
        alert('Failed to delete vehicle listing.');
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      alert('Server connection error.');
    }
  };

  // Filter vehicles based on selected tab
  const filteredVehicles = vehicles.filter((v) => {
    if (filterStatus === 'All') return true;
    return v.status === filterStatus;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      {/* Light Header Banner (Matching Manage Attractions layout) */}
      <div className="pt-2 pb-6">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Manage Vehicles & Drivers</h1>
        <p className="text-slate-500 text-xs mt-1">Review, approve, reject, or delete user-submitted vehicle rental listings.</p>
      </div>

      <main className="max-w-7xl mx-auto">
        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-2">
            {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filterStatus === status
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500">
              Total Listings: <span className="font-bold text-slate-800">{filteredVehicles.length}</span>
            </span>
          </div>
        </div>

        {/* Vehicles Table / Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.length > 0 ? (
              filteredVehicles.map((v) => (
                <div
                  key={v._id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-44 w-full overflow-hidden rounded-xl bg-slate-100">
                      <img src={v.image} alt={v.vehicleModel} className="h-full w-full object-cover" />
                      <span className="absolute top-3 left-3 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-1 rounded">
                        {v.serviceType}
                      </span>
                      <span
                        className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded text-white ${
                          v.status === 'Approved'
                            ? 'bg-emerald-600'
                            : v.status === 'Pending'
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                      >
                        {v.status}
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

                  {/* Moderation Actions & Delete Button */}
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
                    {v.status !== 'Approved' && (
                      <button
                        onClick={() => handleStatusChange(v._id, 'Approved')}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs py-2 rounded-xl font-bold transition-all shadow-sm cursor-pointer"
                      >
                        Approve
                      </button>
                    )}
                    {v.status !== 'Rejected' && (
                      <button
                        onClick={() => handleStatusChange(v._id, 'Rejected')}
                        className="flex-1 bg-amber-500 hover:bg-amber-600 text-white text-xs py-2 rounded-xl font-bold transition-all shadow-sm cursor-pointer"
                      >
                        Reject
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteVehicle(v._id, v.vehicleModel)}
                      className="bg-rose-600 hover:bg-rose-700 text-white text-xs px-3 py-2 rounded-xl font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1"
                      title="Delete Listing"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-16 text-slate-400 bg-white rounded-2xl border border-slate-200">
                No vehicle listings found under this filter.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}