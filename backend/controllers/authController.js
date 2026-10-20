const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. REGISTER USER
exports.registerUser = async (req, res) => {
  try {
    console.log('📥 Received Register Request:', req.body); // Debugging Log

    const { fullName, name, email, password } = req.body;
    const finalName = fullName || name;

    if (!finalName || !email || !password) {
      return res.status(400).json({ message: 'සියලුම විස්තර ඇතුළත් කරන්න!' });
    }

    // Email එක කලින් registered ද බලයි
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'මෙම Email එක මගින් දැනටමත් Account එකක් සාදා ඇත!' });
    }

    // Password එක Encrypt කිරීම
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Database එකේ Save කිරීම
    const newUser = new User({
      fullName: finalName,
      email,
      password: hashedPassword,
      role: 'user',
    });

    await newUser.save();
    console.log('✅ User Saved to MongoDB Successfully!'); // Success Log

    res.status(201).json({ message: 'Registration Successful!' });
  } catch (error) {
    console.error('❌ Register Error:', error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// 2. LOGIN USER
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email සහ Password ඇතුළත් කරන්න!' });
    }

    // Check for user email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials!' });
    }

    // Check password match
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials!' });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'waymate_super_secret_key_12345',
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('❌ Login Error:', error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};