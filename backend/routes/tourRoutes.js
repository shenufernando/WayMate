const express = require('express');
const router = express.Router();

const { 
  getTours, 
  createTourPackage, 
  updateTourPackage,    
  deleteTourPackage,    
  createBooking, 
  getUserBookings, 
  getAllBookings,       
  updateBookingStatus,
  cancelBooking,  
  deleteBooking   
} = require('../controllers/tourController');

// ==========================
// Tour Package Routes
// ==========================

// Get all available tour packages
router.get('/', getTours);

// Create a new tour package (Admin)
router.post('/', createTourPackage);         

// Update an existing tour package (Admin)
router.put('/:id', updateTourPackage);       

// Delete a tour package (Admin)
router.delete('/:id', deleteTourPackage);    

// ==========================
// Booking Routes
// ==========================

// Get all tour bookings for admin dashboard management
router.get('/admin/bookings', getAllBookings); 

// Submit a new booking request (User)
router.post('/book', createBooking);

// Get all bookings for a specific user by email
router.get('/user/:email', getUserBookings);

// Update booking status - Accept/Reject (Admin)
router.put('/book/:id/status', updateBookingStatus);

// Cancel a specific booking (User)
router.put('/book/:id/cancel', cancelBooking); 

// Permanently delete a specific booking record (User/Admin)
router.delete('/book/:id', deleteBooking);      

module.exports = router;