import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ChevronRight } from 'lucide-react';

export default function LoginForm({ onSwitch }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
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

    return (
        <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Welcome Back</h3>

            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 flex items-center gap-2">
                    <span className="font-bold">Error:</span> {error}
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                    <Mail className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="you@example.com"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                    <Lock className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <input
                        type="password"
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="••••••••"
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition-colors focus:ring-4 focus:ring-indigo-500/20 disabled:opacity-70 flex items-center justify-center gap-2 mt-4"
            >
                {loading ? 'Signing In...' : 'Sign In'}
                {!loading && <ChevronRight size={18} />}
            </button>

            <div className="text-center mt-6">
                <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <button
                        type="button"
                        onClick={onSwitch}
                        className="text-indigo-600 font-medium hover:underline"
                    >
                        Create one
                    </button>
                </p>
            </div>
        </form>
    );
}
