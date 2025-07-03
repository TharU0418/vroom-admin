import mongoose from 'mongoose';

const AutoPartSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: String,
  category: String,
  rating: String,
  stock: String,
  images: [String],
  bookedDates: [{
   startDate: Date,
   endDate: Date
 }],
}, {
  timestamps: true,
  collection: 'auto-part' 
});

export default mongoose.models.AutoPart || mongoose.model('AutoPart', AutoPartSchema);
