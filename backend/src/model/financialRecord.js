import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    date: Date,
    desc: String,
    amount: Number,
    type: { type: String, enum: ['Credit', 'Debit'] },
    balance: Number
}, { _id: false }); // No ID needed for sub-documents to save space

const bankAccountSchema = new mongoose.Schema({
    account_id: String,
    bank: String,
    account_number: String,
    ifsc: String,
    type: String,
    opening_date: Date,
    transactions: [transactionSchema] // Array of transactions
});

const gstFilingSchema = new mongoose.Schema({
    period: String,
    type: String,
    total_sales: Number,
    total_purchases: Number,
    output_tax: Number,
    input_tax: Number,
    net_tax_paid: Number,
    filing_date: Date,
    status: String
});

const financialRecordSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true // One financial record per user
    },
    bank_accounts: [bankAccountSchema],
    gst_filings: [gstFilingSchema],
    last_updated: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('FinancialRecord', financialRecordSchema);