import mongoose from 'mongoose';

const DriverSchema = new mongoose.Schema({
  fullname: String,
  email: String,
  contact: String,
  experience: String,
  star: String,
  description: String,
  images: [String],
  bookedDates: [{
   startDate: Date,
   endDate: Date
 }],
 tour_types: [{
   type: String
 }]
}, {
  timestamps: true,
  collection: 'hire-drivers' 
});

export default mongoose.models.Driver || mongoose.model('Driver', DriverSchema);
