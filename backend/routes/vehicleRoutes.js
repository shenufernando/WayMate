const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');

// 1. User posts a vehicle (User Post Vehicle) -> Default: Pending
router.post('/add', async (req, res) => {
  try {
    const newVehicle = new Vehicle(req.body);
    const savedVehicle = await newVehicle.save();
    res.status(201).json({ message: "Vehicle submitted for approval!", vehicle: savedVehicle });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Adding only approved vehicles to the User Dashboard
  try {
    const vehicles = await Vehicle.find({ status: 'Approved' });
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Importing all vehicles into the Admin Dashboard
router.get('/all', async (req, res) => {
  try {
    const vehicles = await Vehicle.find().sort({ createdAt: -1 });
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Admin Approve / Reject the vehicle
router.patch('/status/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.status(200).json({ message: `Vehicle status updated to ${status}`, vehicle: updatedVehicle });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;