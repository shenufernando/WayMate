"use client";

import React, { useState } from "react";
import { Sparkles, MapPin, Calendar, DollarSign, Users, Compass, Bookmark, Download, ArrowRight, CheckCircle2 } from "lucide-react";

export default function AITripPlannerPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [destination, setDestination] = useState("");
  const [duration, setDuration] = useState("3 Days / 2 Nights");
  const [budget, setBudget] = useState("Mid-range (LKR 30k - 100k)");
  const [travelerType, setTravelerType] = useState("Couple");
  const [interests, setInterests] = useState<string[]>([]);

  // Generated Plan State
  const [aiPlan, setAiPlan] = useState<any>(null);

  // Sri Lanka Context Specific Options
  const travelerOptions = [
    "Solo Traveler", 
    "Couple", 
    "Family with Kids", 
    "Group of Friends", 
    "Honeymooners", 
    "Senior Citizens"
  ];

  const interestOptions = [
    "Adventure & Hiking",
    "Relaxation & Beaches",
    "Culture & History",
    "Wildlife & Nature",
    "Food & Nightlife",
    "Hill Country & Tea Trails",
    "Pilgrimage & Religious",
    "Ayurveda & Wellness",
    "Village & Eco Tours",
    "Scenic Photography"
  ];

  // Handle interest selection toggle
  const handleInterestToggle = (item: string) => {
    if (interests.includes(item)) {
      setInterests(interests.filter((i) => i !== item));
    } else {
      setInterests([...interests, item]);
    }
  };

  // Handle generating trip plan by sending request to backend AI endpoint
  const handleGeneratePlan = async () => {
    if (!destination) {
      alert("Please enter a destination!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/ai/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination,
          duration,
          budget,
          travelerType,
          interests
        })
      });

      const resData = await response.json();
      if (resData.success) {
        setAiPlan(resData.data);
        setStep(3);
      }
    } catch (error) {
      console.error("Error generating trip:", error);
      alert("Failed to generate trip plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen py-10 px-4 md:px-8 flex items-center justify-center">
      {/* Background Image with Dark Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=1920&auto=format&fit=crop')` 
        }}
      >
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
      </div>

      <div className="relative z-10 max-w-4xl w-full mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold mb-3 shadow-sm">
            <Sparkles className="w-4 h-4 text-emerald-400" /> WayMate AI Engine
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Smart AI Trip Planner
          </h1>
          <p className="text-slate-200 text-sm mt-2 max-w-lg mx-auto">
            Get personalized Sri Lankan travel itineraries tailored to your budget in LKR & preferences instantly.
          </p>
        </div>

        {/* STEP 1 & 2: INPUT WIZARD FORM */}
        {step < 3 && (
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6 md:p-8">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
              <span className="text-xs font-bold text-emerald-600">
                {step === 1 ? '1. Destination & Travelers' : '2. Budget (LKR) & Vibe'}
              </span>
            </div>

            {/* Step 1 Form Fields */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-600" /> Destination / Region
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ella, Kandy, Galle, Nuwara Eliya"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-emerald-600" /> Trip Duration
                    </label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                    >
                      <option>1 Day</option>
                      <option>2 Days / 1 Night</option>
                      <option>3 Days / 2 Nights</option>
                      <option>5 Days / 4 Nights</option>
                      <option>7 Days / 6 Nights</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-emerald-600" /> Who is Traveling?
                    </label>
                    <select
                      value={travelerType}
                      onChange={(e) => setTravelerType(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                    >
                      {travelerOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  onClick={() => setStep(2)}
                  className="w-full mt-4 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-md"
                >
                  Next Step <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Step 2 Form Fields */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-emerald-600" /> Budget Level (LKR)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      "Budget (Under LKR 30k)", 
                      "Mid-range (LKR 30k - 100k)", 
                      "Luxury (LKR 100k+)"
                    ].map((b) => (
                      <button
                        key={b}
                        onClick={() => setBudget(b)}
                        className={`py-3 px-3 rounded-xl text-xs font-bold border transition text-center ${
                          budget === b
                            ? "border-emerald-600 bg-emerald-50 text-emerald-700 shadow-sm"
                            : "border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-emerald-600" /> Travel Vibe & Interests
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {interestOptions.map((item) => (
                      <button
                        key={item}
                        onClick={() => handleInterestToggle(item)}
                        className={`px-3 py-2 rounded-lg text-xs font-semibold border transition ${
                          interests.includes(item)
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setStep(1)}
                    className="w-1/3 py-3 bg-slate-100 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-200 transition"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleGeneratePlan}
                    disabled={loading}
                    className="w-2/3 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-md"
                  >
                    {loading ? (
                      "Generating Plan with AI..."
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" /> Generate Trip Plan
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: ITINERARY DISPLAY VIEW */}
        {step === 3 && aiPlan && (
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6 md:p-8 space-y-6">
            
            {/* Target Banner Image Area Only */}
            <div className="relative h-72 md:h-80 rounded-2xl overflow-hidden shadow-lg bg-slate-900">
              <img 
                src="https://www.ceylontraveldream.com/images/sri-lanka-tours/sri-lanka-tours.jpg" 
                alt={aiPlan.destination || "Destination"}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-black/20 flex flex-col justify-end p-6 md:p-8 text-white">
                <span className="text-xs bg-emerald-500 text-white font-bold px-3 py-1 rounded-full w-fit mb-2 shadow-sm border border-emerald-400/30">
                  ✨ AI Generated Itinerary
                </span>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white drop-shadow-md">
                  {aiPlan.destination} Expedition
                </h2>
                <p className="text-sm text-slate-200 mt-2 max-w-2xl font-medium leading-relaxed drop-shadow">
                  {aiPlan.summary}
                </p>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <button
                onClick={() => setStep(1)}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 transition flex items-center gap-1"
              >
                ← Create New Plan
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert("Saved to My Trips!")}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 transition flex items-center gap-1.5 shadow-sm"
                >
                  <Bookmark className="w-3.5 h-3.5 text-slate-500" /> Save to My Trips
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 transition flex items-center gap-1.5 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" /> Download PDF
                </button>
                
                <a
                  href="/vehicles"
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 shadow-sm"
                >
                  Book with WayMate
                </a>
              </div>
            </div>

            {/* Itinerary Details */}
            <div className="space-y-4">
              {aiPlan.itinerary.map((dayItem: any) => (
                <div key={dayItem.day} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-slate-900 text-white text-xs font-extrabold px-2.5 py-1 rounded-md">
                      Day {dayItem.day}
                    </span>
                    <h3 className="font-bold text-slate-800 text-base">{dayItem.title}</h3>
                  </div>

                  <div className="space-y-3 pl-2 border-l-2 border-slate-100 ml-3">
                    {dayItem.activities.map((act: any, idx: number) => (
                      <div key={idx} className="flex items-start gap-3 pl-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5" />
                        <div>
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">{act.time}</span>
                          <p className="text-xs text-slate-700 font-medium mt-1">{act.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}