import mongoose from 'mongoose';

const financialHealthSchema = new mongoose.Schema({
  msme_id: {
    type: String,
    required: true,
    index: true
  },
  report_id: {
    type: String,
    required: true,
    unique: true
  },
  financial_health: {
    total_inflow: {
      type: Number,
      default: 0
    },
    total_outflow: {
      type: Number,
      default: 0
    },
    net_cashflow: {
      type: Number,
      default: 0
    },
    average_balance: {
      type: Number,
      default: 0
    },
    min_balance: {
      type: Number,
      default: 0
    },
    max_balance: {
      type: Number,
      default: 0
    },
    volatility_score: {
      type: Number,
      default: 0
    },
    seasonality_detected: {
      type: Boolean,
      default: false
    },
    stress_indicators: [{
      type: String
    }],
    cashflow_stability_score: {
      type: Number,
      default: 0
    },
    transaction_count: {
      type: Number,
      default: 0
    },
    period_start: {
      type: Date,
      default: Date.now
    },
    period_end: {
      type: Date,
      default: Date.now
    },
    categorized_transactions: {
      operational: { type: Number, default: 0 },
      tax: { type: Number, default: 0 },
      financing: { type: Number, default: 0 }
    },
    metadata: {
      pattern_analysis: {
        has_seasonality: Boolean,
        volatility: Number,
        regular_credits: Boolean,
        regular_debits: Boolean,
        monthly_breakdown: mongoose.Schema.Types.Mixed
      },
      balance_volatility: Number,
      inflow_count: Number,
      outflow_count: Number
    }
  },
  generated_at: {
    type: Date,
    default: Date.now
  },
  overall_creditworthiness: Number,
  risk_level: String,
  behavioral_score: Number,
  explainability: {
    key_insights: [String],
    strengths: [String],
    weaknesses: [String],
    product_eligibility: [{
      product_id: String,
      product_name: String,
      lender_id: String,
      lender_name: String,
      eligible: Boolean,
      eligibility_score: Number,
      max_amount: Number,
      interest_rate_range: { min: Number, max: Number },
      reasons: [String],
      recommended_amount: Number
    }]
  }
}, {
  timestamps: true,
  collection: 'credit_reports'
});

// Create index for faster queries
financialHealthSchema.index({ msme_id: 1, generated_at: -1 });

const FinancialHealth = mongoose.model('FinancialHealth', financialHealthSchema);

export default FinancialHealth;

