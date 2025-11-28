// src/pages/LenderDashboard.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LenderSidebar from '../components/Lender/LenderSidebar'; 
import Header from '../components/Header';
import { Wallet, Activity, ArrowUpRight, CheckCircle, Clock } from 'lucide-react';

// === CHART IMPORTS (Assuming 'recharts' is installed) ===
import {
    PieChart, Pie, Cell, ResponsiveContainer,
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';

// --- Chart Data ---
const segmentData = [
    { name: 'Micro', value: 4500 },
    { name: 'Small', value: 3000 },
    { name: 'Medium', value: 2500 },
];
const COLORS = ['#3b82f6', '#f59e0b', '#10b981']; // Blue, Amber, Emerald

const trendData = [
    { name: 'Jan', HighRisk: 15, LowRisk: 40 },
    { name: 'Feb', HighRisk: 18, LowRisk: 35 },
    { name: 'Mar', HighRisk: 12, LowRisk: 42 },
    { name: 'Apr', HighRisk: 10, LowRisk: 45 },
    { name: 'May', HighRisk: 14, LowRisk: 38 },
    { name: 'Jun', HighRisk: 20, LowRisk: 30 },
];

// --- Chart Components ---

const SegmentPieChart = () => (
    <ResponsiveContainer width="100%" height={300}>
        <PieChart>
            <Pie
                data={segmentData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
                {segmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Pie>
            <Tooltip 
                contentStyle={{ 
                    backgroundColor: '#1a1b23', 
                    border: '1px solid #374151', 
                    borderRadius: '8px' 
                }} 
                labelStyle={{ color: '#fff' }}
                formatter={(value, name) => [`₹ ${value.toLocaleString()} Cr`, name]}
            />
            <Legend layout="horizontal" align="center" verticalAlign="bottom" wrapperStyle={{ paddingTop: '10px' }} />
        </PieChart>
    </ResponsiveContainer>
);

const RiskTrendLineChart = ({ isDarkMode }) => (
    <ResponsiveContainer width="100%" height={300}>
        <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
            <XAxis dataKey="name" stroke={isDarkMode ? '#9ca3af' : '#4b5563'} />
            <YAxis stroke={isDarkMode ? '#9ca3af' : '#4b5563'} />
            <Tooltip 
                contentStyle={{ 
                    backgroundColor: '#1a1b23', 
                    border: '1px solid #374151', 
                    borderRadius: '8px' 
                }} 
                labelStyle={{ color: '#fff' }}
                formatter={(value) => [`${value} Apps`, "Applications"]}
            />
            <Legend />
            <Line type="monotone" dataKey="HighRisk" stroke="#ef4444" strokeWidth={2} name="High Risk Apps" />
            <Line type="monotone" dataKey="LowRisk" stroke="#10b981" strokeWidth={2} name="Low Risk Apps" />
        </LineChart>
    </ResponsiveContainer>
);


// Reusable Card component for dashboard metrics
const StatCard = ({ title, value, icon: Icon, percentage, color }) => {
    const isPositive = percentage && parseFloat(percentage) >= 0;
    const percentageColor = isPositive ? 'text-emerald-400' : 'text-rose-400';
    const percentageIcon = isPositive ? ArrowUpRight : ArrowUpRight; 

    return (
        <div className="bg-white dark:bg-[#1a1b23] p-5 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 transition-all hover:shadow-xl">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center opacity-80`} style={{ backgroundColor: color, color: '#fff' }}>
                    <Icon size={16} />
                </div>
            </div>
            <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">{value}</p>
            {percentage && (
                <div className="flex items-center mt-3">
                    <span className={`text-xs font-semibold ${percentageColor} flex items-center`}>
                        <percentageIcon size={14} className="mr-1 transform rotate-45" />
                        {percentage}% vs last month
                    </span>
                </div>
            )}
        </div>
    );
};

// Placeholder for a simple table of recent applications 
const RecentApplicationsTable = () => {
    const applications = [
        { id: 'CRD781', msme: 'Vedant Empires', amount: '₹ 15 L', score: 780, status: 'Reviewing', date: '2025-11-27' },
        { id: 'CRD780', msme: 'Innovate Solutions', amount: '₹ 5 L', score: 650, status: 'Pending Data', date: '2025-11-26' },
        { id: 'CRD779', msme: 'Swift Logistics', amount: '₹ 25 L', score: 810, status: 'Approved', date: '2025-11-25' },
    ];

    const getStatusStyles = (status) => {
        switch (status) {
            case 'Reviewing': return 'bg-yellow-500/20 text-yellow-400';
            case 'Pending Data': return 'bg-blue-500/20 text-blue-400';
            case 'Approved': return 'bg-emerald-500/20 text-emerald-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    return (
        <div className="bg-white dark:bg-[#1a1b23] p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 mt-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">New Application Pipeline</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead>
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Application ID</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">MSME Name</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Requested Amount</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">AI Score</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {applications.map((app) => (
                            <tr key={app.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-indigo-500">{app.id}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{app.msme}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{app.amount}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-700 dark:text-gray-300">{app.score}</td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyles(app.status)}`}>
                                        {app.status}
                                    </span>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{app.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Main Lender Dashboard Component
export default function LenderDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard'); 
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [user] = useState({ name: 'HDFC Bank Team', branch: 'Mumbai-HQ' }); 

    useEffect(() => {
        const root = window.document.documentElement;
        if (isDarkMode) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [isDarkMode]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Row 1: Key Metrics */}
                        <StatCard 
                            title="Total Portfolio Value" 
                            value="₹ 500 Cr" 
                            icon={Wallet} 
                            percentage="+3.2" 
                            color="#3b82f6" 
                        />
                        <StatCard 
                            title="New Applications" 
                            value="45" 
                            icon={Activity} 
                            percentage="-12.5" 
                            color="#f59e0b" 
                        />
                        <StatCard 
                            title="Approval Rate (30 Days)" 
                            value="88.4%" 
                            icon={CheckCircle} 
                            percentage="+1.1" 
                            color="#10b981" 
                        />
                        <StatCard 
                            title="Avg. Decision Time" 
                            value="12 hrs" 
                            icon={Clock} 
                            percentage="-20" 
                            color="#ef4444" 
                        />
                        
                        {/* Row 2: Application Table */}
                        <div className="lg:col-span-4">
                            <RecentApplicationsTable />
                        </div>
                        
                        {/* Row 3: Charts */}
                        <div className="md:col-span-2 bg-white dark:bg-[#1a1b23] p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800">
                            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">MSME Segment Distribution</h3>
                            <SegmentPieChart />
                        </div>
                        <div className="md:col-span-2 bg-white dark:bg-[#1a1b23] p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800">
                            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Risk Profile Trends (30D)</h3>
                            <RiskTrendLineChart isDarkMode={isDarkMode} />
                        </div>
                    </div>
                );
            case 'applications':
            case 'reports':
            case 'notifications':
                return (
                    <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
                         <div className="w-16 h-16 bg-indigo-500/20 text-indigo-500 rounded-2xl flex items-center justify-center mb-4 border border-indigo-500/50">
                            <Activity size={32} />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-300 capitalize">{activeTab.replace('-', ' ')} Module</h2>
                        <p className="text-sm mt-2">Content for {activeTab} goes here...</p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-[#111217] font-sans selection:bg-indigo-500/30 text-gray-800 dark:text-gray-100">

            {/* 1. Sidebar Component */}
            <LenderSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isOpen={sidebarOpen}
                setIsOpen={setSidebarOpen}
                onLogout={handleLogout}
            />

            {/* Main Content Wrapper */}
            <div className="lg:ml-64 min-h-screen flex flex-col">

                {/* 2. Header Component */}
                <Header
                    user={user}
                    showSync={false} 
                    toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                    isDarkMode={isDarkMode}
                    toggleTheme={toggleTheme}
                />

                {/* 3. Page Content */}
                <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}