import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './src/routes/authRoutes.js';
import financialHealthRoutes from './src/routes/financialHealthRoutes.js';
import healthAnalysisRoutes from './src/routes/healthAnalysisRoutes.js';
import policyRoutes from './src/routes/policyRoutes.js';
import loanApplicationRoutes from './src/routes/loanApplicationRoutes.js';

dotenv.config();

const app = express();

// ---------- MIDDLEWARE ----------
app.use(express.json());
app.use(cors());

// ---------- ROUTES ----------
app.use('/api/auth', authRoutes);
app.use('/api/financial-health', financialHealthRoutes);
app.use('/api/health-analysis', healthAnalysisRoutes);
app.use('/api/policies', policyRoutes);
app.use('/api/applications', loanApplicationRoutes);

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
