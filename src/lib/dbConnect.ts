import mongoose from 'mongoose';

//const MONGO_URI = process.env.MONGODB_URI!;
const MONGO_URI = 'mongodb+srv://tharusha:C2aKMpePlqU1RTiB@cluster0.dbvyppp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

if (!MONGO_URI) throw new Error('Please add MONGO_URI to .env.local');

let cached = (global as any).mongoose || { conn: null, promise: null };

export async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, {
      bufferCommands: false,
    }).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
