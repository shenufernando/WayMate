const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Register User
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ name, email, password: hashedPassword });
    await user.save();

    // Normal User සඳහා token සෑදීම
    const token = jwt.sign(
      { id: user._id, role: 'user' }, 
      process.env.JWT_SECRET || 'secretkey', 
      { expiresIn: '7d' }
    );

    res.status(201).json({ 
      token, 
      role: 'user',
      user: { id: user._id, name: user.name, email: user.email, role: 'user' } 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login User
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Hardcoded Admin Check (Register නොවී කෙලින්ම Login වීමට)
    if (email === "admin@gmail.com" && password === "admin123") {
      const adminToken = jwt.sign(
        { id: 'admin_id', role: 'admin' }, 
        process.env.JWT_SECRET || 'secretkey', 
        { expiresIn: '7d' }
      );

      return res.status(200).json({
        message: "Admin Login Successful!",
        token: adminToken,
        role: "admin",
        user: {
          id: "admin_id",
          name: "System Admin",
          email: "admin@gmail.com",
          role: "admin"
        }
      });
    }

    // 2. Normal User Check (Database එකෙන්)
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid Credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials' });

    const token = jwt.sign(
      { id: user._id, role: 'user' }, 
      process.env.JWT_SECRET || 'secretkey', 
      { expiresIn: '7d' }
    );

    res.status(200).json({ 
      token, 
      role: 'user',
      user: { id: user._id, name: user.name, email: user.email, role: 'user' } 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;