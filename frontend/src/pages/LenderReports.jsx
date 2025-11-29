// src/pages/LenderReports.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LenderSidebar from '../components/Lender/LenderSidebar'; 
import Header from '../components/Header';
import { FileText, Download, TrendingUp, Search, Filter } from 'lucide-react';

// Neon Blue Accent Color
const NEON_BLUE = '#4da3ff';

// --- Sample Data: MSME Application Reports ---
const reportData = [
    { 
        id: 'RPT-2025-11-001', 
        msme: 'Vedant Empires', 
        sector: 'Retail Trade', 
        amount: '₹ 15 L', 
        aiScore: 780, 
        health: 'Excellent', 
        risk: 'Low', 
        date: '2025-11-27', 
        status: 'Approved' 
    },
    { 
        id: 'RPT-2025-11-002', 
        msme: 'Innovate Solutions', 
        sector: 'IT Services', 
        amount: '₹ 5 L', 
        aiScore: 650, 
        health: 'Fair', 
        risk: 'Moderate', 
        date: '2025-11-26', 
        status: 'Reviewing' 
    },
    { 
        id: 'RPT-2025-11-003', 
        msme: 'Swift Logistics', 
        sector: 'Transportation', 
        amount: '₹ 25 L', 
        aiScore: 810, 
        health: 'Excellent', 
        risk: 'Very Low', 
        date: '2025-11-25', 
        status: 'Approved' 
    },
    { 
        id: 'RPT-2025-11-004', 
        msme: 'AgriTech Solutions', 
        sector: 'Agriculture', 
        amount: '₹ 10 L', 
        aiScore: 720, 
        health: 'Good', 
        risk: 'Low', 
        date: '2025-11-24', 
        status: 'Rejected' 
    },
    { 
        id: 'RPT-2025-11-005', 
        msme: 'City Hardware', 
        sector: 'Manufacturing', 
        amount: '₹ 2 L', 
        aiScore: 610, 
        health: 'Poor', 
        risk: 'High', 
        date: '2025-11-23', 
        status: 'Rejected' 
    },
];

// --- Utility Functions for Styling ---
const getRiskStyles = (risk) => {
    switch (risk) {
        case 'Very Low': return 'text-emerald-400 font-semibold';
        case 'Low': return 'text-lime-400 font-semibold';
        case 'Moderate': return 'text-yellow-400 font-semibold';
        case 'High': return 'text-rose-400 font-semibold';
        default: return 'text-gray-400 font-semibold';
    }
}

const getStatusBadgeStyles = (status) => {
    switch (status) {
        case 'Reviewing': return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
        case 'Approved': return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
        case 'Rejected': return 'bg-rose-500/20 text-rose-400 border border-rose-500/30';
        default: return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
    }
};

/**
 * Detailed Reports Page Component
 */
export default function LenderReports() {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [user] = useState({ name: 'HDFC Bank Team', branch: 'Mumbai-HQ' }); 
    const [searchTerm, setSearchTerm] = useState('');
    const [isDarkMode] = useState(true);

    useEffect(() => {
        // Enforce dark mode and dark background for theme consistency
        document.documentElement.classList.add('dark', 'bg-[#0f1116]');
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    // Filter logic
    const filteredReports = reportData.filter(report =>
        report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.msme.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Simulated PDF Download handler
    const handleDownloadReport = (msmeName, reportId) => {
        alert(`Simulating download for the comprehensive AI Credit Report of ${msmeName} (${reportId}).`);
        // In a real application, this would trigger an API call to generate/fetch the PDF.
    };

    return (
        <div className="min-h-screen bg-[#0f1116] font-sans text-gray-100 selection:bg-[#4da3ff]/30">

            <LenderSidebar
                activeTab="reports" 
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
                    toggleTheme={() => {}} 
                    pageTitle="Detailed Credit Reports"
                />

                <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                    
                    {/* --- Page Header and Search/Filter --- */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                        <h1 className="text-3xl font-bold text-white flex items-center mb-4 sm:mb-0">
                            <FileText size={28} className={`mr-3 text-[${NEON_BLUE}]`} style={{ color: NEON_BLUE }} />
                            Generated MSME Reports
                        </h1>
                        <div className="relative w-full sm:w-80">
                            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search Report ID or MSME Name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                // Input Styling consistent with other pages
                                className={`pl-10 pr-4 py-2 bg-[#111217] border border-[${NEON_BLUE}]/30 rounded-lg text-sm focus:ring-[${NEON_BLUE}] focus:border-[${NEON_BLUE}] text-white w-full transition-all`}
                            />
                        </div>
                    </div>

                    {/* --- Report Table Container --- */}
                    <div 
                        className="bg-[#111217] rounded-xl shadow-lg border border-[#4da3ff]/50 shadow-[0_0_25px_#4da3ff]/40 overflow-hidden"
                    >
                        
                        <div className="p-5 border-b border-gray-700/50 flex justify-between items-center bg-[#1a1b23]">
                            <h2 className="text-xl font-semibold text-white">Full Assessment History</h2>
                            <button
                                // Example filter button
                                className={`flex items-center space-x-2 text-[${NEON_BLUE}] hover:text-[#7abfff] px-3 py-1 rounded-lg transition-colors border border-transparent hover:border-[${NEON_BLUE}]/30`}
                                style={{ color: NEON_BLUE }}
                            >
                                <Filter size={18} />
                                <span>Filter By Sector</span>
                            </button>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-700/50">
                                <thead className="bg-[#1a1b23]">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Report ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">MSME Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Sector</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">AI Score</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Risk Profile</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date Generated</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700/50">
                                    {filteredReports.map((report) => (
                                        <tr 
                                            key={report.id} 
                                            className="hover:bg-[#1a1b23]/50 transition-colors"
                                        >
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-[${NEON_BLUE}]`} style={{ color: NEON_BLUE }}>{report.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{report.msme}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{report.sector}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-white flex items-center">
                                                {report.aiScore} 
                                                <TrendingUp size={14} className="ml-2 text-emerald-400" />
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm ${getRiskStyles(report.risk)}`}>
                                                {report.risk}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{report.date}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeStyles(report.status)}`}>
                                                    {report.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                                <button
                                                    onClick={() => handleDownloadReport(report.msme, report.id)}
                                                    className={`inline-flex items-center space-x-1 text-[${NEON_BLUE}] hover:text-[#7abfff] transition-colors p-2 rounded-lg hover:bg-[${NEON_BLUE}]/10`}
                                                    style={{ color: NEON_BLUE }}
                                                    aria-label={`Download full report for ${report.msme}`}
                                                >
                                                    <Download size={16} />
                                                    <span>PDF</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {filteredReports.length === 0 && (
                            <div className="text-center p-10 text-gray-500">
                                <p className="text-sm">No reports found matching your criteria.</p>
                            </div>
                        )}
                    </div>

                </main>
            </div>
        </div>
    );
}