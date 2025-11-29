import mongoose from 'mongoose';

// --- HELPER: AUTO ID GENERATOR ---
async function generateCustomId(role) {
    const prefix = role === 'msme' ? 'M' : 'L';
    const count = await mongoose.model('User').countDocuments({ role });
    return prefix + (100 + count + 1); // M101, M102 ... L101 ...
}

// --- AA SUBSCHEMA ---
const aaHandleSchema = new mongoose.Schema({
    provider: { type: String, required: true },
    handle: { type: String, required: true },
    linkedAt: { type: Date, default: Date.now }
}, { _id: false });

// --- MAIN USER SCHEMA ---
const userSchema = new mongoose.Schema({

    role: {
        type: String,
        enum: ['msme', 'lender'],
        required: true
    },

    customId: {
        type: String,
        unique: true
    },

    name: { type: String, required: true, trim: true },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    phone: {
        type: String,
        required: true,
        unique: true
    },

    passwordHash: { type: String, required: true, select: false },

    onboardingStatus: {
        type: String,
        enum: ['registered', 'aa_linked', 'completed'],
        default: 'registered'
    },

    gstin: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
        uppercase: true
    },

    msme_type: { type: String, enum: ['Micro', 'Small', 'Medium'] },
    sector: String,
    business_vintage_years: Number,

    address: {
        street: String,
        city: String,
        state: String,
        pincode: String
    },

    aa_handles: [aaHandleSchema],

    latest_credit_score: {
        score: Number,
        last_updated: Date
    },

    lender_profile: {
        institution: String,
        designation: String,
        approved_products: [String]
    }

}, { timestamps: true });


// --- PRE-SAVE HOOK TO GENERATE CUSTOM ID ---
userSchema.pre('save', async function () {
    if (!this.customId) {
        this.customId = await generateCustomId(this.role);
    }
});

export default mongoose.model('User', userSchema);
