const express = require('express');
const Ride = require('../models/Ride');

const router = express.Router();

// Get All Rides
router.get('/', async (req, res) => {
  try {
    const rides = await Ride.find();
    res.json(rides);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Post / Create New Ride
router.post('/', async (req, res) => {
  try {
    const newRide = new Ride(req.body);
    const savedRide = await newRide.save();
    res.status(201).json(savedRide);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;