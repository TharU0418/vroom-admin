
// // models/rentrequests.ts
 import mongoose from 'mongoose';

const ConsultationRequestsSchema = new mongoose.Schema({
  userId: String,
  mobileNum: String,
  message: String,
  type: {      // Add this
    type: String,
    enum: ['Full', 'Insurance', 'Registration ', 'Leasing '], // optional enum
    default: 'Full'
  }
}, {
  timestamps: true,
  collection: 'consultation-requests'
});

export default mongoose.models.ConsultationRequest || mongoose.model('ConsultationRequest', ConsultationRequestsSchema);
