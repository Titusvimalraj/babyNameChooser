// utils/dbConnect.ts
import mongoose from 'mongoose';

const connection: { isConnected?: number } = {};

async function dbConnect() {
  if (connection.isConnected) {
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI!);
    connection.isConnected = db.connections[0].readyState;
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}

async function dbDisconnect() {
  if (connection.isConnected) {
    try {
      await mongoose.disconnect();
      connection.isConnected = undefined;
      console.log('Disconnected from MongoDB');
    } catch (error) {
      console.error('MongoDB disconnection error:', error);
    }
  }
}

export { dbConnect, dbDisconnect };
