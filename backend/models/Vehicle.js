const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  // Owner's full name
  ownerName: { type: String, required: true },
  
  // Owner's email address (stored in lowercase and trimmed)
  ownerEmail: { type: String, required: true, lowercase: true, trim: true },
  
  // Owner's phone number or WhatsApp contact
  ownerContact: { type: String, required: true }, // 👈 Added ownerContact field for phone number
  
  // Vehicle type (e.g. Car, Van, SUV)
  vehicleType: { type: String, required: true },
  
  // Vehicle model name (e.g. Toyota Aqua Hybrid)
  vehicleModel: { type: String, required: true },
  
  // Passenger seating capacity
  capacity: { type: Number, required: true },
  
  // Type of service offered
  serviceType: { type: String, enum: ['Self-drive', 'With driver'], required: true },
  
  // Rental rates
  pricePerDay: { type: Number, required: true },
  pricePerKm: { type: Number },
  
  // Vehicle image (Base64 or URL)
  image: { type: String, required: true },
  
  // Location/City
  location: { type: String, required: true },
  
  // Approval status managed by Admin
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected'], 
    default: 'Pending' 
  },
  
  // Submission timestamp
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Vehicle', vehicleSchema);