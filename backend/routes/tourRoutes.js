const express = require('express');
const router = express.Router();
const { 
  getTours, 
  createTourPackage, 
  updateTourPackage,    // 👈 Imported Update function
  deleteTourPackage,    // 👈 Imported Delete function
  createBooking, 
  getUserBookings, 
  updateBookingStatus 
} = require('../controllers/tourController');

// Tour Package routes
router.get('/', getTours);
router.post('/', createTourPackage);         // Admin Tour Package Creation Route
router.put('/:id', updateTourPackage);       // 👈 Admin Tour Package Update Route
router.delete('/:id', deleteTourPackage);    // 👈 Admin Tour Package Delete Route

// Booking routes
router.post('/book', createBooking);
router.get('/user/:email', getUserBookings);
router.put('/book/:id/status', updateBookingStatus);

module.exports = router;