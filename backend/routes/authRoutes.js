const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// Register Route
router.post('/register', registerUser);

// Login Route
router.post('/login', loginUser);

// 🔴 This line must be present (if there is an error here, Nodemon will cause the app to crash)
module.exports = router;