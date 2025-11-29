import mongoose from 'mongoose';

const policySchema = new mongoose.Schema({
  lender_id: {
    type: String,
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  interestRate: {
    type: Number,
    required: true,
    min: 0
  },
  maxAmount: {
    type: Number,
    required: true,
    min: 0
  },
  minCreditScore: {
    type: Number,
    required: true,
    min: 300,
    max: 900
  },
  minFinancialHealth: {
    type: String,
    enum: ['Excellent', 'Good', 'Fair', 'Poor'],
    required: true
  },
  minVintageMonths: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for faster queries
policySchema.index({ lender_id: 1, isActive: 1 });

const Policy = mongoose.model('Policy', policySchema);

export default Policy;

