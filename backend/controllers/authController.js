const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ==========================================
// 1. AUTHENTICATION (Register & Login)
// ==========================================

// Register User
exports.registerUser = async (req, res) => {
  try {
    console.log('📥 Received Register Request:', req.body);

    const { fullName, name, email, password } = req.body;
    const finalName = fullName || name;

    if (!finalName || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required details!' });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'An account already exists with this email!' });
    }

    // Hash Password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName: finalName,
      email,
      password: hashedPassword, // Save hashed password
      role: 'user',
      status: 'Active',
    });

    await newUser.save();
    console.log('✅ User Saved to MongoDB Successfully!');

    res.status(201).json({ message: 'Registration Successful!' });
  } catch (error) {
    console.error('❌ Register Error:', error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter both email and password!' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials!' });
    }

    // Check if account is blocked by admin
    if (user.status === 'Blocked' || user.status === 'blocked') {
      return res.status(403).json({ message: 'Your account has been blocked by the admin!' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials!' });
    }

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
        status: user.status,
      },
    });
  } catch (error) {
    console.error('❌ Login Error:', error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};


// ==========================================
// 2. ADMIN USER MANAGEMENT (CRUD Operations)
// ==========================================

// Get All Users (For Admin Dashboard Table & Total Count)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Hide passwords for security
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error('❌ Get Users Error:', error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Create User from Admin Dashboard
exports.createUserByAdmin = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields!' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email!' });
    }

    // Hash Password for Admin created users too
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      role: role || 'user',
      status: 'Active',
    });

    await newUser.save();
    
    // Remove password from response data
    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json({ success: true, message: 'User created successfully!', data: userResponse });
  } catch (error) {
    console.error('❌ Admin Create User Error:', error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Update User Details (Edit)
exports.updateUser = async (req, res) => {
  try {
    const { fullName, email, role } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { fullName, email, role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found!' });
    }

    res.status(200).json({ success: true, message: 'User updated successfully!', data: updatedUser });
  } catch (error) {
    console.error('❌ Update User Error:', error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Toggle User Status (Active <-> Blocked)
exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }

    // Toggle status
    user.status = user.status === 'Active' ? 'Blocked' : 'Active';
    await user.save();

    res.status(200).json({ 
      success: true, 
      message: `User status changed to ${user.status}`, 
      data: user 
    });
  } catch (error) {
    console.error('❌ Status Toggle Error:', error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found!' });
    }

    res.status(200).json({ success: true, message: 'User deleted successfully!' });
  } catch (error) {
    console.error('❌ Delete User Error:', error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};