// src/pages/LenderApplications.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LenderSidebar from '../components/Lender/LenderSidebar';
import Header from '../components/Header';
import { ListChecks, UserCheck, Clock, FileWarning, Search } from 'lucide-react';

// Sample data for the application list
const applicationsData = [
    { id: 'CRD781', msme: 'Vedant Empires', amount: '₹ 15 L', score: 780, status: 'Reviewing', date: '2025-11-27', health: 'Good' },
    { id: 'CRD780', msme: 'Innovate Solutions', amount: '₹ 5 L', score: 650, status: 'Pending Data', date: '2025-11-26', health: 'Fair' },
    { id: 'CRD779', msme: 'Swift Logistics', amount: '₹ 25 L', score: 810, status: 'Approved', date: '2025-11-25', health: 'Excellent' },
    { id: 'CRD778', msme: 'AgriTech Solutions', amount: '₹ 10 L', score: 720, status: 'Reviewing', date: '2025-11-24', health: 'Good' },
    { id: 'CRD777', msme: 'Global Imports', amount: '₹ 50 L', score: 850, status: 'Approved', date: '2025-11-23', health: 'Excellent' },
    { id: 'CRD776', msme: 'City Hardware', amount: '₹ 2 L', score: 610, status: 'Rejected', date: '2025-11-23', health: 'Poor' },
];

// Reusable function for Status badge styles
const getStatusStyles = (status) => {
    switch (status) {
        case 'Reviewing': return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
        case 'Pending Data': return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
        case 'Approved': return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
        case 'Rejected': return 'bg-rose-500/20 text-rose-400 border border-rose-500/30';
        default: return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
    }
};

// Reusable function for Health text styles
const getHealthStyles = (health) => {
    switch (health) {
        case 'Excellent': return 'text-emerald-400 font-semibold';
        case 'Good': return 'text-lime-400 font-semibold';
        case 'Fair': return 'text-amber-400 font-semibold';
        case 'Poor': return 'text-rose-400 font-semibold';
        default: return 'text-gray-400 font-semibold';
    }
}


// Neon Card Component to match LenderDashboard StatCard aesthetic
const NeonStatCard = ({ title, value, icon: Icon, color }) => {
    // Determine card styling based on icon color (defaulting to neon blue)
    const cardColor = color || '#4da3ff';

    return (
        <div
            className="p-5 rounded-xl border border-[#4da3ff]/50 shadow-[0_0_25px_#4da3ff]/50 bg-[#111217] transition-all duration-300 hover:shadow-[0_0_35px_#4da3ff]/70"
        >
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-400">{title}</span>
                <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center`}
                    style={{ backgroundColor: cardColor, color: '#fff', opacity: '0.8' }}
                >
                    <Icon size={16} />
                </div>
            </div>
            <p className="text-3xl font-bold mt-2 text-white">{value}</p>
        </div>
    );
};


export default function LenderApplications() {
    const navigate = useNavigate();
    // Set isDarkMode to true to enforce the dark theme
    const [isDarkMode] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [user] = useState({ name: 'HDFC Bank Team', branch: 'Mumbai-HQ' });
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const root = window.document.documentElement;
        // Ensure dark mode is active to apply the neon theme
        root.classList.add('dark');
        root.classList.add('bg-[#0f1116]'); // Enforce background color on root
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    // Filter applications based on search term
    const filteredApplications = applicationsData.filter(app =>
        app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.msme.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        // Set main background to off-black
        <div className="min-h-screen bg-[#0f1116] font-sans text-gray-100 selection:bg-[#4da3ff]/30">

            <LenderSidebar
                activeTab="applications"
                setActiveTab={(tab) => navigate(`/lender-${tab}`)}
                isOpen={sidebarOpen}
                setIsOpen={setSidebarOpen}
                onLogout={handleLogout}
            />

            <div className="lg:ml-64 min-h-screen flex flex-col">

                <Header
                    user={user}
                    showSync={false}
                    toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                    isDarkMode={isDarkMode}
                    toggleTheme={() => { }} // Disabled toggle as theme is fixed
                    pageTitle="Loan Applications Pipeline"
                />

                <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                    {/* Summary Cards with Neon Styling */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <NeonStatCard title="Total Applications" value="650" icon={ListChecks} color="#4da3ff" />
                        <NeonStatCard title="Pending Review" value="45" icon={Clock} color="#fcd34d" /> {/* Yellow for pending */}
                        <NeonStatCard title="Approved (30D)" value="120" icon={UserCheck} color="#34d399" /> {/* Emerald for approved */}
                        <NeonStatCard title="High Risk Alerts" value="8" icon={FileWarning} color="#f87171" /> {/* Red for risk */}
                    </div>

                    {/* Applications Table with Neon Styling */}
                    <div className="bg-[#111217] rounded-xl border border-[#4da3ff]/50 shadow-[0_0_25px_#4da3ff]/40">
                        <div className="p-5 border-b border-gray-700/50 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                            <h2 className="text-xl font-semibold text-white mb-4 sm:mb-0">Recent Applications</h2>

                            <div className="relative w-full sm:w-64">
                                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by ID or MSME Name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    // Input Styling
                                    className="pl-10 pr-4 py-2 bg-[#0f1116] border border-[#4da3ff]/30 rounded-lg text-sm focus:ring-[#4da3ff] focus:border-[#4da3ff] text-white w-full transition-all"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-700/50">
                                <thead className="bg-[#1a1b23]"> {/* Slightly lighter dark background for header */}
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Application ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">MSME Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Requested Amount</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">AI Score</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Health</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700/50">
                                    {filteredApplications.map((app) => (
                                        <tr
                                            key={app.id}
                                            className="hover:bg-[#1a1b23]/50 transition-colors cursor-pointer" // Subtle hover effect
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#4da3ff]">{app.id}</td> {/* Neon blue text */}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{app.msme}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{app.amount}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-white">{app.score}</td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm ${getHealthStyles(app.health)}`}>{app.health}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyles(app.status)}`}>
                                                    {app.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{app.date}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button className="text-[#4da3ff] hover:text-[#7abfff] transition-colors p-1 rounded-md hover:bg-[#4da3ff]/10">
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {filteredApplications.length === 0 && (
                            <div className="text-center p-10 text-gray-500">
                                <p className="text-sm">No applications found matching your search term.</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}