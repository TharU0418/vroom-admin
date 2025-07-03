// // models/rentrequests.ts
 import mongoose from 'mongoose';

const HireRequestsSchema = new mongoose.Schema({
  userId: String,
  driverId: {      // Add this
    type: String,
    default: '1'
  },
  pickupDate: String,
  returnDate: String,
  pickupTime: String,
  pickupLocation: String,
  message: String,
  reason: {      // Add this
    type: String,
    default: '1'
  },
  status: {      // Add this
    type: String,
    enum: ['accept', 'reject', 'pending','available'], // optional enum
    default: 'pending'
  },
  type: {      // Add this
    type: String,
    enum: ['full-day', 'one-time', 'drinkdrive', 'long-term'], // optional enum
    default: 'one-time'
  }
}, {
  timestamps: true,
  collection: 'hire-requests'
});

export default mongoose.models.HireRequest || mongoose.model('HireRequest', HireRequestsSchema);
