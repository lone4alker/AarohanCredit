// src/pages/LenderApplications.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LenderSidebar from '../components/Lender/LenderSidebar'; 
import Header from '../components/Header';
import { ListChecks, UserCheck, Clock, FileWarning, Search, CheckCircle, XCircle, Eye, Filter, Download, X } from 'lucide-react';

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const NEON_BLUE = '#4da3ff';

// Reusable function for Status badge styles
const getStatusStyles = (status) => {
    switch (status) {
        case 'reviewing': return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
        case 'pending': return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
        case 'approved': return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
        case 'rejected': return 'bg-rose-500/20 text-rose-400 border border-rose-500/30';
        default: return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
    }
};

const formatCurrency = (val = 0) => {
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)}Cr`;
  if (val >= 100000) return `₹${(val / 100000).toFixed(2)}L`;
  return `₹${val.toLocaleString('en-IN')}`;
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
    const [isDarkMode] = useState(true); 
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [user] = useState(() => {
        const stored = localStorage.getItem('user');
        return stored ? JSON.parse(stored) : { name: 'HDFC Bank Team', branch: 'Mumbai-HQ', id: 'L101', customId: 'L101' };
    });
    const lenderId = user.customId || user.id || 'L101';
    const [applications, setApplications] = useState([]);
    const [stats, setStats] = useState({ total_applications: 0, total_approved: 0, total_money_lent: 0, by_status: {} });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [showMsmeDetails, setShowMsmeDetails] = useState(false);
    const [msmeDetails, setMsmeDetails] = useState(null);
    const [activeTab, setActiveTab] = useState('all'); // 'all', 'pending', 'approved'

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.add('dark');
        root.classList.add('bg-[#0f1116]');
        fetchApplications();
        fetchStats();
    }, [lenderId, statusFilter, sortBy, sortOrder, activeTab]);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const status = activeTab === 'all' ? (statusFilter === 'all' ? '' : statusFilter) : activeTab;
            const url = `${API_BASE}/api/applications/lender/${lenderId}?${status ? `status=${status}&` : ''}sortBy=${sortBy}&sortOrder=${sortOrder}`;
            const response = await fetch(url);
            const data = await response.json();
            if (data.success) {
                setApplications(data.applications || []);
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await fetch(`${API_BASE}/api/applications/lender/${lenderId}/stats`);
            const data = await response.json();
            if (data.success) {
                setStats(data.stats);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleStatusUpdate = async (applicationId, newStatus, approvedAmount = null) => {
        try {
            const response = await fetch(`${API_BASE}/api/applications/${applicationId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: newStatus,
                    approved_amount: approvedAmount
                })
            });
            const data = await response.json();
            if (data.success) {
                await fetchApplications();
                await fetchStats();
                setSelectedApplication(null);
            } else {
                alert('Failed to update status: ' + (data.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Error updating status. Please try again.');
        }
    };

    const handleViewMsmeDetails = async (applicationId) => {
        try {
            const response = await fetch(`${API_BASE}/api/applications/${applicationId}/msme-details`);
            const data = await response.json();
            if (data.success) {
                setMsmeDetails(data.msme_details);
                setShowMsmeDetails(true);
            }
        } catch (error) {
            console.error('Error fetching MSME details:', error);
            alert('Error loading MSME details');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    const filteredApplications = applications.filter(app => {
        const matchesSearch = 
            app.application_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.msme_id?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

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
                    toggleTheme={() => {}} // Disabled toggle as theme is fixed
                    pageTitle="Loan Applications Pipeline"
                />

                <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                    {/* Summary Cards with Neon Styling */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <NeonStatCard title="Total Applications" value={stats.total_applications} icon={ListChecks} color="#4da3ff" />
                        <NeonStatCard title="Pending Review" value={stats.by_status?.pending?.count || 0} icon={Clock} color="#fcd34d" />
                        <NeonStatCard title="Approved" value={stats.total_approved} icon={UserCheck} color="#34d399" />
                        <NeonStatCard title="Total Money Lent" value={formatCurrency(stats.total_money_lent)} icon={FileWarning} color="#4da3ff" />
                    </div>

                    {/* Tabs for filtering */}
                    <div className="flex gap-3 mb-6">
                        {['all', 'pending', 'approved'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2 rounded-lg font-semibold transition ${
                                    activeTab === tab
                                        ? 'bg-[#4da3ff] text-white'
                                        : 'bg-[#111217] text-gray-400 hover:text-white border border-gray-700'
                                }`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)} ({tab === 'all' ? stats.total_applications : stats.by_status?.[tab]?.count || 0})
                            </button>
                        ))}
                    </div>
                    
                    {/* Applications Table with Neon Styling */}
                    <div className="bg-[#111217] rounded-xl border border-[#4da3ff]/50 shadow-[0_0_25px_#4da3ff]/40">
                        <div className="p-5 border-b border-gray-700/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <h2 className="text-xl font-semibold text-white">
                                {activeTab === 'approved' ? 'Accepted Proposals' : 'Loan Applications'}
                            </h2>
                            
                            <div className="flex gap-3 flex-wrap">
                                <div className="relative w-full sm:w-64">
                                    <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search by ID or MSME..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 pr-4 py-2 bg-[#0f1116] border border-[#4da3ff]/30 rounded-lg text-sm focus:ring-[#4da3ff] focus:border-[#4da3ff] text-white w-full transition-all"
                                    />
                                </div>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="px-4 py-2 bg-[#0f1116] border border-[#4da3ff]/30 rounded-lg text-sm text-white"
                                >
                                    <option value="createdAt">Sort by Date</option>
                                    <option value="requested_amount">Sort by Amount</option>
                                    <option value="msme_credit_score">Sort by Score</option>
                                </select>
                                <button
                                    onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                                    className="px-4 py-2 bg-[#0f1116] border border-[#4da3ff]/30 rounded-lg text-sm text-white hover:bg-[#4da3ff]/10"
                                >
                                    <Filter size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-700/50">
                                <thead className="bg-[#1a1b23]">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Application ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">MSME Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Policy</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Score</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Health</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Fit Score</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700/50">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="10" className="px-6 py-8 text-center text-gray-400">Loading applications...</td>
                                        </tr>
                                    ) : filteredApplications.length === 0 ? (
                                        <tr>
                                            <td colSpan="10" className="px-6 py-8 text-center text-gray-400">No applications found</td>
                                        </tr>
                                    ) : (
                                        filteredApplications.map((app) => (
                                            <tr 
                                                key={app._id} 
                                                className="hover:bg-[#1a1b23]/50 transition-colors"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#4da3ff]">{app.application_id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                    {app.msme_info?.name || app.msme_id}
                                                    {app.msme_info?.name && (
                                                        <span className="text-xs text-gray-500 block">({app.msme_id})</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{app.policy_id?.name || 'N/A'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{formatCurrency(app.requested_amount)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-white">{app.msme_credit_score}</td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm ${getHealthStyles(app.msme_financial_health)}`}>
                                                    {app.msme_financial_health}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4da3ff]">{app.policy_fit_score}%</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyles(app.status)}`}>
                                                        {app.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                                    {new Date(app.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                                    <button
                                                        onClick={() => handleViewMsmeDetails(app.application_id)}
                                                        className="text-[#4da3ff] hover:text-[#7abfff] transition-colors p-1 rounded-md hover:bg-[#4da3ff]/10"
                                                        title="View MSME Details"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    {app.status === 'pending' && (
                                                        <>
                                                            <button
                                                                onClick={() => {
                                                                    const amount = prompt('Enter approved amount (in Lakh ₹):', (app.requested_amount / 100000).toFixed(2));
                                                                    if (amount) {
                                                                        handleStatusUpdate(app.application_id, 'approved', parseFloat(amount) * 100000);
                                                                    }
                                                                }}
                                                                className="text-emerald-400 hover:text-emerald-300 transition-colors p-1 rounded-md hover:bg-emerald-500/10"
                                                                title="Approve"
                                                            >
                                                                <CheckCircle size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    if (window.confirm('Reject this application?')) {
                                                                        handleStatusUpdate(app.application_id, 'rejected');
                                                                    }
                                                                }}
                                                                className="text-rose-400 hover:text-rose-300 transition-colors p-1 rounded-md hover:bg-rose-500/10"
                                                                title="Reject"
                                                            >
                                                                <XCircle size={16} />
                                                            </button>
                                                        </>
                                                    )}
                                                    {app.status === 'pending' && (
                                                        <button
                                                            onClick={() => handleStatusUpdate(app.application_id, 'reviewing')}
                                                            className="text-yellow-400 hover:text-yellow-300 transition-colors p-1 rounded-md hover:bg-yellow-500/10"
                                                            title="Mark as Reviewing"
                                                        >
                                                            <Clock size={16} />
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* MSME Details Modal */}
                    {showMsmeDetails && (
                        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
                            <div className="bg-[#111217] rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-[#4da3ff]/50">
                                <div className="p-6 border-b border-[#4da3ff]/30 flex justify-between items-center">
                                    <h3 className="text-2xl font-bold text-white">MSME Details (JSON)</h3>
                                    <button
                                        onClick={() => {
                                            setShowMsmeDetails(false);
                                            setMsmeDetails(null);
                                        }}
                                        className="p-1 rounded-full text-gray-400 hover:text-white transition-colors hover:bg-gray-800"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                                <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
                                    <div className="mb-4 flex gap-3">
                                        <button
                                            onClick={() => {
                                                const jsonStr = JSON.stringify(msmeDetails, null, 2);
                                                const blob = new Blob([jsonStr], { type: 'application/json' });
                                                const url = URL.createObjectURL(blob);
                                                const a = document.createElement('a');
                                                a.href = url;
                                                a.download = `msme-${msmeDetails?.user?.customId || 'details'}.json`;
                                                a.click();
                                                URL.revokeObjectURL(url);
                                            }}
                                            className="px-4 py-2 bg-[#4da3ff] text-white rounded-lg hover:bg-[#6fa8ff] transition flex items-center gap-2"
                                        >
                                            <Download size={16} />
                                            Download JSON
                                        </button>
                                    </div>
                                    <pre className="bg-[#0f1116] p-4 rounded-lg border border-gray-700 text-sm text-gray-300 overflow-x-auto">
                                        {JSON.stringify(msmeDetails, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}