import React, { useState } from 'react';
import { Building2, Briefcase } from 'lucide-react';
import LoginForm from '../components/auth/LoginForm';
import SignupForm from '../components/auth/SignupForm';

export default function Login() {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-5xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">

                {/* Left Side - Hero */}
                <div className="md:w-5/12 bg-indigo-600 p-12 text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10">
                        <h1 className="text-4xl font-bold mb-6">MuHacks FinTech</h1>
                        <p className="text-indigo-100 text-lg leading-relaxed">
                            Join thousands of MSMEs and Lenders transforming the financial landscape together.
                        </p>
                    </div>

                    <div className="space-y-6 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-indigo-500/50 rounded-lg flex items-center justify-center backdrop-blur-sm">
                                <Building2 size={20} />
                            </div>
                            <div>
                                <p className="font-semibold">Smart Onboarding</p>
                                <p className="text-xs text-indigo-200">Paperless & Instant</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-indigo-500/50 rounded-lg flex items-center justify-center backdrop-blur-sm">
                                <Briefcase size={20} />
                            </div>
                            <div>
                                <p className="font-semibold">Lender Connect</p>
                                <p className="text-xs text-indigo-200">Direct Access</p>
                            </div>
                        </div>
                    </div>

                    {/* Decorative Circles */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 translate-y-1/2 -translate-x-1/2"></div>
                </div>

                {/* Right Side - Form */}
                <div className="md:w-7/12 p-8 md:p-12 flex flex-col justify-center">
                    {isLogin ? (
                        <LoginForm onSwitch={() => setIsLogin(false)} />
                    ) : (
                        <SignupForm onSwitch={() => setIsLogin(true)} />
                    )}
                </div>
            </div>
        </div>
    );
}
