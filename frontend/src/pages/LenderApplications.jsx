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

const getStatusStyles = (status) => {
    switch (status) {
        case 'Reviewing': return 'bg-yellow-500/20 text-yellow-400';
        case 'Pending Data': return 'bg-blue-500/20 text-blue-400';
        case 'Approved': return 'bg-emerald-500/20 text-emerald-400';
        case 'Rejected': return 'bg-rose-500/20 text-rose-400';
        default: return 'bg-gray-500/20 text-gray-400';
    }
};

const getHealthStyles = (health) => {
    switch (health) {
        case 'Excellent': return 'text-emerald-500';
        case 'Good': return 'text-lime-500';
        case 'Fair': return 'text-amber-500';
        case 'Poor': return 'text-rose-500';
        default: return 'text-gray-500';
    }
}


export default function LenderApplications() {
    const navigate = useNavigate();
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [user] = useState({ name: 'HDFC Bank Team', branch: 'Mumbai-HQ' }); 
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const root = window.document.documentElement;
        if (isDarkMode) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

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
        <div className="min-h-screen bg-gray-100 dark:bg-[#111217] font-sans text-gray-800 dark:text-gray-100">

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
                    toggleTheme={toggleTheme}
                    pageTitle="Loan Applications Pipeline"
                />

                <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {/* Summary Cards */}
                        <div className="bg-white dark:bg-[#1a1b23] p-5 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Applications</p>
                                <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">650</p>
                            </div>
                            <ListChecks size={32} className="text-indigo-500 opacity-70" />
                        </div>
                        <div className="bg-white dark:bg-[#1a1b23] p-5 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Review</p>
                                <p className="text-2xl font-bold mt-1 text-yellow-500">45</p>
                            </div>
                            <Clock size={32} className="text-yellow-500 opacity-70" />
                        </div>
                        <div className="bg-white dark:bg-[#1a1b23] p-5 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Approved (30D)</p>
                                <p className="text-2xl font-bold mt-1 text-emerald-500">120</p>
                            </div>
                            <UserCheck size={32} className="text-emerald-500 opacity-70" />
                        </div>
                        <div className="bg-white dark:bg-[#1a1b23] p-5 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">High Risk Alerts</p>
                                <p className="text-2xl font-bold mt-1 text-rose-500">8</p>
                            </div>
                            <FileWarning size={32} className="text-rose-500 opacity-70" />
                        </div>
                    </div>

                    {/* Applications Table */}
                    <div className="bg-white dark:bg-[#1a1b23] rounded-xl shadow-lg border border-gray-200 dark:border-gray-800">
                        <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Applications</h2>
                            <div className="relative">
                                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by ID or MSME Name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white w-64"
                                />
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-900">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Application ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">MSME Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Requested Amount</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">AI Score</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Health</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {filteredApplications.map((app) => (
                                        <tr key={app.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-500">{app.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{app.msme}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{app.amount}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700 dark:text-gray-300">{app.score}</td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getHealthStyles(app.health)}`}>{app.health}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyles(app.status)}`}>
                                                    {app.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.date}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors p-1 rounded-md hover:bg-indigo-100/20">
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