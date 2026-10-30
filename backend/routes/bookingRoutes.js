const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle'); // 👈 Vehicle model එක ඉംපෝට් කර ඇත

// 1. User sends a Booking Request
router.post('/add', async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    const savedBooking = await newBooking.save();
    res.status(201).json({ message: 'Booking request sent successfully!', booking: savedBooking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Fetch bookings for a specific Owner (Supports Email, Contact, or Vehicle IDs)
router.get('/owner/:identifier', async (req, res) => {
  try {
    const identifier = req.params.identifier.toLowerCase().trim();
    
    // Searching for relevant vehicles using the owner's email or contact information
    const vehicles = await Vehicle.find({
      $or: [
        { ownerEmail: identifier },
        { ownerContact: identifier }
      ]
    });
    const vehicleIds = vehicles.map(v => v._id);

    // Receiving all booking requests that come via email, contact, or vehicle ID.
    const bookings = await Booking.find({
      $or: [
        { ownerEmail: identifier },
        { ownerContact: identifier },
        { vehicleId: { $in: vehicleIds } }
      ]
    }).sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Fetch bookings created by a specific User (Supports Email or Contact)
router.get('/user/:identifier', async (req, res) => {
  try {
    const identifier = req.params.identifier.toLowerCase().trim();
    const bookings = await Booking.find({
      $or: [
        { userEmail: identifier },
        { userContact: identifier }
      ]
    }).sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Update Booking Status (Accepted, Rejected, Completed) & Delete
router.patch('/status/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.status(200).json({ message: `Booking status updated to ${status}`, booking: updatedBooking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Booking
router.delete('/:id', async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Booking deleted successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Send Message / Image in Chat
router.post('/chat/:id', async (req, res) => {
  try {
    const { sender, text, image } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.messages.push({ sender, text, image });
    await booking.save();

    res.status(200).json({ message: 'Message sent!', messages: booking.messages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;