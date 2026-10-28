"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  Users,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Trash2,
  Ban,
  Check,
  X,
  RefreshCw,
} from "lucide-react";

interface TourBooking {
  _id: string;
  tourId: string;
  tourTitle: string;
  destination: string;
  userName: string;
  userEmail: string;
  startDate: string;
  endDate: string;
  passengers: number;
  totalPrice: number;
  notes?: string;
  status: "Pending" | "Accepted" | "Rejected" | "Cancelled";
  createdAt?: string;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<TourBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("All");

  // Fetch all bookings from backend
  const fetchAllBookings = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/tours/admin/bookings");
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      }
    } catch (error) {
      console.error("Failed to fetch all bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllBookings();
  }, []);

  // Update Booking Status (Accept / Reject / Cancel)
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    if (!confirm(`Are you sure you want to mark this booking as ${newStatus}?`)) return;

    try {
      const response = await fetch(`http://localhost:5000/api/tours/book/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        alert(`Booking status updated to ${newStatus}`);
        fetchAllBookings();
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Permanently Delete Booking
  const handleDeleteBooking = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this booking?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/tours/book/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Booking deleted successfully!");
        fetchAllBookings();
      } else {
        alert("Failed to delete booking.");
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (filterStatus === "All") return true;
    return b.status === filterStatus;
  });

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Bookings & Orders Management</h1>
            <p className="text-sm text-slate-500">
              Manage user tour package reservations, approve requests, and track status.
            </p>
          </div>

          <button
            onClick={fetchAllBookings}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh List
          </button>
        </div>

        {/* Status Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {["All", "Pending", "Accepted", "Rejected", "Cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                filterStatus === status
                  ? "bg-slate-800 text-white"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Booking Cards List */}
        {loading ? (
          <p className="text-center text-slate-500 py-12">Loading bookings...</p>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <p className="text-slate-500 text-sm">No bookings found for the selected status.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((b) => (
              <div
                key={b._id}
                className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-slate-400 font-semibold">
                      ID: {b._id.slice(-6).toUpperCase()}
                    </span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                        b.status === "Pending"
                          ? "bg-amber-100 text-amber-700"
                          : b.status === "Accepted"
                          ? "bg-emerald-100 text-emerald-700"
                          : b.status === "Rejected"
                          ? "bg-rose-100 text-rose-700"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {b.status === "Pending" && <AlertCircle className="w-3 h-3" />}
                      {b.status === "Accepted" && <CheckCircle2 className="w-3 h-3" />}
                      {b.status === "Rejected" && <XCircle className="w-3 h-3" />}
                      {b.status === "Cancelled" && <Ban className="w-3 h-3" />}
                      {b.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-800 text-base">{b.tourTitle}</h3>
                  
                  <div className="text-xs text-slate-600">
                    Booked by: <span className="font-semibold text-slate-800">{b.userName}</span> ({b.userEmail})
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {b.destination}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {b.startDate} to {b.endDate || "N/A"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      {b.passengers} Passenger(s)
                    </span>
                  </div>

                  {b.notes && (
                    <p className="text-xs bg-slate-50 p-2 rounded border border-slate-100 text-slate-600 mt-2">
                      <span className="font-semibold">Note:</span> {b.notes}
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-end gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Total Amount</span>
                    <span className="text-lg font-extrabold text-slate-800">
                      LKR {b.totalPrice.toLocaleString()}
                    </span>
                  </div>

                  {/* Admin Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    {b.status === "Pending" && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(b._id, "Accepted")}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" /> Accept
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(b._id, "Rejected")}
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" /> Reject
                        </button>
                      </>
                    )}

                    {b.status !== "Cancelled" && b.status !== "Rejected" && (
                      <button
                        onClick={() => handleUpdateStatus(b._id, "Cancelled")}
                        className="px-3 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Ban className="w-3.5 h-3.5" /> Cancel
                      </button>
                    )}

                    <button
                      onClick={() => handleDeleteBooking(b._id)}
                      className="px-3 py-1.5 bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}