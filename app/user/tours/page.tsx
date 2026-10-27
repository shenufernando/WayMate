"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Calendar,
  Users,
  Clock,
  CheckCircle2,
  X,
  Info,
  ShieldCheck,
  Briefcase,
  AlertCircle,
  XCircle,
} from "lucide-react";

// Types
interface TourPackage {
  _id: string;
  title: string;
  destination: string;
  duration: string;
  pricePerPerson: number;
  image: string;
  category: string;
  description: string;
  includes: string[];
  itinerary: { day: number; title: string; desc: string }[];
}

interface TourBooking {
  _id: string;
  tourId: string;
  tourTitle: string;
  destination: string;
  userName: string;
  userEmail: string;
  bookingDate?: string;
  startDate: string;
  passengers: number;
  totalPrice: number;
  notes?: string;
  status: "Pending" | "Accepted" | "Cancelled";
}

export default function UserToursPage() {
  const [activeTab, setActiveTab] = useState<"browse" | "myBookings">("browse");
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // State for fetched packages & bookings
  const [tours, setTours] = useState<TourPackage[]>([]);
  const [myBookings, setMyBookings] = useState<TourBooking[]>([]);
  const [loading, setLoading] = useState(false);

  // Modals
  const [selectedTour, setSelectedTour] = useState<TourPackage | null>(null);
  const [bookingTour, setBookingTour] = useState<TourPackage | null>(null);

  // Booking Form Fields
  const [startDate, setStartDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [notes, setNotes] = useState("");

  const userEmail = "user@example.com"; // Replace with actual authenticated user email

  // Updated Categories list matching Admin panel
  const categories = [
    "All",
    "Nature & Hill Country",
    "Adventure & Hiking",
    "Cultural & Heritage",
    "Beach & Coastal Getaways",
    "Wildlife & Safari",
    "Day Tours & Excursions",
    "Honeymoon & Luxury",
  ];

  // Fetch Tour Packages from Backend API
  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/tours");
        if (response.ok) {
          const data = await response.json();
          setTours(data);
        }
      } catch (error) {
        console.error("Failed to fetch tour packages:", error);
      }
    };

    fetchTours();
  }, []);

  // Fetch User Bookings from Backend API
  const fetchMyBookings = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/tours/user/${userEmail}`);
      if (response.ok) {
        const data = await response.json();
        setMyBookings(data);
      }
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "myBookings") {
      fetchMyBookings();
    }
  }, [activeTab]);

  // Filtered Packages
  const filteredTours = tours.filter((tour) => {
    const matchesSearch =
      tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tour.destination.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || tour.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Handle Submit Booking Request to API
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingTour) return;

    const bookingPayload = {
      tourId: bookingTour._id,
      tourTitle: bookingTour.title,
      destination: bookingTour.destination,
      userName: "User Name", // Replace with authenticated user name
      userEmail: userEmail,
      startDate,
      passengers,
      totalPrice: bookingTour.pricePerPerson * passengers,
      notes,
    };

    try {
      const response = await fetch("http://localhost:5000/api/tours/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingPayload),
      });

      if (response.ok) {
        alert("Booking request submitted successfully!");
        setBookingTour(null);
        setStartDate("");
        setPassengers(1);
        setNotes("");
        setActiveTab("myBookings");
      } else {
        alert("Failed to submit booking request.");
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
      alert("Error connecting to server.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Group Tour Packages</h1>
        <p className="text-slate-600 mt-1">
          Explore handcrafted group travel packages and manage your tour reservations.
        </p>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 mt-6 gap-6">
          <button
            onClick={() => setActiveTab("browse")}
            className={`pb-3 font-semibold text-sm transition-colors border-b-2 ${
              activeTab === "browse"
                ? "border-emerald-600 text-emerald-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Explore Tour Packages
          </button>
          <button
            onClick={() => setActiveTab("myBookings")}
            className={`pb-3 font-semibold text-sm transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === "myBookings"
                ? "border-emerald-600 text-emerald-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            My Tour Bookings
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto">
        {/* TAB 1: BROWSE TOURS */}
        {activeTab === "browse" && (
          <div>
            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search destination or package..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                      selectedCategory === cat
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Tour Package Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTours.map((tour) => (
                <div
                  key={tour._id}
                  className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col"
                >
                  <div className="relative h-48 w-full">
                    <img
                      src={tour.image}
                      alt={tour.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-slate-800 font-bold text-xs px-2.5 py-1 rounded-full">
                      {tour.duration}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1 text-emerald-600 text-xs font-semibold mb-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {tour.destination}
                      </div>
                      <h3 className="font-bold text-slate-800 text-lg mb-2">
                        {tour.title}
                      </h3>
                      <p className="text-slate-500 text-xs line-clamp-2 mb-4">
                        {tour.description}
                      </p>
                    </div>

                    <div>
                      <div className="flex justify-between items-end pt-3 border-t border-slate-100 mb-4">
                        <div>
                          <span className="text-xs text-slate-400 block">Price per person</span>
                          <span className="text-xl font-extrabold text-slate-800">
                            LKR {tour.pricePerPerson.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setSelectedTour(tour)}
                          className="w-full py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-200 transition-colors"
                        >
                          More Details
                        </button>
                        <button
                          onClick={() => setBookingTour(tour)}
                          className="w-full py-2 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                          Book Request
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: MY BOOKINGS */}
        {activeTab === "myBookings" && (
          <div>
            {loading ? (
              <p className="text-center text-slate-500 py-8">Loading bookings...</p>
            ) : myBookings.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm">
                <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-700">No Tour Bookings Found</h3>
                <p className="text-slate-500 text-sm mt-1">
                  You haven't requested any tour packages yet.
                </p>
                <button
                  onClick={() => setActiveTab("browse")}
                  className="mt-4 px-5 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Browse Packages
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {myBookings.map((b) => (
                  <div
                    key={b._id}
                    className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-mono text-xs text-slate-400 font-semibold">
                          ID: {b._id.slice(-6).toUpperCase()}
                        </span>
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                            b.status === "Pending"
                              ? "bg-amber-100 text-amber-700"
                              : b.status === "Accepted"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-rose-100 text-rose-700"
                          }`}
                        >
                          {b.status === "Pending" && <AlertCircle className="w-3 h-3" />}
                          {b.status === "Accepted" && <CheckCircle2 className="w-3 h-3" />}
                          {b.status === "Cancelled" && <XCircle className="w-3 h-3" />}
                          {b.status}
                        </span>
                      </div>

                      <h3 className="font-bold text-slate-800 text-base">
                        {b.tourTitle}
                      </h3>

                      <div className="flex flex-wrap gap-4 text-xs text-slate-500 mt-2">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {b.destination}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          Start Date: {b.startDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          {b.passengers} Passenger(s)
                        </span>
                      </div>
                    </div>

                    <div className="flex md:flex-col justify-between items-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                      <div className="text-right">
                        <span className="text-xs text-slate-400 block">Total Price</span>
                        <span className="text-lg font-extrabold text-slate-800">
                          LKR {b.totalPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* PACKAGE DETAILS MODAL */}
      {selectedTour && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative shadow-xl">
            <button
              onClick={() => setSelectedTour(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={selectedTour.image}
              alt={selectedTour.title}
              className="w-full h-52 object-cover rounded-xl mb-4"
            />

            <h2 className="text-2xl font-bold text-slate-800 mb-1">
              {selectedTour.title}
            </h2>
            <p className="text-xs text-emerald-600 font-semibold mb-4 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {selectedTour.destination} • {selectedTour.duration}
            </p>

            <p className="text-slate-600 text-sm mb-6">{selectedTour.description}</p>

            {/* Includes */}
            <div className="mb-6">
              <h4 className="font-bold text-slate-800 text-sm mb-2">Package Includes:</h4>
              <div className="grid grid-cols-2 gap-2">
                {selectedTour.includes.map((inc, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    {inc}
                  </div>
                ))}
              </div>
            </div>

            {/* Itinerary */}
            <div className="mb-6">
              <h4 className="font-bold text-slate-800 text-sm mb-2">Trip Itinerary:</h4>
              <div className="space-y-3">
                {selectedTour.itinerary.map((item) => (
                  <div key={item.day} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="text-xs font-bold text-emerald-600 block">
                      Day {item.day}: {item.title}
                    </span>
                    <span className="text-xs text-slate-500">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <div>
                <span className="text-xs text-slate-400 block">Price Per Person</span>
                <span className="text-xl font-bold text-slate-800">
                  LKR {selectedTour.pricePerPerson.toLocaleString()}
                </span>
              </div>
              <button
                onClick={() => {
                  setBookingTour(selectedTour);
                  setSelectedTour(null);
                }}
                className="px-6 py-2.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Proceed to Book
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BOOKING MODAL FORM */}
      {bookingTour && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 relative shadow-xl">
            <button
              onClick={() => setBookingTour(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-800 mb-1">
              Book Tour Request
            </h3>
            <p className="text-xs text-slate-500 mb-4">{bookingTour.title}</p>

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Number of Passengers / Seats
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  required
                  value={passengers}
                  onChange={(e) => setPassengers(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Special Notes / Requirements (Optional)
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="E.g., Vegetarian food preferred, pickup point details..."
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100 flex justify-between items-center">
                <span className="text-xs font-semibold text-emerald-800">
                  Total Estimated Amount:
                </span>
                <span className="text-base font-extrabold text-emerald-700">
                  LKR {(bookingTour.pricePerPerson * passengers).toLocaleString()}
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 text-white font-semibold text-sm rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
              >
                Confirm & Send Request
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}