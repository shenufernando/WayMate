"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Types Definitions
interface Destination {
  id: string;
  name: string;
  district: string;
  image: string;
  description: string;
  bestTimeToVisit: string;
  attractions: string[];
  travelTip: string;
}

interface Driver {
  name: string;
  phone: string;
  avatar: string;
  rating: number;
  tripsCompleted: number;
  isNicVerified: boolean;
  isLicenseVerified: boolean;
  experienceYears: number;
}

interface Vehicle {
  id: string;
  title: string;
  type: "Car" | "SUV" | "Van" | "Luxury Spec";
  seats: number;
  airConditioned: boolean;
  pricePerDay: number;
  image: string;
  driver: Driver;
}

interface GroupTour {
  id: string;
  title: string;
  organizer: string;
  image: string;
  startDate: string;
  duration: string;
  seatsLeft: number;
  pricePerPerson: number;
  included: string[];
}

export default function AdvancedUserDashboard() {
  const router = useRouter();
  const [userName] = useState("Kasuni Perera");
  const [activeTab, setActiveTab] = useState<"destinations" | "private-rentals" | "group-tours">("destinations");

  // Selected Items for Modals
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // 1. Popular Sri Lanka Destinations Data with High Quality Images
  const destinations: Destination[] = [
    {
      id: "dest-1",
      name: "Sigiriya Rock Fortress",
      district: "Matale District",
      image: "https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=1000&q=80",
      description: "Sigiriya is an ancient rock fortress located in the northern Matale District near the town of Dambulla in the Central Province, Sri Lanka. It is a site of historical and archaeological significance that is dominated by a massive column of rock nearly 200 metres high.",
      bestTimeToVisit: "7:00 AM - 10:00 AM (To avoid afternoon heat)",
      attractions: ["Mirror Wall & Frescoes", "Lion's Paw Entrance", "Water Gardens", "Pidurangala Rock Viewpoint"],
      travelTip: "Wear comfortable walking shoes and carry enough water for the 1,200-step climb.",
    },
    {
      id: "dest-2",
      name: "Ella Mountain Village",
      district: "Badulla District",
      image: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1000&q=80",
      description: "Ella is a small, quiet town surrounded by the beautiful hills of Sri Lanka. It is world-famous for its misty mountain views, waterfalls, tea plantations, and relaxing atmosphere.",
      bestTimeToVisit: "All year round (Best for sunrise hiking)",
      attractions: ["Nine Arches Bridge", "Little Adam's Peak", "Ravana Falls", "Ella Rock Trail"],
      travelTip: "Catch the morning train from Kandy to Ella for one of the world's most scenic rail journeys.",
    },
    {
      id: "dest-3",
      name: "Galle Dutch Fort",
      district: "Southern Coast",
      image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1000&q=80",
      description: "Galle Fort is a UNESCO World Heritage site built first by the Portuguese, then extensively fortified by the Dutch during the 17th century. A vibrant pedestrian enclave filled with boutiques, cafes, and ramparts.",
      bestTimeToVisit: "4:30 PM - 6:30 PM (Perfect for sunset views)",
      attractions: ["Galle Lighthouse", "Dutch Reformed Church", "Old Dutch Hospital Complex", "Rampart Walk"],
      travelTip: "Great place for colonial architecture, luxury shopping, and romantic evening walks.",
    },
    {
      id: "dest-4",
      name: "Mirissa Beach & Whale Watching",
      district: "Matara District",
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1000&q=80",
      description: "Mirissa is one of Sri Lanka's top beach destinations, famous for blue whale watching expeditions, nightlife, surfing spots, and coconut-fringed shorelines.",
      bestTimeToVisit: "November to April (Whale season)",
      attractions: ["Coconut Tree Hill", "Secret Beach", "Whale Watching Harbor", "Parrot Rock"],
      travelTip: "Book boat tours early morning (6:30 AM) for higher chances of seeing Blue Whales.",
    }
  ];

  // 2. Private Vehicles for Family Trips Data (Verified Drivers)
  const privateVehicles: Vehicle[] = [
    {
      id: "veh-1",
      title: "Toyota KDH High Roof Luxury Van",
      type: "Van",
      seats: 10,
      airConditioned: true,
      pricePerDay: 18500,
      image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80",
      driver: {
        name: "Sunil Shantha Perera",
        phone: "+94 77 345 8890",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
        rating: 4.95,
        tripsCompleted: 340,
        isNicVerified: true,
        isLicenseVerified: true,
        experienceYears: 12,
      },
    },
    {
      id: "veh-2",
      title: "Toyota Land Cruiser Prado (4x4)",
      type: "SUV",
      seats: 7,
      airConditioned: true,
      pricePerDay: 24000,
      image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
      driver: {
        name: "Nimal Jayasinghe",
        phone: "+94 71 882 1144",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
        rating: 4.88,
        tripsCompleted: 215,
        isNicVerified: true,
        isLicenseVerified: true,
        experienceYears: 8,
      },
    },
    {
      id: "veh-3",
      title: "Honda Vezel Hybrid SUV",
      type: "Car",
      seats: 4,
      airConditioned: true,
      pricePerDay: 12500,
      image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80",
      driver: {
        name: "Chaminda Silva",
        phone: "+94 75 112 3344",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
        rating: 4.92,
        tripsCompleted: 180,
        isNicVerified: true,
        isLicenseVerified: true,
        experienceYears: 6,
      },
    }
  ];

  // 3. Organised Group Tour Packages
  const groupTours: GroupTour[] = [
    {
      id: "tour-1",
      title: "3-Day Hill Country Exploration (Kandy, Nuwara Eliya & Ella)",
      organizer: "WayMate Official Expeditions",
      image: "https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=800&q=80",
      startDate: "2026-10-15",
      duration: "3 Days / 2 Nights",
      seatsLeft: 4,
      pricePerPerson: 22500,
      included: ["Luxury AC Bus Transport", "3-Star Hotel Stay", "Breakfast & Dinner", "Tour Guide Included"],
    },
    {
      id: "tour-2",
      title: "Southern Beach & Whale Safari Getaway",
      organizer: "Lanka Wild Travels",
      image: "https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&w=800&q=80",
      startDate: "2026-10-22",
      duration: "2 Days / 1 Night",
      seatsLeft: 6,
      pricePerPerson: 16000,
      included: ["AC Transport", "Whale Boat Tickets", "Beachside Hotel Stay", "Barbecue Dinner"],
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Top Header Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-4 flex justify-between items-center shadow-xs">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-black text-emerald-600 tracking-tight flex items-center gap-2">
            <span>🚀</span> Way<span className="text-teal-600">Mate</span>
          </h1>
          <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 hidden md:inline-block">
            Sri Lanka Travel Hub
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-black flex items-center justify-center border border-emerald-300">
              {userName.charAt(0)}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-black text-slate-800 leading-none">{userName}</p>
              <p className="text-[10px] font-bold text-emerald-600 mt-0.5">Verified Member</p>
            </div>
          </div>
          <button
            onClick={() => {
              localStorage.clear();
              router.push("/");
            }}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3.5 py-2 rounded-xl transition-all"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Banner Section */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 mb-8 relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl">
            <span className="bg-emerald-500/20 text-emerald-300 text-xs font-extrabold px-3 py-1 rounded-full border border-emerald-500/30 uppercase tracking-wide">
              All-In-One Travel Portal
            </span>
            <h2 className="text-3xl sm:text-4xl font-black mt-3 tracking-tight">
              Plan Your Next Adventure in Sri Lanka 🇱🇰
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
              Explore ancient palaces and beaches, rent a private vehicle with verified drivers for your family, or join organized group tours directly through WayMate!
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4 mb-8">
          <button
            onClick={() => setActiveTab("destinations")}
            className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all ${
              activeTab === "destinations"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            🌴 Top Attractions & Places
          </button>

          <button
            onClick={() => setActiveTab("private-rentals")}
            className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all ${
              activeTab === "private-rentals"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            🚐 Private Family Vehicle Rentals
          </button>

          <button
            onClick={() => setActiveTab("group-tours")}
            className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all ${
              activeTab === "group-tours"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            🎟️ Organised Group Tours
          </button>
        </div>

        {/* TAB 1: DESTINATIONS & PLACES TO VISIT */}
        {activeTab === "destinations" && (
          <div>
            <div className="mb-6">
              <h3 className="text-xl font-black text-slate-900">Explore Famous Places & Historical Sites</h3>
              <p className="text-xs text-slate-500">Click "View Full Details" to learn about attraction spots, best visiting times, and travel tips.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {destinations.map((place) => (
                <div key={place.id} className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden flex flex-col sm:flex-row hover:shadow-md transition-all">
                  <div className="sm:w-1/2 h-52 sm:h-auto relative">
                    <img src={place.image} alt={place.name} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 bg-slate-900/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg backdrop-blur-xs">
                      📍 {place.district}
                    </span>
                  </div>
                  <div className="sm:w-1/2 p-5 flex flex-col justify-between">
                    <div>
                      <h4 className="text-lg font-black text-slate-900 mb-2">{place.name}</h4>
                      <p className="text-xs text-slate-600 line-clamp-3 mb-4">{place.description}</p>
                    </div>

                    <button
                      onClick={() => setSelectedDestination(place)}
                      className="w-full bg-slate-900 hover:bg-emerald-600 text-white font-bold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-1"
                    >
                      📖 View Full Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: PRIVATE FAMILY VEHICLE RENTALS */}
        {activeTab === "private-rentals" && (
          <div>
            <div className="mb-6">
              <h3 className="text-xl font-black text-slate-900">Private Vehicle Rentals for Families & Groups</h3>
              <p className="text-xs text-slate-500">Book dedicated vehicles with background-checked and government-verified drivers.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {privateVehicles.map((vehicle) => (
                <div key={vehicle.id} className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all">
                  <div>
                    <div className="relative h-48">
                      <img src={vehicle.image} alt={vehicle.title} className="w-full h-full object-cover" />
                      <span className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-extrabold px-3 py-1 rounded-full shadow-md">
                        Rs. {vehicle.pricePerDay.toLocaleString()} / Day
                      </span>
                    </div>

                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-black text-slate-900 text-base">{vehicle.title}</h4>
                      </div>

                      <div className="flex gap-2 mb-4">
                        <span className="bg-slate-100 text-slate-700 text-[10px] font-extrabold px-2.5 py-1 rounded-md border border-slate-200">
                          💺 {vehicle.seats} Passenger Seats
                        </span>
                        <span className="bg-slate-100 text-slate-700 text-[10px] font-extrabold px-2.5 py-1 rounded-md border border-slate-200">
                          ❄️ {vehicle.airConditioned ? "A/C Enabled" : "Non-A/C"}
                        </span>
                      </div>

                      {/* Driver Verification Card */}
                      <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 mb-2">
                        <div className="flex items-center gap-3">
                          <img src={vehicle.driver.avatar} alt="Driver" className="w-11 h-11 rounded-full object-cover border-2 border-emerald-500" />
                          <div className="flex-1">
                            <div className="flex items-center gap-1">
                              <p className="text-xs font-black text-slate-900">{vehicle.driver.name}</p>
                              <span className="text-emerald-600 text-xs" title="Verified Driver">✓</span>
                            </div>
                            <p className="text-[10px] font-semibold text-slate-500">⭐ {vehicle.driver.rating} • {vehicle.driver.experienceYears} Years Exp.</p>
                          </div>
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
                          <span className="text-emerald-700 font-extrabold bg-emerald-100 px-2 py-0.5 rounded-md">
                            🛡️ NIC Verified
                          </span>
                          <span className="text-teal-700 font-extrabold bg-teal-100 px-2 py-0.5 rounded-md">
                            📜 Driving License Verified
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <button
                      onClick={() => setSelectedVehicle(vehicle)}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-md"
                    >
                      Book Vehicle & Driver
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ORGANISED GROUP TOURS */}
        {activeTab === "group-tours" && (
          <div>
            <div className="mb-6">
              <h3 className="text-xl font-black text-slate-900">Pre-Organised Group Tour Packages</h3>
              <p className="text-xs text-slate-500">Join pre-planned trips organized by registered travel agencies directly through our portal.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {groupTours.map((tour) => (
                <div key={tour.id} className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden flex flex-col md:flex-row hover:shadow-lg transition-all">
                  <div className="md:w-1/2 h-56 md:h-auto relative">
                    <img src={tour.image} alt={tour.title} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-[10px] font-black px-3 py-1 rounded-full shadow-md">
                      🔥 Only {tour.seatsLeft} Seats Left
                    </span>
                  </div>

                  <div className="md:w-1/2 p-6 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider">{tour.organizer}</span>
                      <h4 className="text-base font-black text-slate-900 mt-1 mb-2">{tour.title}</h4>
                      
                      <div className="space-y-1 text-xs font-semibold text-slate-600 mb-4">
                        <p>📅 Departure: <strong>{tour.startDate}</strong></p>
                        <p>⏳ Duration: <strong>{tour.duration}</strong></p>
                      </div>

                      <div className="mb-4">
                        <p className="text-[10px] font-extrabold text-slate-400 uppercase mb-1">Package Includes:</p>
                        <div className="flex flex-wrap gap-1">
                          {tour.included.map((item, idx) => (
                            <span key={idx} className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-200">
                              ✓ {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block">Price per seat</span>
                        <span className="text-base font-black text-slate-900">Rs. {tour.pricePerPerson.toLocaleString()}</span>
                      </div>
                      <button
                        onClick={() => alert(`Successfully reserved seat for ${tour.title}!`)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md"
                      >
                        Join Trip
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* MODAL 1: DESTINATION DETAILS MODAL */}
      {selectedDestination && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl relative p-6 sm:p-8">
            <button
              onClick={() => setSelectedDestination(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 font-black text-xl"
            >
              ✕
            </button>

            <div className="h-64 -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 mb-6 relative">
              <img src={selectedDestination.image} alt={selectedDestination.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent flex items-end p-6">
                <div>
                  <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-md mb-2 inline-block">
                    {selectedDestination.district}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white">{selectedDestination.name}</h3>
                </div>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-700">
              <div>
                <h4 className="font-black text-slate-900 text-sm uppercase text-emerald-600 mb-1">About the Attraction</h4>
                <p className="leading-relaxed text-slate-600">{selectedDestination.description}</p>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl text-amber-900">
                <span className="font-extrabold block mb-0.5">⏰ Best Time to Visit:</span>
                <p className="text-xs font-semibold">{selectedDestination.bestTimeToVisit}</p>
              </div>

              <div>
                <h4 className="font-black text-slate-900 text-sm uppercase text-emerald-600 mb-2">Key Places & Highlights to See</h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedDestination.attractions.map((spot, i) => (
                    <div key={i} className="bg-slate-100 p-2.5 rounded-xl font-bold text-slate-800 flex items-center gap-2 text-xs border border-slate-200">
                      <span>🏛️</span> {spot}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900 text-white p-4 rounded-2xl">
                <p className="text-xs text-slate-300">💡 <strong>Traveler Tip:</strong> {selectedDestination.travelTip}</p>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  onClick={() => {
                    setSelectedDestination(null);
                    setActiveTab("private-rentals");
                  }}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-xs transition-all text-center"
                >
                  Book Private Vehicle to {selectedDestination.name}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: VEHICLE BOOKING MODAL */}
      {selectedVehicle && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 w-full max-w-lg p-6 sm:p-8 rounded-3xl shadow-2xl relative">
            <button
              onClick={() => setSelectedVehicle(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 font-black text-xl"
            >
              ✕
            </button>

            <h3 className="text-xl font-black text-slate-900 mb-1">Confirm Private Vehicle Reservation</h3>
            <p className="text-xs text-slate-500 mb-6">Your driver will be notified once you complete the details below.</p>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 mb-4 flex items-center gap-3">
              <img src={selectedVehicle.driver.avatar} alt="Driver" className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500" />
              <div>
                <p className="text-xs font-black text-slate-900">{selectedVehicle.driver.name} (Assigned Driver)</p>
                <p className="text-[10px] font-semibold text-emerald-600">✓ Govt. Identity (NIC) & Driving License Verified</p>
                <p className="text-[10px] text-slate-500">Vehicle: {selectedVehicle.title}</p>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert(`Booking confirmed for ${selectedVehicle.title} with driver ${selectedVehicle.driver.name}!`);
                setSelectedVehicle(null);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Travel Date</label>
                <input type="date" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pickup Location</label>
                <input type="text" placeholder="e.g. Colombo Airport / Your Home Address" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>

              <div className="pt-2">
                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3.5 rounded-xl transition-all shadow-md text-xs">
                  Confirm Booking (Rs. {selectedVehicle.pricePerDay.toLocaleString()} / Day)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}