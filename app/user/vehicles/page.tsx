'use client';

import React, { useState, useEffect } from 'react';

// Vehicle interface definition
interface Vehicle {
  _id: string;
  ownerName: string;
  ownerEmail: string;
  ownerContact?: string;
  vehicleType: string;
  vehicleModel: string;
  capacity: number;
  serviceType: 'Self-drive' | 'With driver';
  pricePerDay: number;
  pricePerKm?: number;
  image: string;
  location: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

// Message interface supporting text, image, and audio (voice note)
interface Message {
  _id?: string;
  sender: 'owner' | 'user';
  text?: string;
  image?: string;
  audio?: string;
  timestamp: string;
}

// Booking interface definition
interface Booking {
  _id: string;
  vehicleId: string;
  vehicleModel: string;
  ownerEmail: string;
  ownerContact?: string;
  userName: string;
  userEmail: string;
  userContact?: string;
  pickupDate: string;
  returnDate: string;
  destination: string;
  notes?: string;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Cancelled' | 'Completed';
  messages: Message[];
}

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [myListings, setMyListings] = useState<Vehicle[]>([]);
  const [incomingBookings, setIncomingBookings] = useState<Booking[]>([]);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  
  const [activeTab, setActiveTab] = useState<'browse' | 'myListings' | 'incomingBookings' | 'myBookings'>('browse');
  const [loading, setLoading] = useState<boolean>(true);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [activeChatBooking, setActiveChatBooking] = useState<Booking | null>(null);

  const [currentUserEmail, setCurrentUserEmail] = useState<string>('');
  const [currentUserName, setCurrentUserName] = useState<string>('');

  // Post form state with ownerContact and auto vehicleType detection
  const [postForm, setPostForm] = useState({
    vehicleModel: '',
    vehicleType: 'Car',
    serviceType: 'With driver',
    capacity: 4,
    ownerName: '',
    ownerEmail: '',
    ownerContact: '',
    pricePerDay: '',
    pricePerKm: '',
    location: '',
    image: ''
  });

