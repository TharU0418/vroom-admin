import mongoose from 'mongoose';

const CarSchema = new mongoose.Schema({
  district: String,
  city: String,
  brand: String,
  type: String,
  year: String,
  transmission: String,
  model: String,
  mileage: Number,
  fueltype: String,
  engine_capacity: Number,
  body_type: String,
  price: Number,
  description: String,
  //mobileNum: String,
  // availability: {      // Add this
  //   type: String,
  //   enum: ['Available', 'Booked', 'Repaire'], // optional enum
  //   default: 'Available'
  // },
  images: [String],
  bookedDates: [{
   startDate: Date,
   endDate: Date
 }],
}, {
  timestamps: true,
  collection: 'rent-cars' 
});

export default mongoose.models.Car || mongoose.model('Car', CarSchema);
