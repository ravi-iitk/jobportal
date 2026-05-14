import dns from 'dns';
import mongoose from 'mongoose';

// Force Node.js to use Google DNS instead of your campus DNS
dns.setServers(['8.8.8.8', '8.8.4.4']);

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    throw error;
  }
};

export default connectDB;