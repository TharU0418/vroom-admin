import mongoose, { Schema } from 'mongoose';

const CarSchema = new Schema({
  district: {type: String, required: true},
  city: {type: String, required: true},
  condition: { type: String, required: true },
  brand: { type: String, required: true },
  year: { type: String, required: true },
  model: { type: String, required: true },
  mileage: { type: String, required: true },
  fueltype: { type: String, required: true },
  engine_capacity: { type: String, required: true },
  transmission: { type: String, required: true },
  body_type: { type: String, required: true },
  price: { type: String, required: true },
  description: { type: String, required: true },
  images: {
    type: [String],
    required: true,
    validate: [arrayLimit, '{PATH} exceeds the limit of 5'],
  },
  user: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  mobileNum: { type: String, required: true },
  negotiable:{      // Add this
    type: Boolean,
    enum: [true, false], // optional enum
    default: false
  },  
  status: {      // Add this
    type: String,
    enum: ['accept', 'reject', 'pending', 'cancel'], // optional enum
    default: 'pending'
  },
  report: { type: String }, // <-- updated
});

function arrayLimit(val: string[]) {
  return val.length <= 5;
}

// ✅ Prevent OverwriteModelError
export default mongoose.models.Sell || mongoose.model('Sell', CarSchema);
