const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getAllUsers, 
  createUserByAdmin, 
  updateUser, 
  toggleUserStatus, 
  deleteUser 
} = require('../controllers/authController');

// Register Route
router.post('/register', registerUser);

// Login Route
router.post('/login', loginUser);

// Admin User Management Routes (Added for Dashboard)
router.get('/', getAllUsers);                      // Get all users & total count
router.post('/', createUserByAdmin);               // Add user from admin panel
router.put('/:id', updateUser);                    // Edit user details
router.patch('/:id/status', toggleUserStatus);     // Block / Unblock user status toggle
router.delete('/:id', deleteUser);                 // Delete user

// 🔴 This line must be present (if there is an error here, Nodemon will cause the app to crash)
module.exports = router;