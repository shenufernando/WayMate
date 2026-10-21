const express = require('express');
const router = express.Router();
const Attraction = require('../models/Attraction');

// Get all attractions for User and Admin
router.get('/', async (req, res) => {
  try {
    const attractions = await Attraction.find().sort({ createdAt: -1 });
    res.json(attractions);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching attractions' });
  }
});

// Add a new attraction (Admin Feature)
router.post('/', async (req, res) => {
  try {
    const newAttraction = new Attraction(req.body);
    const saved = await newAttraction.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: 'Error adding attraction' });
  }
});

// Update an attraction by ID (Admin Feature - EDIT)
router.put('/:id', async (req, res) => {
  try {
    const updatedAttraction = await Attraction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedAttraction) {
      return res.status(404).json({ message: 'Attraction not found' });
    }

    res.json(updatedAttraction);
  } catch (err) {
    res.status(400).json({ message: 'Error updating attraction' });
  }
});

// Delete an attraction (Admin Feature)
router.delete('/:id', async (req, res) => {
  try {
    await Attraction.findByIdAndDelete(req.params.id);
    res.json({ message: 'Attraction deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting attraction' });
  }
});

module.exports = router;