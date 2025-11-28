import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './src/routes/authRoutes.js';

dotenv.config();

const app = express();

// ---------- MIDDLEWARE ----------
app.use(express.json());
app.use(cors());

// ---------- ROUTES ----------
app.use('/api/auth', authRoutes);

// ---------- DATABASE CONNECTION ----------
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ DB connection error:", err.message));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
});

// ---------- GRACEFUL SHUTDOWN ----------
const gracefulShutdown = async () => {
  console.log("🛑 Shutting down gracefully...");
  await mongoose.disconnect();
  process.exit(0);
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
