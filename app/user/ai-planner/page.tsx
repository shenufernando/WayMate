'use client';

import React, { useState } from 'react';

export default function AIPlannerPage() {
  const [planDays, setPlanDays] = useState(3);
  const [planBudget, setPlanBudget] = useState('Comfort');
  const [generatedPlan, setGeneratedPlan] = useState<string | null>(null);

  const handleGeneratePlan = (e: React.FormEvent) => {
    e.preventDefault();
    setGeneratedPlan(
      `Here is your ${planDays}-day customized Sri Lanka itinerary (${planBudget} budget):\n\n` +
      `Day 1: Arrival & Pickup. Transfer to Cultural Hub.\n` +
      `Day 2: Morning visit to iconic highlights and wildlife safari.\n` +
      `Day 3: Scenic train ride and departure.`
    );
  };

  return (
    <div className="min-h-screen">
      <div className="bg-[#0b1329] text-white py-14 px-4 text-center">
        <h1 className="text-3xl sm:text-5xl font-extrabold">AI Trip Planner</h1>
        <p className="text-slate-300 text-sm sm:text-base mt-3">Generate a custom travel plan in seconds using AI.</p>
      </div>

      <main className="max-w-xl mx-auto px-4 py-10">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <form onSubmit={handleGeneratePlan} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Duration (Days)</label>
              <input
                type="number"
                value={planDays}
                onChange={(e) => setPlanDays(Number(e.target.value))}
                className="w-full border border-slate-200 p-2.5 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Budget Type</label>
              <select 
                value={planBudget} 
                onChange={(e) => setPlanBudget(e.target.value)}
                className="w-full border border-slate-200 p-2.5 rounded-xl text-xs"
              >
                <option value="Economy">Economy</option>
                <option value="Comfort">Comfort</option>
                <option value="Luxury">Luxury</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs transition-all">
              Generate Custom Itinerary
            </button>
          </form>

          {generatedPlan && (
            <div className="mt-6 p-4 bg-slate-900 text-emerald-400 rounded-xl text-xs font-mono whitespace-pre-wrap">
              {generatedPlan}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}