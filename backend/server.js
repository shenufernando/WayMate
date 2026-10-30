const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import Routes
const authRoutes = require('./routes/authRoutes');
const attractionRoutes = require('./routes/attractionRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const tourRoutes = require('./routes/tourRoutes');
const aiRoutes = require('./routes/aiRoutes'); // Imported AI Trip Planner routes
const adminRoutes = require('./routes/adminRoutes'); // 👈 Imported Admin Dashboard routes

const app = express();

// Middlewares - Increased payload limit to 50mb for Base64 image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/attractions', attractionRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/ai', aiRoutes); // Added AI Trip Planner API route
app.use('/api/admin', adminRoutes); // 👈 Added Admin Dashboard API route

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/waymate';

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully!'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));