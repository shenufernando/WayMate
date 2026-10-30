const express = require('express');
const router = express.Router();
const { generateTripPlan } = require('../controllers/aiController');

// Route for generating AI Trip Plan
router.post('/generate-plan', generateTripPlan);

module.exports = router;