  // Advanced Booking Form State
  const [bookingForm, setBookingForm] = useState({
    userName: '',
    userEmail: '',
    userContact: '',
    pickupDate: '',
    returnDate: '',
    destination: '',
    notes: ''
  });

  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);

  // Chat states for text, image preview, and voice recording
  const [chatText, setChatText] = useState('');
  const [chatImage, setChatImage] = useState('');
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  // Load user session and data on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user') || localStorage.getItem('waymate_user');
    const storedEmail = localStorage.getItem('userEmail') || localStorage.getItem('waymate_user_email');
    const storedName = localStorage.getItem('userName') || localStorage.getItem('userFullName') || 'User';

    let email = '';
    let name = storedName;

    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        email = parsed.email || parsed.userEmail || '';
        name = parsed.fullName || parsed.name || storedName;
      } catch (e) {
        console.error('Error parsing user session from localStorage', e);
      }
    }

    if (!email && storedEmail) {
      email = storedEmail;
    }

    if (email) {
      const cleanEmail = email.toLowerCase().trim();
      const cleanName = name && name !== 'User' ? name : storedName;

      setCurrentUserEmail(cleanEmail);
      setCurrentUserName(cleanName);
      
      setPostForm((prev) => ({ ...prev, ownerEmail: cleanEmail, ownerName: cleanName }));
      setBookingForm((prev) => ({ ...prev, userEmail: cleanEmail, userName: cleanName }));
      
      refreshUserData(cleanEmail);
    }

    fetchApprovedVehicles();
  }, []);

  // Refresh user-specific data lists
  const refreshUserData = (email: string) => {
    if (!email) return;
    fetchMyListings(email);
    loadIncomingRequests(email);
    loadUserBookings(email);
  };

  // Fetch all approved vehicles
  const fetchApprovedVehicles = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/vehicles/approved');
      const data = await res.json();
      if (Array.isArray(data)) setVehicles(data);
    } catch (err) {
      console.error('Error fetching approved vehicles:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch listings posted by the owner
  const fetchMyListings = async (email: string) => {
    try {
      const cleanEmail = email.toLowerCase().trim();
      const res = await fetch(`http://localhost:5000/api/vehicles/owner/${encodeURIComponent(cleanEmail)}`);
      const data: Vehicle[] = await res.json();
      if (Array.isArray(data)) {
        setMyListings(data);
      } else {
        setMyListings([]);
      }
    } catch (err) {
      console.error('Error fetching my listings:', err);
      setMyListings([]);
    }
  };

  // Fetch incoming booking requests for the owner
  const loadIncomingRequests = async (email: string) => {
    try {
      const cleanEmail = email.toLowerCase().trim();
      const res = await fetch(`http://localhost:5000/api/bookings/owner/${encodeURIComponent(cleanEmail)}`);
      const data = await res.json();
      if (Array.isArray(data)) setIncomingBookings(data);
    } catch (err) {
      console.error('Error fetching incoming requests:', err);
    }
  };

  // Fetch bookings created by the user
  const loadUserBookings = async (email: string) => {
    try {
      const cleanEmail = email.toLowerCase().trim();
      const res = await fetch(`http://localhost:5000/api/bookings/user/${encodeURIComponent(cleanEmail)}`);
      const data = await res.json();
      if (Array.isArray(data)) setUserBookings(data);
    } catch (err) {
      console.error('Error fetching user bookings:', err);
    }
  };

  // Handle image conversion to Base64 (for vehicle listing or chat)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isChat = false) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isChat) {
          setChatImage(reader.result as string);
        } else {
          setPostForm((prev) => ({ ...prev, image: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Start voice recording for chat
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          sendChatMessage('', '', reader.result as string);
        };
        reader.readAsDataURL(blob);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
    } catch (err) {
      alert('Microphone access is required to record voice notes!');
    }
  };

  // Stop voice recording
  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  // Submit new vehicle post
  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUserEmail) {
      alert('Please login first to post a vehicle!');
      return;
    }
    if (!postForm.image) {
      alert('Please upload an image!');
      return;
    }

    try {
      const payload = {
        ...postForm,
        ownerEmail: currentUserEmail.toLowerCase().trim(),
        ownerName: postForm.ownerName || currentUserName,
        ownerContact: postForm.ownerContact,
        vehicleType: postForm.vehicleType,
        capacity: Number(postForm.capacity),
        pricePerDay: Number(postForm.pricePerDay),
        pricePerKm: postForm.pricePerKm ? Number(postForm.pricePerKm) : 0
      };

      const res = await fetch('http://localhost:5000/api/vehicles/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        alert('Vehicle posted successfully! Pending Admin approval.');
        setIsPostModalOpen(false);
        refreshUserData(currentUserEmail);
        setActiveTab('myListings');
      } else {
        alert('Failed to post vehicle: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error adding vehicle:', err);
      alert('Network or server error occurred!');
    }
  };

  // Delete vehicle listing
  const handleDeleteListing = async (vehicleId: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/vehicles/${vehicleId}`, { method: 'DELETE' });
      if (res.ok) {
        alert('Listing deleted successfully!');
        refreshUserData(currentUserEmail);
        fetchApprovedVehicles();
      }
    } catch (err) {
      console.error('Error deleting listing:', err);
    }
  };

  // Fixed and Improved Booking Submit Handler with ownerContact included
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUserEmail) {
      alert('Please login first to book a vehicle!');
      return;
    }
    if (!selectedVehicle) return;

    setIsSubmittingBooking(true);

    const payload = {
      vehicleId: selectedVehicle._id,
      vehicleModel: selectedVehicle.vehicleModel,
      ownerEmail: selectedVehicle.ownerEmail.toLowerCase().trim(),
      ownerContact: selectedVehicle.ownerContact || 'N/A',
      userName: bookingForm.userName || currentUserName,
      userEmail: currentUserEmail.toLowerCase().trim(),
      userContact: bookingForm.userContact,
      pickupDate: bookingForm.pickupDate,
      returnDate: bookingForm.returnDate,
      destination: bookingForm.destination,
      notes: bookingForm.notes
    };

    try {
      const res = await fetch('http://localhost:5000/api/bookings/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert('Booking Request sent to Owner successfully!');
        setSelectedVehicle(null);
        setBookingForm((prev) => ({
          ...prev,
          userContact: '',
          pickupDate: '',
          returnDate: '',
          destination: '',
          notes: ''
        }));
        refreshUserData(currentUserEmail);
        setActiveTab('myBookings');
      } else {
        const errData = await res.json();
        alert('Failed to send booking: ' + (errData.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error sending booking:', err);
      alert('Network or server error occurred while sending booking request!');
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  const handleUpdateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/status/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (res.ok) {
        alert(`Booking status changed to: ${status}`);
        if (activeChatBooking && (status === 'Completed' || status === 'Cancelled')) {
          setActiveChatBooking(null);
        }
        refreshUserData(currentUserEmail);
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  // Permanently delete booking from database
  const handleDeleteBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to permanently delete this booking?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, { method: 'DELETE' });
      if (res.ok) {
        alert('Booking deleted from database successfully!');
        if (activeChatBooking && activeChatBooking._id === bookingId) {
          setActiveChatBooking(null);
        }
        refreshUserData(currentUserEmail);
      }
    } catch (err) {
      console.error('Error deleting booking:', err);
    }
  };

  // Send message, image, or voice note in chat
  const sendChatMessage = async (text?: string, image?: string, audio?: string) => {
    if (!activeChatBooking) return;
    const isOwner = currentUserEmail === activeChatBooking.ownerEmail.toLowerCase().trim();
    const role = isOwner ? 'owner' : 'user';

    const msgText = text !== undefined ? text : chatText;
    const msgImg = image !== undefined ? image : chatImage;

    if (!msgText && !msgImg && !audio) return;

    try {
      const res = await fetch(`http://localhost:5000/api/bookings/chat/${activeChatBooking._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: role,
          text: msgText,
          image: msgImg,
          audio: audio || ''
        })
      });

      if (res.ok) {
        const data = await res.json();
        setActiveChatBooking((prev) => prev ? { ...prev, messages: data.messages } : null);
        setChatText('');
        setChatImage('');
      }
    } catch (err) {
      console.error('Error sending chat:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pb-16">
      <div className="bg-[#0b1329] text-white py-10 px-4 text-center shadow-md">
        <h1 className="text-3xl font-black">Private Vehicles & Drivers</h1>
        <p className="text-slate-300 text-xs mt-1">Book vehicles or list your own vehicle.</p>

        <div className="mt-4 max-w-md mx-auto bg-white/10 backdrop-blur-md p-2.5 rounded-2xl flex items-center justify-center text-xs shadow-inner">
          {currentUserEmail ? (
            <span>Logged in as: <b className="text-emerald-400">{currentUserName} ({currentUserEmail})</b></span>
          ) : (
            <span className="text-amber-300">⚠️ Please login from your account to post or book vehicles.</span>
          )}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveTab('browse')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'browse' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              🚗 Browse Approved Vehicles
            </button>

            {currentUserEmail && (
              <button
                onClick={() => setActiveTab('myListings')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'myListings' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                📋 Track My Submissions ({myListings.length})
              </button>
            )}

            {currentUserEmail && userBookings.length > 0 && (
              <button
                onClick={() => setActiveTab('myBookings')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'myBookings' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                📖 My Bookings & Status ({userBookings.length})
              </button>
            )}

            {/* Incoming Requests Tab - Automatically hides if no requests exist */}
            {currentUserEmail && incomingBookings.length > 0 && (
              <button
                onClick={() => setActiveTab('incomingBookings')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'incomingBookings' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                📥 Incoming Requests ({incomingBookings.length})
              </button>
            )}
          </div>

          <button
            onClick={() => {
              if (!currentUserEmail) {
                alert('Please login first!');
                return;
              }
              setIsPostModalOpen(true);
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-5 py-2.5 rounded-xl font-bold shadow-md transition-all active:scale-95"
          >
            ➕ Post Your Vehicle
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div></div>
        ) : (
          <div>
            {activeTab === 'browse' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehicles.map((v) => (
                  <div key={v._id} className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-all">
                    <div>
                      <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-slate-100">
                        <img src={v.image} alt={v.vehicleModel} className="h-full w-full object-cover" />
                        <span className="absolute top-3 left-3 bg-[#1e293b]/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
                          {v.serviceType}
                        </span>
                      </div>
                      <div className="mt-4">
                        <span className="text-[11px] font-black text-emerald-600 uppercase tracking-wider">{v.vehicleType}</span>
                        <h3 className="text-lg font-black text-slate-900 mt-0.5">{v.vehicleModel}</h3>
                        <p className="text-xs text-slate-500 mt-1">Owner: <span className="font-bold text-slate-700">{v.ownerName}</span></p>
                        {v.ownerContact && <p className="text-xs text-slate-400 mt-0.5">📞 {v.ownerContact}</p>}
                        <p className="text-xs text-slate-400 mt-0.5">📍 {v.location}</p>
                      </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
                      <div>
                        <span className="text-emerald-600 font-black text-lg">LKR {v.pricePerDay?.toLocaleString()}</span>
                        <span className="text-[10px] text-slate-400 font-normal ml-1">/ day</span>
                        {v.pricePerKm ? (
                          <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
                            + LKR {v.pricePerKm.toLocaleString()} / km
                          </p>
                        ) : null}
                      </div>
                      <button 
                        onClick={() => {
                          setSelectedVehicle(v);
                          setBookingForm((prev) => ({
                            ...prev,
                            userName: currentUserName,
                            userEmail: currentUserEmail
                          }));
                        }} 
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-5 py-2.5 rounded-xl font-bold shadow-sm transition-all active:scale-95"
                      >
                        Book Request
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'myListings' && currentUserEmail && (
              <div>
                {myListings.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 text-slate-400 text-xs">
                    You haven't posted any vehicles yet. Click "Post Your Vehicle" to add one!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myListings.map((v) => (
                      <div key={v._id} className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between">
                        <div>
                          <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-slate-100">
                            <img src={v.image} alt={v.vehicleModel} className="h-full w-full object-cover" />
                            <span className="absolute top-3 left-3 bg-[#1e293b]/90 text-white text-[10px] font-bold px-3 py-1 rounded-full">
                              {v.serviceType}
                            </span>
                            <span className={`absolute top-3 right-3 text-[10px] font-bold px-3 py-1 rounded-full text-white ${
                              v.status === 'Approved' ? 'bg-emerald-600' : v.status === 'Pending' ? 'bg-amber-500' : 'bg-rose-500'
                            }`}>
                              {v.status}
                            </span>
                          </div>
                          <span className="inline-block mt-3 text-[10px] font-black text-emerald-600 uppercase">{v.vehicleType}</span>
                          <h3 className="text-lg font-black text-slate-900 mt-0.5">{v.vehicleModel}</h3>
                          <p className="text-xs text-slate-500 mt-1">Location: {v.location}</p>
                          <p className="text-xs text-slate-500 mt-0.5">Rate: LKR {v.pricePerDay} / day</p>
                          {v.pricePerKm ? (
                            <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
                              + LKR {v.pricePerKm.toLocaleString()} / km
                            </p>
                          ) : null}
                          {v.ownerContact && <p className="text-xs text-slate-500 mt-0.5">Contact: {v.ownerContact}</p>}
                        </div>
                        <button onClick={() => handleDeleteListing(v._id)} className="w-full mt-5 bg-rose-600 hover:bg-rose-700 text-white text-xs py-2.5 rounded-xl font-bold transition-all">🗑️ Delete Post</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'myBookings' && currentUserEmail && userBookings.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-black text-slate-800 mb-4">My Booking Requests & Status</h2>
                {userBookings.map((b) => (
                  <div key={b._id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <span className="text-xs font-bold text-emerald-600 uppercase">{b.vehicleModel}</span>
                      <h4 className="text-base font-black text-slate-900 mt-1">Owner Email: {b.ownerEmail}</h4>
                      <p className="text-xs text-slate-500 mt-1">📅 Pickup: <b>{b.pickupDate}</b> | Return: <b>{b.returnDate}</b> | Destination: <b>{b.destination}</b></p>
                      {b.userContact && <p className="text-xs text-slate-500 mt-0.5">📞 Your Contact: <b>{b.userContact}</b></p>}
                      <span className={`inline-block mt-3 text-[11px] font-bold px-3 py-1 rounded-full ${
                        b.status === 'Accepted' ? 'bg-emerald-100 text-emerald-700' : b.status === 'Rejected' ? 'bg-rose-100 text-rose-700' : b.status === 'Cancelled' ? 'bg-slate-200 text-slate-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        Status: {b.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {b.status === 'Accepted' && (
                        <>
                          <button onClick={() => setActiveChatBooking(b)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm">💬 Open Live Chat</button>
                          <button onClick={() => handleUpdateBookingStatus(b._id, 'Completed')} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold">🏁 Mark Done</button>
                          <button onClick={() => handleUpdateBookingStatus(b._id, 'Cancelled')} className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold">❌ Cancel</button>
                        </>
                      )}
                      {/* Permanent Delete Booking Button */}
                      <button onClick={() => handleDeleteBooking(b._id)} className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold">🗑️ Delete Booking</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'incomingBookings' && currentUserEmail && incomingBookings.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-black text-slate-800 mb-4">Incoming Requests for Your Vehicles</h2>
                {incomingBookings.map((b) => (
                  <div key={b._id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-emerald-600 uppercase bg-emerald-50 px-2.5 py-0.5 rounded-lg">{b.vehicleModel}</span>
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                          b.status === 'Accepted' ? 'bg-emerald-100 text-emerald-700' : b.status === 'Rejected' ? 'bg-rose-100 text-rose-700' : b.status === 'Cancelled' ? 'bg-slate-200 text-slate-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {b.status}
                        </span>
                      </div>
                      <h4 className="text-base font-black text-slate-900 mt-2">Booked by: {b.userName} <span className="text-xs font-normal text-slate-500">({b.userEmail})</span></h4>
                      {b.userContact && <p className="text-xs text-slate-600 font-bold mt-1">📞 Phone / WhatsApp: {b.userContact}</p>}
                      <p className="text-xs text-slate-500 mt-1">📅 Pickup: <b>{b.pickupDate}</b> | Return: <b>{b.returnDate}</b> | Destination: <b>{b.destination}</b></p>
                      {b.notes && <p className="text-xs text-slate-500 mt-1 bg-slate-50 p-2 rounded-xl">📝 Notes: {b.notes}</p>}
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {b.status === 'Pending' && (
                        <>
                          <button onClick={() => handleUpdateBookingStatus(b._id, 'Accepted')} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold">✅ Accept</button>
                          <button onClick={() => handleUpdateBookingStatus(b._id, 'Rejected')} className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold">🚫 Reject</button>
                        </>
                      )}

                      {b.status === 'Accepted' && (
                        <>
                          <button onClick={() => setActiveChatBooking(b)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold">💬 Live Chat</button>
                          <button onClick={() => handleUpdateBookingStatus(b._id, 'Completed')} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold">🏁 Mark Done</button>
                          <button onClick={() => handleUpdateBookingStatus(b._id, 'Cancelled')} className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold">❌ Cancel</button>
                        </>
                      )}
                      
                      {/* Permanent Delete Booking Button */}
                      <button onClick={() => handleDeleteBooking(b._id)} className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold">🗑️ Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* BOOKING MODAL WITH USER CONTACT AND DETAILS */}
      {selectedVehicle && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setSelectedVehicle(null)} className="absolute top-4 right-4 text-slate-400 font-bold">✕</button>
            <h3 className="text-xl font-black text-slate-800 mb-1">Book Vehicle: {selectedVehicle.vehicleModel}</h3>
            <p className="text-xs text-slate-500 mb-4">Provide your contact and trip details for the owner.</p>

            <form onSubmit={handleBookingSubmit} className="space-y-3 text-xs font-semibold">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Your Name</label>
                <input 
                  type="text" 
                  required 
                  value={bookingForm.userName} 
                  onChange={(e) => setBookingForm({ ...bookingForm, userName: e.target.value })} 
                  className="w-full px-3.5 py-2.5 border rounded-xl outline-none" 
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Your Email</label>
                <input 
                  type="email" 
                  disabled 
                  value={bookingForm.userEmail} 
                  className="w-full px-3.5 py-2.5 border rounded-xl bg-slate-100 text-slate-500 cursor-not-allowed" 
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Phone Number / WhatsApp</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. 0771234567" 
                  value={bookingForm.userContact} 
                  onChange={(e) => setBookingForm({ ...bookingForm, userContact: e.target.value })} 
                  className="w-full px-3.5 py-2.5 border rounded-xl outline-none" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Pickup Date</label>
                  <input 
                    type="date" 
                    required 
                    value={bookingForm.pickupDate} 
                    onChange={(e) => setBookingForm({ ...bookingForm, pickupDate: e.target.value })} 
                    className="w-full px-3.5 py-2.5 border rounded-xl outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Return Date</label>
                  <input 
                    type="date" 
                    required 
                    value={bookingForm.returnDate} 
                    onChange={(e) => setBookingForm({ ...bookingForm, returnDate: e.target.value })} 
                    className="w-full px-3.5 py-2.5 border rounded-xl outline-none" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Destination</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Kandy / Ella" 
                  value={bookingForm.destination} 
                  onChange={(e) => setBookingForm({ ...bookingForm, destination: e.target.value })} 
                  className="w-full px-3.5 py-2.5 border rounded-xl outline-none" 
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Additional Notes</label>
                <textarea 
                  rows={2}
                  placeholder="Any special requirements..." 
                  value={bookingForm.notes} 
                  onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })} 
                  className="w-full px-3.5 py-2.5 border rounded-xl outline-none" 
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmittingBooking}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold transition-all shadow-md mt-2"
              >
                {isSubmittingBooking ? 'Sending Request...' : 'Confirm Booking Request'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* LIVE CHAT MODAL WITH IMAGE & VOICE NOTE SUPPORT */}
      {activeChatBooking && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative flex flex-col h-[85vh]">
            <div className="flex justify-between items-center pb-3 border-b">
              <div>
                <h3 className="text-base font-black text-slate-800">Live Chat: {activeChatBooking.vehicleModel}</h3>
                <p className="text-[11px] text-slate-500">Status: {activeChatBooking.status}</p>
              </div>
              <button onClick={() => setActiveChatBooking(null)} className="text-slate-400 font-bold">✕</button>
            </div>

            {/* Messages Display Area */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {activeChatBooking.messages?.map((msg, index) => {
                const isOwner = currentUserEmail === activeChatBooking.ownerEmail.toLowerCase().trim();
                const isMe = (msg.sender === 'owner' && isOwner) || (msg.sender === 'user' && !isOwner);

                return (
                  <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] p-3 rounded-2xl text-xs ${isMe ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-800'}`}>
                      {msg.text && <p className="leading-relaxed">{msg.text}</p>}
                      {msg.image && <img src={msg.image} alt="uploaded attachment" className="mt-2 rounded-xl max-h-48 object-cover w-full" />}
                      {msg.audio && <audio controls src={msg.audio} className="mt-2 max-w-full h-9" />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Chat Image Preview if selected */}
            {chatImage && (
              <div className="p-2.5 bg-slate-100 rounded-xl mb-2 flex items-center justify-between">
                <span className="text-[11px] text-slate-600 truncate">📷 Image attached and ready to send</span>
                <button onClick={() => setChatImage('')} className="text-rose-600 font-bold text-xs hover:underline">Remove</button>
              </div>
            )}

            {/* Chat Input Controls (Text, Image Upload, Voice Recorder) */}
            <div className="pt-3 border-t flex items-center gap-2">
              {/* Image Upload Button */}
              <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 p-2.5 rounded-xl text-xs transition-colors flex items-center justify-center" title="Attach Image">
                📷
                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, true)} className="hidden" />
              </label>

              {/* Voice Record Button */}
              <button 
                onClick={recording ? stopRecording : startRecording}
                className={`p-2.5 rounded-xl text-xs font-bold transition-colors ${recording ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
                title={recording ? 'Stop Recording' : 'Record Voice Note'}
              >
                🎙️ {recording ? 'Stop' : ''}
              </button>

              <input 
                type="text" 
                placeholder="Type a message..." 
                value={chatText} 
                onChange={(e) => setChatText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') sendChatMessage(); }}
                className="flex-1 px-3.5 py-2.5 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500"
              />
              
              <button 
                onClick={() => sendChatMessage()} 
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POST VEHICLE MODAL */}
      {isPostModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsPostModalOpen(false)} className="absolute top-4 right-4 text-slate-400 font-bold">✕</button>
            <h3 className="text-xl font-black text-slate-800 mb-1">Post Your Vehicle</h3>
            <p className="text-xs text-slate-500 mb-4">Fill in your vehicle details to list it on WayMate.</p>

            <form onSubmit={handlePostSubmit} className="space-y-3 text-xs font-semibold">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Vehicle Model / Name</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Toyota KDH / Prius" 
                  value={postForm.vehicleModel} 
                  onChange={(e) => setPostForm({ ...postForm, vehicleModel: e.target.value })} 
                  className="w-full px-3.5 py-2.5 border rounded-xl outline-none" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Vehicle Type</label>
                  <select 
                    value={postForm.vehicleType} 
                    onChange={(e) => setPostForm({ ...postForm, vehicleType: e.target.value })} 
                    className="w-full px-3.5 py-2.5 border rounded-xl outline-none bg-white"
                  >
                    <option value="Car">Car</option>
                    <option value="Van">Van</option>
                    <option value="SUV">SUV</option>
                    <option value="Bus">Bus</option>
                    <option value="Three Wheeler">Three Wheeler</option>
                    <option value="Bike">Bike</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Service Type</label>
                  <select 
                    value={postForm.serviceType} 
                    onChange={(e) => setPostForm({ ...postForm, serviceType: e.target.value as any })} 
                    className="w-full px-3.5 py-2.5 border rounded-xl outline-none bg-white"
                  >
                    <option value="With driver">With Driver</option>
                    <option value="Self-drive">Self-drive</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Capacity (Seats)</label>
                  <input 
                    type="number" 
                    min="1" 
                    required 
                    value={postForm.capacity} 
                    onChange={(e) => setPostForm({ ...postForm, capacity: Number(e.target.value) })} 
                    className="w-full px-3.5 py-2.5 border rounded-xl outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Location</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Colombo" 
                    value={postForm.location} 
                    onChange={(e) => setPostForm({ ...postForm, location: e.target.value })} 
                    className="w-full px-3.5 py-2.5 border rounded-xl outline-none" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Price Per Day (LKR)</label>
                  <input 
                    type="number" 
                    required 
                    placeholder="e.g. 8000" 
                    value={postForm.pricePerDay} 
                    onChange={(e) => setPostForm({ ...postForm, pricePerDay: e.target.value })} 
                    className="w-full px-3.5 py-2.5 border rounded-xl outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Price Per Km (Optional)</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 100" 
                    value={postForm.pricePerKm} 
                    onChange={(e) => setPostForm({ ...postForm, pricePerKm: e.target.value })} 
                    className="w-full px-3.5 py-2.5 border rounded-xl outline-none" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Owner Contact Number</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. 0771234567" 
                  value={postForm.ownerContact} 
                  onChange={(e) => setPostForm({ ...postForm, ownerContact: e.target.value })} 
                  className="w-full px-3.5 py-2.5 border rounded-xl outline-none" 
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Vehicle Image</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  required 
                  onChange={(e) => handleImageUpload(e, false)} 
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" 
                />
              </div>

              {postForm.image && (
                <div className="relative h-32 w-full rounded-xl overflow-hidden bg-slate-100 mt-2">
                  <img src={postForm.image} alt="Preview" className="h-full w-full object-cover" />
                </div>
              )}

              <button 
                type="submit" 
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold transition-all shadow-md mt-2"
              >
                Submit Vehicle Listing
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}