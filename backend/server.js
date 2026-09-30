import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Resume from './models/Resume.js'; // Adjust path to your model if needed

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Track connection status
let isConnected = false;

const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      bufferCommands: false, // Stop Mongoose from queueing queries when disconnected
      serverSelectionTimeoutMS: 5000, // Timeout after 5s
    });
    isConnected = db.connections[0].readyState === 1;
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

app.get('/api/resumes', async (req, res) => {
  try {
    await connectDB();
    const resumes = await Resume.find();
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default app;