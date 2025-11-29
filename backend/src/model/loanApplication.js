import mongoose from 'mongoose';

const loanApplicationSchema = new mongoose.Schema({
  application_id: {
    type: String,
    unique: true,
    required: true
  },
  msme_id: {
    type: String,
    required: true,
    index: true
  },
  lender_id: {
    type: String,
    required: true,
    index: true
  },
  policy_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Policy',
    required: true
  },
  requested_amount: {
    type: Number,
    required: true,
    min: 0
  },
  msme_credit_score: {
    type: Number,
    default: 0
  },
  msme_financial_health: {
    type: String,
    enum: ['Excellent', 'Good', 'Fair', 'Poor'],
    default: 'Fair'
  },
  policy_fit_score: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  fit_details: {
    credit_score_match: { type: Boolean, default: false },
    financial_health_match: { type: Boolean, default: false },
    vintage_match: { type: Boolean, default: false },
    amount_within_limit: { type: Boolean, default: false }
  },
  status: {
    type: String,
    enum: ['pending', 'reviewing', 'approved', 'rejected'],
    default: 'pending',
    index: true
  },
  lender_notes: {
    type: String,
    default: ''
  },
  approved_amount: {
    type: Number,
    default: 0
  },
  approved_at: {
    type: Date
  },
  rejected_at: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for faster queries
loanApplicationSchema.index({ lender_id: 1, status: 1 });
loanApplicationSchema.index({ msme_id: 1, status: 1 });
loanApplicationSchema.index({ application_id: 1 });

// Pre-save hook to generate application ID
loanApplicationSchema.pre('save', async function() {
  if (!this.application_id) {
    try {
      const LoanApplicationModel = mongoose.model('LoanApplication');
      const count = await LoanApplicationModel.countDocuments();
      this.application_id = `APP${String(count + 1).padStart(6, '0')}`;
    } catch (error) {
      // Fallback: use timestamp-based ID
      console.warn('Error generating application ID, using timestamp fallback:', error);
      this.application_id = `APP${Date.now().toString().slice(-6)}`;
    }
  }
});

const LoanApplication = mongoose.model('LoanApplication', loanApplicationSchema);

export default LoanApplication;

