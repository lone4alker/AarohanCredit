import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    User, Lock, Mail, Phone, Building2, Briefcase,
    CheckCircle2, ArrowRight
} from 'lucide-react';
import InputField from '../common/InputField';
import SelectField from '../common/SelectField';

export default function SignupForm({ onSwitch }) {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        phone: '',
        role: '', // 'msme' or 'lender'
        gstin: '',
        msme_type: 'Micro',
        sector: '',
        business_vintage_years: '',
        address: { street: '', city: '', state: '', pincode: '' },
        institution: '',
        designation: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Validation logic
        if (name === 'phone') {
            // Only allow digits and max 10 characters
            if (!/^\d*$/.test(value) || value.length > 10) return;
        }

        if (name === 'address.pincode') {
            // Only allow digits and max 6 characters
            if (!/^\d*$/.test(value) || value.length > 6) return;
        }

        if (name === 'gstin' && value.length > 15) return;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: { ...prev[parent], [child]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleRoleSelect = (role) => {
        setFormData(prev => ({ ...prev, role }));
        setStep(2);
    };

    const nextStep = (e) => {
        e.preventDefault();
        setError('');

        if (step === 2) {
            if (!formData.name || !formData.email || !formData.password || !formData.phone) {
                setError('Please fill in all fields.');
                return;
            }

            // GSTIN Validation for MSME
            if (formData.role === 'msme') {
                if (!formData.gstin) {
                    setError('Please enter your GSTIN.');
                    return;
                }
                if (formData.gstin.length !== 15) {
                    setError('GSTIN must be exactly 15 characters.');
                    return;
                }
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                setError('Please enter a valid email address.');
                return;
            }

            if (formData.phone.length !== 10) {
                setError('Please enter a valid 10-digit phone number.');
                return;
            }

            if (formData.password.length < 6) {
                setError('Password must be at least 6 characters long.');
                return;
            }
        }
        setStep(step + 1);
    };

    const prevStep = () => setStep(step - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            localStorage.setItem('user', JSON.stringify(data.user));

            if (data.user.role === 'msme') {
                navigate('/msme-dashboard');
            } else {
                navigate('/lender-dashboard');
            }

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const renderProgressBar = () => (
        <div className="flex items-center justify-center mb-8 space-x-2">
            {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${step >= s ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
                        }`}>
                        {step > s ? <CheckCircle2 size={16} /> : s}
                    </div>
                    {s < 3 && (
                        <div className={`w-12 h-1 rounded mx-2 ${step > s ? 'bg-indigo-600' : 'bg-gray-200'
                            }`} />
                    )}
                </div>
            ))}
        </div>
    );

    const renderStep1 = () => (
        <div className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-semibold text-gray-800 text-center">Choose your Account Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                    type="button"
                    onClick={() => handleRoleSelect('msme')}
                    className="p-6 border-2 border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all group text-left"
                >
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
                        <Building2 size={24} />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900">MSME</h4>
                    <p className="text-sm text-gray-500 mt-1">For businesses looking for growth and financial solutions.</p>
                </button>

                <button
                    type="button"
                    onClick={() => handleRoleSelect('lender')}
                    className="p-6 border-2 border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all group text-left"
                >
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mb-4 group-hover:scale-110 transition-transform">
                        <Briefcase size={24} />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900">Lender</h4>
                    <p className="text-sm text-gray-500 mt-1">For financial institutions and individual lenders.</p>
                </button>
            </div>
            <div className="text-center mt-4">
                <button onClick={onSwitch} className="text-sm text-indigo-600 hover:underline">
                    Already have an account? Log in
                </button>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <form onSubmit={nextStep} className="space-y-4 animate-fade-in">
            <h3 className="text-xl font-semibold text-gray-800 text-center mb-6">Basic Information</h3>

            <InputField
                label="Full Name"
                icon={User}
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
            />

            <InputField
                label="Email Address"
                icon={Mail}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
            />

            <InputField
                label="Password"
                icon={Lock}
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
            />

            <InputField
                label="Phone Number"
                icon={Phone}
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                required
            />

            {formData.role === 'msme' && (
                <InputField
                    label="GSTIN"
                    name="gstin"
                    value={formData.gstin}
                    onChange={handleChange}
                    placeholder="27AAAAA0000A1Z5"
                    required
                />
            )}

            <div className="flex gap-3 pt-4">
                <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                    Back
                </button>
                <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium flex items-center justify-center gap-2"
                >
                    Next <ArrowRight size={18} />
                </button>
            </div>
        </form>
    );

    const renderStep3 = () => (
        <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
            <h3 className="text-xl font-semibold text-gray-800 text-center mb-6">
                {formData.role === 'msme' ? 'Business Details' : 'Professional Details'}
            </h3>

            {formData.role === 'msme' ? (
                <>
                    <div className="grid grid-cols-2 gap-4">
                        <SelectField
                            label="Type"
                            name="msme_type"
                            value={formData.msme_type}
                            onChange={handleChange}
                            options={['Micro', 'Small', 'Medium']}
                        />
                        <InputField
                            label="Vintage (Years)"
                            type="number"
                            name="business_vintage_years"
                            value={formData.business_vintage_years}
                            onChange={handleChange}
                            placeholder="e.g. 5"
                        />
                    </div>

                    <InputField
                        label="Sector"
                        name="sector"
                        value={formData.sector}
                        onChange={handleChange}
                        placeholder="e.g. Manufacturing"
                    />

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        <InputField
                            name="address.street"
                            value={formData.address.street}
                            onChange={handleChange}
                            placeholder="Street Address"
                            className="mb-2"
                        />
                        <div className="grid grid-cols-3 gap-2">
                            <InputField
                                name="address.city"
                                value={formData.address.city}
                                onChange={handleChange}
                                placeholder="City"
                            />
                            <InputField
                                name="address.state"
                                value={formData.address.state}
                                onChange={handleChange}
                                placeholder="State"
                            />
                            <InputField
                                name="address.pincode"
                                value={formData.address.pincode}
                                onChange={handleChange}
                                placeholder="PIN"
                            />
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <InputField
                        label="Institution Name"
                        name="institution"
                        value={formData.institution}
                        onChange={handleChange}
                        placeholder="e.g. HDFC Bank"
                    />

                    <InputField
                        label="Designation"
                        name="designation"
                        value={formData.designation}
                        onChange={handleChange}
                        placeholder="e.g. Loan Officer"
                    />
                </>
            )}

            <div className="flex gap-3 pt-4">
                <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                    Back
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium flex items-center justify-center gap-2 disabled:opacity-70"
                >
                    {loading ? 'Creating...' : 'Create Account'}
                    {!loading && <CheckCircle2 size={18} />}
                </button>
            </div>
        </form>
    );

    return (
        <div>
            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 flex items-center gap-2">
                    <span className="font-bold">Error:</span> {error}
                </div>
            )}
            {renderProgressBar()}
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
        </div>
    );
}
