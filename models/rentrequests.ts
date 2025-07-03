// // models/rentrequests.ts
 import mongoose from 'mongoose';

// const RentRequestsSchema = new mongoose.Schema({
//   carId: String,
//   userId: String,
//   days: Number,
// }, {
//   timestamps: true,
//   collection: 'rent-requests'
// });

// // No trailing space here ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
// export default mongoose.models.RentRequest || mongoose.model('RentRequest', RentRequestsSchema);


const RentRequestsSchema = new mongoose.Schema({
  carId: String,
  userId: String,
  //days: Number,
  pickupDate: Date,
  returnDate: Date,
  pickupLocation: String,
  //star: {      // Add this
  //  type: Number,
  //  enum: [1, 2, 3], // optional enum
  //  default: 1
  //},        // Add this
  reason: {      // Add this
    type: String,
    default: '1'
  },     // Add this
  status: {      // Add this
    type: String,
    enum: ['accept', 'reject', 'pending'], // optional enum
    default: 'pending'
  }
}, {
  timestamps: true,
  collection: 'rent-requests'
});

export default mongoose.models.RentRequest || mongoose.model('RentRequest', RentRequestsSchema);
