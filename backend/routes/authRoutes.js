const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// Register Route
router.post('/register', registerUser);

// Login Route
router.post('/login', loginUser);

// 🔴 මෙම පේළිය අනිවාර්යයෙන්ම තිබිය යුතුය (මෙහි වැරැද්දක් තිබුණොත් Nodemon App Crash වේ)
module.exports = router;