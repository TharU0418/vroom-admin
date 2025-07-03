// models/Admin.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface Admin extends Document {
  email: string;
  password: string;
}

const AdminSchema = new Schema<Admin>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Admin || mongoose.model<Admin>('Admin', AdminSchema);
