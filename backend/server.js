const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const attractionRoutes = require('./routes/attractionRoutes');

const app = express();

// Middlewares - Base64 Image Uploads සඳහා Payload limit එක 50mb දක්වා වැඩි කර ඇත
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/attractions', attractionRoutes);

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/waymate';

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully!'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));