"use client";
import { useState, useEffect } from "react";

interface Attraction {
  _id: string;
  title: string;
  location: string;
  image: string;
  shortDescription: string;
  fullDescription: string;
  bestTime: string;
  entryFee: string;
}

export default function ManageAttractionsPage() {
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    image: "",
    shortDescription: "",
    fullDescription: "",
    bestTime: "",
    entryFee: "",
  });

  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Fetch Existing Attractions
  const fetchAttractions = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/attractions");
      const data = await res.json();
      if (Array.isArray(data)) setAttractions(data);
    } catch (err) {
      console.error("Error fetching attractions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttractions();
  }, []);

  // Handle Text Inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Image File Upload & Base64 Conversion
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit New Attraction
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.image) {
      setMessage({ type: "error", text: "Please select an image file to upload!" });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch("http://localhost:5000/api/attractions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Attraction added successfully!" });
        setFormData({
          title: "",
          location: "",
          image: "",
          shortDescription: "",
          fullDescription: "",
          bestTime: "",
          entryFee: "",
        });
        fetchAttractions();
      } else {
        setMessage({ type: "error", text: "Failed to add attraction." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Server connection failed!" });
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Attraction
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this attraction?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/attractions/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setAttractions(attractions.filter((item) => item._id !== id));
      } else {
        alert("Failed to delete attraction.");
      }
    } catch (err) {
      console.error("Error deleting attraction:", err);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Manage Attractions</h2>
        <p className="text-sm text-slate-500">Add, edit, and monitor destinations for users.</p>
      </div>

      {/* Add Attraction Form */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Add New Attraction</h3>

        {message && (
          <div className={`mb-4 p-3 rounded-xl text-xs font-semibold ${
            message.type === "success" ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-rose-50 text-rose-600 border border-rose-200"
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Title</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Sigiriya Rock Fortress"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Location</label>
            <input
              type="text"
              name="location"
              required
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Matale District"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* File Upload Control */}
          <div className="md:col-span-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Upload Attraction Image</label>
            <input
              type="file"
              accept="image/*"
              required
              onChange={handleImageUpload}
              className="w-full px-3 py-2 text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 border border-slate-200 rounded-xl cursor-pointer bg-white"
            />
            
            {formData.image && (
              <div className="mt-3 flex items-center gap-3">
                <img src={formData.image} alt="Preview" className="w-20 h-20 object-cover rounded-xl border border-slate-300 shadow-sm" />
                <span className="text-xs text-emerald-600 font-bold">✅ Image Selected & Ready to Upload!</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Best Time to Visit</label>
            <input
              type="text"
              name="bestTime"
              value={formData.bestTime}
              onChange={handleChange}
              placeholder="e.g. 7:00 AM - 10:00 AM"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Entry Fee</label>
            <input
              type="text"
              name="entryFee"
              value={formData.entryFee}
              onChange={handleChange}
              placeholder="e.g. LKR 120 (Locals) / $35 (Foreigners)"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Short Description</label>
            <input
              type="text"
              name="shortDescription"
              required
              value={formData.shortDescription}
              onChange={handleChange}
              placeholder="Brief summary for card display..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Description</label>
            <textarea
              name="fullDescription"
              required
              rows={3}
              value={formData.fullDescription}
              onChange={handleChange}
              placeholder="Detailed explanation for modal popup..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-md disabled:bg-slate-400 cursor-pointer"
            >
              {submitting ? "Uploading..." : "Add Attraction"}
            </button>
          </div>
        </form>
      </div>

      {/* Attractions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">All Attractions ({attractions.length})</h3>

        {loading ? (
          <p className="text-slate-500 text-sm">Loading destinations...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 text-xs uppercase font-semibold">
                  <th className="pb-3">Image</th>
                  <th className="pb-3">Title</th>
                  <th className="pb-3">Location</th>
                  <th className="pb-3">Entry Fee</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                {attractions.map((place) => (
                  <tr key={place._id}>
                    <td className="py-3">
                      <img src={place.image} alt={place.title} className="w-12 h-12 rounded-xl object-cover" />
                    </td>
                    <td className="py-3 font-bold text-slate-800">{place.title}</td>
                    <td className="py-3">{place.location}</td>
                    <td className="py-3 text-emerald-600 font-bold">{place.entryFee || "Free"}</td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => handleDelete(place._id)}
                        className="bg-rose-50 hover:bg-rose-100 text-rose-600 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}