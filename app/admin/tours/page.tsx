"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit3, MapPin, X } from "lucide-react";

interface TourPackage {
  _id?: string;
  title: string;
  destination: string;
  duration: string;
  pricePerPerson: number;
  image: string;
  category: string;
  description: string;
  includes: string[];
}

export default function AdminToursPage() {
  const [tours, setTours] = useState<TourPackage[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingTourId, setEditingTourId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [duration, setDuration] = useState("");
  const [pricePerPerson, setPricePerPerson] = useState<number | "">("");
  const [imageBase64, setImageBase64] = useState("");
  const [category, setCategory] = useState("Nature & Hill Country");
  const [description, setDescription] = useState("");
  const [includesInput, setIncludesInput] = useState("");

  // Categories list tailored for Sri Lanka Tourism
  const categories = [
    "Nature & Hill Country",
    "Adventure & Hiking",
    "Cultural & Heritage",
    "Beach & Coastal Getaways",
    "Wildlife & Safari",
    "Honeymoon & Luxury",
    "Day Tours & Excursions"
  ];

  // Fetch Existing Tours from Backend
  const fetchTours = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/tours");
      if (response.ok) {
        const data = await response.json();
        setTours(data);
      }
    } catch (error) {
      console.error("Failed to fetch tours:", error);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  // Handle File Upload and Convert to Base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Open Modal for Editing an Existing Tour
  const handleEditClick = (tour: TourPackage) => {
    setEditingTourId(tour._id || null);
    setTitle(tour.title);
    setDestination(tour.destination);
    setDuration(tour.duration);
    setPricePerPerson(tour.pricePerPerson);
    setImageBase64(tour.image);
    setCategory(tour.category);
    setDescription(tour.description);
    setIncludesInput(tour.includes.join(", "));
    setIsModalOpen(true);
  };

  // Reset Form & Close Modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTourId(null);
    setTitle("");
    setDestination("");
    setDuration("");
    setPricePerPerson("");
    setImageBase64("");
    setDescription("");
    setIncludesInput("");
  };

  // Submit New or Updated Tour Package
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageBase64) {
      alert("Please upload an image for the package!");
      return;
    }

    setLoading(true);

    const tourPayload = {
      title,
      destination,
      duration,
      pricePerPerson: Number(pricePerPerson),
      image: imageBase64,
      category,
      description,
      includes: includesInput.split(",").map((item) => item.trim()),
      itinerary: [
        { day: 1, title: "Day 1 Exploration", desc: "Arrival and local sights." }
      ]
    };

    try {
      const url = editingTourId
        ? `http://localhost:5000/api/tours/${editingTourId}`
        : "http://localhost:5000/api/tours";
      
      const method = editingTourId ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tourPayload),
      });

      if (response.ok) {
        alert(editingTourId ? "Tour Package updated successfully!" : "Tour Package created successfully!");
        handleCloseModal();
        fetchTours();
      } else {
        alert("Failed to save tour package.");
      }
    } catch (error) {
      console.error("Error saving tour package:", error);
      alert("Error connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  // Delete Tour Package
  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this tour package?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/tours/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Tour package deleted successfully!");
        fetchTours();
      } else {
        alert("Failed to delete tour package.");
      }
    } catch (error) {
      console.error("Error deleting tour package:", error);
      alert("Error connecting to server.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Manage Tour Packages</h1>
            <p className="text-sm text-slate-500">Create, edit, view, and delete group tour packages.</p>
          </div>
          <button
            onClick={() => {
              setEditingTourId(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add New Package
          </button>
        </div>

        {/* Tour List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tours.map((tour) => (
            <div key={tour._id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col justify-between">
              <div>
                <img src={tour.image} alt={tour.title} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <span className="text-xs font-semibold text-emerald-600 uppercase">{tour.category}</span>
                  <h3 className="font-bold text-slate-800 text-lg mb-1">{tour.title}</h3>
                  <p className="text-xs text-slate-500 mb-3 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {tour.destination} • {tour.duration}
                  </p>
                  <div className="text-sm font-bold text-slate-800 mb-2">
                    LKR {tour.pricePerPerson.toLocaleString()} / person
                  </div>
                </div>
              </div>

              {/* Action Buttons: Edit & Delete */}
              <div className="flex border-t border-slate-100 bg-slate-50 p-3 gap-2">
                <button
                  onClick={() => handleEditClick(tour)}
                  className="flex-1 py-1.5 bg-blue-50 text-blue-600 text-xs font-semibold rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(tour._id)}
                  className="flex-1 py-1.5 bg-rose-50 text-rose-600 text-xs font-semibold rounded-lg hover:bg-rose-100 transition-colors flex items-center justify-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CREATE / EDIT PACKAGE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 relative shadow-xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={handleCloseModal}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-slate-800 mb-4">
              {editingTourId ? "Edit Tour Package" : "Add New Tour Package"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Package Title</label>
                <input
                  type="text"
                  required
                  placeholder="E.g., Nuwara Eliya 3-Day Tour"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Destination</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g., Nuwara Eliya"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Duration</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g., 3 Days / 2 Nights"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Price Per Person (LKR)</label>
                  <input
                    type="number"
                    required
                    placeholder="25000"
                    value={pricePerPerson}
                    onChange={(e) => setPricePerPerson(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Upload Image File Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Upload Package Image</label>
                <div className="flex items-center gap-3 border border-slate-200 bg-slate-50 rounded-lg p-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                  />
                </div>
                {imageBase64 && (
                  <div className="mt-2 relative w-full h-28 rounded-lg overflow-hidden border border-slate-200">
                    <img src={imageBase64} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Includes (Comma separated)</label>
                <input
                  type="text"
                  placeholder="Hotel Accommodation, Meals, AC Transport"
                  value={includesInput}
                  onChange={(e) => setIncludesInput(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Brief description of the package..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-emerald-600 text-white font-semibold text-sm rounded-lg hover:bg-emerald-700 transition-colors"
              >
                {loading ? "Saving..." : editingTourId ? "Update Package" : "Save Package"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}