import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI in .env.local');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache;
}

const cached: MongooseCache = global.mongoose ?? { conn: null, promise: null };
global.mongoose = cached;

let dbConnectionFailed = false;

export async function connectDB(): Promise<typeof mongoose> {
  if (dbConnectionFailed) {
    throw new Error('Database is offline (connection previously timed out). Bypassing to enable fast local sandbox simulation.');
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 2000,
      socketTimeoutMS: 45000,
    }).then((m) => {
      console.log('✅ MongoDB connected');
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    dbConnectionFailed = true; // Flag connection as failed to bypass future blocking timeouts
    throw e;
  }

  return cached.conn;
}
