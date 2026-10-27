const TourPackage = require('../models/TourPackage');
const TourBooking = require('../models/TourBooking');

// 1. Get all Tour Packages
exports.getTours = async (req, res) => {
  try {
    const tours = await TourPackage.find();
    res.status(200).json(tours);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 2. Create a new Tour Package (Admin Side)
exports.createTourPackage = async (req, res) => {
  try {
    const newTour = new TourPackage(req.body);
    await newTour.save();
    res.status(201).json({ message: "Tour Package created successfully!", tour: newTour });
  } catch (error) {
    res.status(400).json({ message: "Failed to create tour package", error: error.message });
  }
};

// 3. Update Tour Package (Admin Side)
exports.updateTourPackage = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTour = await TourPackage.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedTour) {
      return res.status(404).json({ message: "Tour package not found" });
    }
    res.status(200).json({ message: "Tour package updated successfully!", tour: updatedTour });
  } catch (error) {
    res.status(400).json({ message: "Failed to update tour package", error: error.message });
  }
};

// 4. Delete Tour Package (Admin Side)
exports.deleteTourPackage = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTour = await TourPackage.findByIdAndDelete(id);
    if (!deletedTour) {
      return res.status(404).json({ message: "Tour package not found" });
    }
    res.status(200).json({ message: "Tour package deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 5. Save a new Booking Request (User Side)
exports.createBooking = async (req, res) => {
  try {
    const newBooking = new TourBooking(req.body);
    await newBooking.save();
    res.status(201).json({ message: "Tour booking request submitted successfully!", booking: newBooking });
  } catch (error) {
    res.status(400).json({ message: "Failed to create booking", error: error.message });
  }
};

// 6. Get Bookings for a specific User
exports.getUserBookings = async (req, res) => {
  try {
    const { email } = req.params;
    const bookings = await TourBooking.find({ userEmail: email }).sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 7. Update Booking Status by Admin (Accept / Cancel)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'Accepted' or 'Cancelled'
    
    const updatedBooking = await TourBooking.findByIdAndUpdate(
      id, 
      { status }, 
      { new: true }
    );
    
    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    
    res.status(200).json({ message: `Booking status updated to ${status}`, booking: updatedBooking });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 8. Cancel Booking Request (User Side) - 👈 අලුතින් එකතු විය
exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBooking = await TourBooking.findByIdAndUpdate(
      id,
      { status: "Cancelled" },
      { new: true }
    );
    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json({ message: "Booking cancelled successfully!", booking: updatedBooking });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 9. Delete Booking Request (User Side) - 👈 අලුතින් එකතු විය
exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBooking = await TourBooking.findByIdAndDelete(id);
    if (!deletedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json({ message: "Booking deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};