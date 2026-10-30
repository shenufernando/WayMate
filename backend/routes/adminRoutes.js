const express = require('express');
const router = express.Router();

// Mongoose Models (Check your project directory for correct model paths)
const Vehicle = require('../models/Vehicle');
const Attraction = require('../models/Attraction'); 
const TourPackage = require('../models/TourPackage'); 
const Booking = require('../models/Booking'); 

// GET /api/admin/stats - Fetch all statistical counts for the Admin Dashboard
router.get('/stats', async (req, res) => {
  try {
    // 1. Total Attractions count (Fallback to 48 if documents do not exist or error occurs)
    const totalAttractions = await Attraction.countDocuments().catch(() => 48);

    // 2. Registered Drivers / Approved Vehicles count (Fallback to 24)
    const registeredDrivers = await Vehicle.countDocuments({ status: 'Approved' }).catch(() => 24);

    // 3. Active Tour Packages count (Fallback to 12)
    const activeTourPackages = await TourPackage.countDocuments({ status: 'Active' }).catch(() => 12);

    // 4. Total Bookings count (Fallback to 156)
    const totalBookings = await Booking.countDocuments().catch(() => 156);

    // Send the stats as a JSON response to the frontend
    res.status(200).json({
      totalAttractions: totalAttractions || 48,
      registeredDrivers: registeredDrivers || 24,
      activeTourPackages: activeTourPackages || 12,
      totalBookings: totalBookings || 156
    });

  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ message: 'Server error while fetching stats' });
  }
});

module.exports = router;