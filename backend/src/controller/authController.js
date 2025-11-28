import User from '../model/user.js';
import bcrypt from 'bcryptjs';

// --- SIGNUP ---
export const signup = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            role,
            phone,
            // MSME specific
            gstin,
            msme_type,
            sector,
            business_vintage_years,
            address,
            // Lender specific
            institution,
            designation
        } = req.body;

        // 1. Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { phone }, { gstin: gstin || undefined }]
        });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists (email, phone, or GSTIN)' });
        }

        // 2. Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // 3. Prepare user data based on role
        const userData = {
            name,
            email,
            passwordHash,
            role,
            phone,
            onboardingStatus: 'registered'
        };

        if (role === 'msme') {
            userData.gstin = gstin;
            userData.msme_type = msme_type;
            userData.sector = sector;
            userData.business_vintage_years = business_vintage_years;
            userData.address = address;
        } else if (role === 'lender') {
            userData.lender_profile = {
                institution,
                designation
            };
        }

        // 4. Create user
        const newUser = new User(userData);
        await newUser.save();

        res.status(201).json({
            message: 'User created successfully',
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                customId: newUser.customId
            }
        });

    } catch (error) {
        console.error('Signup Error:', error);
        res.status(500).json({ message: 'Server error during signup', error: error.message });
    }
};

// --- LOGIN ---
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find user
        const user = await User.findOne({ email }).select('+passwordHash');
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // 2. Compare password
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // 3. Return success (no token as requested)
        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                customId: user.customId
            }
        });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error during login', error: error.message });
    }
};
