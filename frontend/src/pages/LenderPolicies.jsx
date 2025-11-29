// src/pages/LenderPolicies.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LenderSidebar from '../components/Lender/LenderSidebar'; 
import Header from '../components/Header';
import { Plus, Edit, Trash2, Zap, Save, X, Settings } from 'lucide-react';

// Neon Blue Accent Color
const NEON_BLUE = '#4da3ff';
const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

/**
 * Custom hook for managing policies with API persistence
 */
const usePolicies = (lenderId) => {
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (lenderId) {
            fetchPolicies();
        }
    }, [lenderId]);

    const fetchPolicies = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE}/api/policies/lender/${lenderId}`);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', response.status, errorText);
                throw new Error(`HTTP ${response.status}: ${errorText.substring(0, 100)}`);
            }
            
            const data = await response.json();
            if (data.success) {
                setPolicies(data.policies || []);
            } else {
                console.error('API returned error:', data.message);
                setPolicies([]);
            }
        } catch (error) {
            console.error('Error fetching policies:', error);
            setPolicies([]);
            // Show user-friendly error
            if (error.message.includes('404')) {
                console.warn('No policies found for lender:', lenderId);
            }
        } finally {
            setLoading(false);
        }
    };

    const addPolicy = async (newPolicy) => {
        try {
            const response = await fetch(`${API_BASE}/api/policies`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newPolicy, lender_id: lenderId })
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', response.status, errorText);
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            if (data.success) {
                await fetchPolicies();
                return true;
            } else {
                console.error('API error:', data.message);
                return false;
            }
        } catch (error) {
            console.error('Error creating policy:', error);
            return false;
        }
    };

    const updatePolicy = async (updatedPolicy) => {
        try {
            const response = await fetch(`${API_BASE}/api/policies/${updatedPolicy._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedPolicy)
            });
            const data = await response.json();
            if (data.success) {
                await fetchPolicies();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error updating policy:', error);
            return false;
        }
    };

    const deletePolicy = async (id) => {
        try {
            const response = await fetch(`${API_BASE}/api/policies/${id}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            if (data.success) {
                await fetchPolicies();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error deleting policy:', error);
            return false;
        }
    };

    return { policies, addPolicy, updatePolicy, deletePolicy, loading, refetch: fetchPolicies };
};


/**
 * Policy Form Component (Add/Edit Modal) - Styled with Neon Blue
 */
const PolicyForm = ({ isOpen, onClose, policyToEdit, savePolicy }) => {
    // Initial state for form, either empty or from policyToEdit
    const initialFormState = {
        name: '',
        interestRate: 10.5,
        maxAmount: 50, // in Lakhs
        minCreditScore: 700,
        minFinancialHealth: 'Good',
        minVintageMonths: 12,
        isActive: true, // Default to active
        ...policyToEdit // Overwrites defaults if editing
    };

    const [formData, setFormData] = useState(initialFormState);

    // Reset form data when policyToEdit changes (for editing) or modal closes
    useEffect(() => {
        setFormData(initialFormState);
    }, [policyToEdit, isOpen]); 

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) : value),
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        savePolicy(formData);
        onClose(); // Close modal after saving
    };

    const isEditing = !!policyToEdit;

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div 
                // Neon-styled modal container
                className="bg-[#111217] rounded-xl shadow-2xl w-full max-w-xl border border-[#4da3ff]/50 shadow-[0_0_25px_#4da3ff]/40 animate-in fade-in zoom-in-95"
            >
                
                {/* Modal Header */}
                <div className="p-6 border-b border-[#4da3ff]/30 flex justify-between items-center">
                    <h3 className="text-2xl font-bold text-white flex items-center">
                        <Settings size={24} className={`mr-3 text-[${NEON_BLUE}]`} style={{ color: NEON_BLUE }} />
                        {isEditing ? 'Edit Lending Policy' : 'Create New Lending Policy'}
                    </h3>
                    <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:text-white transition-colors hover:bg-gray-800">
                        <X size={20} />
                    </button>
                </div>
                
                {/* Modal Body (Form) */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    
                    {/* Policy Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Policy Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            // Neon-styled input
                            className={`w-full px-4 py-2.5 bg-[#0f1116] border border-gray-700 rounded-lg focus:ring-[${NEON_BLUE}] focus:border-[${NEON_BLUE}] text-white transition-all`}
                            placeholder="e.g., 'Micro Enterprise High Score Loan'"
                        />
                    </div>

                    {/* Financial Criteria Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Max Amount */}
                        <div>
                            <label htmlFor="maxAmount" className="block text-sm font-medium text-gray-300 mb-2">Max Loan Amount (Lakh ₹)</label>
                            <input
                                type="number"
                                id="maxAmount"
                                name="maxAmount"
                                value={formData.maxAmount}
                                onChange={handleChange}
                                required
                                min="1"
                                step="1"
                                className={`w-full px-4 py-2.5 bg-[#0f1116] border border-gray-700 rounded-lg focus:ring-[${NEON_BLUE}] focus:border-[${NEON_BLUE}] text-white transition-all`}
                            />
                        </div>
                        
                        {/* Interest Rate */}
                        <div>
                            <label htmlFor="interestRate" className="block text-sm font-medium text-gray-300 mb-2">Interest Rate (%)</label>
                            <input
                                type="number"
                                id="interestRate"
                                name="interestRate"
                                value={formData.interestRate}
                                onChange={handleChange}
                                required
                                min="0.1"
                                step="0.1"
                                className={`w-full px-4 py-2.5 bg-[#0f1116] border border-gray-700 rounded-lg focus:ring-[${NEON_BLUE}] focus:border-[${NEON_BLUE}] text-white transition-all`}
                            />
                        </div>

                        {/* Min Credit Score */}
                        <div>
                            <label htmlFor="minCreditScore" className="block text-sm font-medium text-gray-300 mb-2">Min. AI Credit Score</label>
                            <input
                                type="number"
                                id="minCreditScore"
                                name="minCreditScore"
                                value={formData.minCreditScore}
                                onChange={handleChange}
                                required
                                min="300"
                                max="900"
                                step="1"
                                className={`w-full px-4 py-2.5 bg-[#0f1116] border border-gray-700 rounded-lg focus:ring-[${NEON_BLUE}] focus:border-[${NEON_BLUE}] text-white transition-all`}
                            />
                        </div>

                        {/* Min Financial Health */}
                        <div>
                            <label htmlFor="minFinancialHealth" className="block text-sm font-medium text-gray-300 mb-2">Min. Financial Health Rating</label>
                            <select
                                id="minFinancialHealth"
                                name="minFinancialHealth"
                                value={formData.minFinancialHealth}
                                onChange={handleChange}
                                required
                                className={`w-full px-4 py-2.5 bg-[#0f1116] border border-gray-700 rounded-lg focus:ring-[${NEON_BLUE}] focus:border-[${NEON_BLUE}] text-white transition-all`}
                            >
                                <option className='bg-[#1a1b23]'>Excellent</option>
                                <option className='bg-[#1a1b23]'>Good</option>
                                <option className='bg-[#1a1b23]'>Fair</option>
                                <option className='bg-[#1a1b23]'>Poor</option>
                            </select>
                        </div>
                    </div>

                    {/* Min Business Vintage */}
                    <div>
                        <label htmlFor="minVintageMonths" className="block text-sm font-medium text-gray-300 mb-2">Min. Business Vintage (Months)</label>
                        <input
                            type="number"
                            id="minVintageMonths"
                            name="minVintageMonths"
                            value={formData.minVintageMonths}
                            onChange={handleChange}
                            required
                            min="1"
                            step="1"
                            className={`w-full px-4 py-2.5 bg-[#0f1116] border border-gray-700 rounded-lg focus:ring-[${NEON_BLUE}] focus:border-[${NEON_BLUE}] text-white transition-all`}
                        />
                    </div>

                    {/* Policy Status (Active/Inactive) */}
                    <div className="flex items-center justify-between p-4 bg-[#0f1116] border border-gray-700 rounded-lg">
                        <div>
                            <label htmlFor="isActive" className="block text-sm font-medium text-gray-300 mb-1">
                                Policy Status
                            </label>
                            <p className="text-xs text-gray-400">
                                {formData.isActive 
                                    ? 'Policy is active and visible to MSMEs' 
                                    : 'Policy is inactive and hidden from MSMEs'}
                            </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                id="isActive"
                                name="isActive"
                                checked={formData.isActive !== undefined ? formData.isActive : true}
                                onChange={handleChange}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#4da3ff] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4da3ff]"></div>
                            <span className="ml-3 text-sm font-medium text-gray-300">
                                {formData.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </label>
                    </div>
                    
                    {/* Modal Footer (Submit Button) */}
                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            // Neon CTA button style
                            className={`flex items-center space-x-2 bg-[${NEON_BLUE}] hover:bg-[#6fa8ff] text-white px-6 py-3 rounded-lg text-base font-semibold transition-all shadow-lg shadow-[${NEON_BLUE}]/40 active:scale-95`}
                            style={{ backgroundColor: NEON_BLUE }}
                        >
                            <Save size={18} />
                            <span>{isEditing ? 'Save Changes' : 'Create Policy'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


/**
 * Main Lender Policies Page
 */
export default function LenderPolicies() {
    const navigate = useNavigate();
    const [user] = useState(() => {
        const stored = localStorage.getItem('user');
        return stored ? JSON.parse(stored) : { name: 'HDFC Bank Team', branch: 'Mumbai-HQ', id: 'L101', customId: 'L101', role: 'lender' };
    });
    
    // Check if user is a lender
    useEffect(() => {
        if (user.role !== 'lender') {
            alert('This page is only accessible to lenders. Redirecting...');
            navigate('/');
        }
    }, [user.role, navigate]);
    
    const lenderId = user.customId || user.id || 'L101';
    const { policies, addPolicy, updatePolicy, deletePolicy, loading } = usePolicies(lenderId);
    const [isDarkMode] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [policyToEdit, setPolicyToEdit] = useState(null); 

    useEffect(() => {
        const root = window.document.documentElement;
        // Enforce dark mode and dark background
        root.classList.add('dark');
        root.classList.add('bg-[#0f1116]'); 
    }, []);


    const handleCreate = () => {
        setPolicyToEdit(null); // Clear any policy from previous edits
        setIsModalOpen(true);
    };

    const handleEdit = (policy) => {
        setPolicyToEdit(policy);
        setIsModalOpen(true);
    };

    const savePolicy = async (policyData) => {
        let success = false;
        let errorMessage = 'Failed to save policy. Please try again.';
        
        try {
            if (policyData._id) {
                success = await updatePolicy(policyData);
            } else {
                success = await addPolicy(policyData);
            }
            
            if (success) {
                setPolicyToEdit(null);
                setIsModalOpen(false);
            } else {
                alert(errorMessage);
            }
        } catch (error) {
            console.error('Error saving policy:', error);
            alert(errorMessage + '\nError: ' + error.message);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-[#0f1116] font-sans text-gray-100 selection:bg-[#4da3ff]/30">

            <LenderSidebar
                activeTab="policies" 
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
                    toggleTheme={() => {}} // Theme toggle disabled to fix theme
                    pageTitle="Lending Policy Management"
                />

                <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-white">Active Lending Policies ({policies.length})</h1>
                        <button
                            onClick={handleCreate}
                            // Neon CTA button style
                            className={`flex items-center space-x-2 bg-[${NEON_BLUE}] hover:bg-[#6fa8ff] text-white px-5 py-3 rounded-lg text-sm font-semibold transition-all shadow-md shadow-[${NEON_BLUE}]/40 active:scale-95`}
                            style={{ backgroundColor: NEON_BLUE }}
                        >
                            <Plus size={18} />
                            <span>New Policy</span>
                        </button>
                    </div>

                    {/* Policies List/Table Container */}
                    <div 
                        // Neon-styled container
                        className="bg-[#111217] rounded-xl shadow-lg border border-[#4da3ff]/50 shadow-[0_0_25px_#4da3ff]/40 overflow-hidden"
                    >
                        {loading ? (
                            <div className="text-center p-10 text-gray-500">
                                <p className="text-lg font-semibold text-white">Loading policies...</p>
                            </div>
                        ) : policies.length === 0 ? (
                            <div className="text-center p-10 text-gray-500">
                                <Zap size={48} className={`mx-auto mb-3 text-[${NEON_BLUE}]`} style={{ color: NEON_BLUE }} />
                                <p className="text-lg font-semibold text-white">No policies defined yet.</p>
                                <p className="text-sm mt-1 text-gray-400">Click "New Policy" to set your first automated lending criteria.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-700/50">
                                    <thead className="bg-[#1a1b23]"> {/* Slightly lighter dark background for header */}
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Policy Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Max Amount (Lakh ₹)</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Min. Score</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Interest Rate (%)</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Health</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700/50">
                                        {policies.map((policy) => (
                                            <tr key={policy._id} className="hover:bg-[#1a1b23]/50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-white">{policy.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{policy.maxAmount}</td>
                                                {/* Neon Blue accent for score */}
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm font-mono text-[${NEON_BLUE}]`} style={{ color: NEON_BLUE }}>{policy.minCreditScore}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{policy.interestRate?.toFixed(2) || policy.interestRate}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${policy.minFinancialHealth === 'Excellent' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border-amber-500/30'}`}>
                                                        {policy.minFinancialHealth}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${
                                                        policy.isActive !== false 
                                                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                                                            : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                                                    }`}>
                                                        {policy.isActive !== false ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                                    <button
                                                        onClick={() => handleEdit(policy)}
                                                        className={`text-[${NEON_BLUE}] hover:text-[#7abfff] transition-colors p-1 rounded-md hover:bg-[${NEON_BLUE}]/10`}
                                                        style={{ color: NEON_BLUE }}
                                                        aria-label="Edit policy"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={async () => {
                                                            if (window.confirm(`Are you sure you want to delete policy: ${policy.name}?`)) {
                                                                await deletePolicy(policy._id);
                                                            }
                                                        }}
                                                        className="text-rose-400 hover:text-rose-300 transition-colors p-1 rounded-md hover:bg-rose-600/10"
                                                        aria-label="Delete policy"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            <PolicyForm 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                policyToEdit={policyToEdit}
                savePolicy={savePolicy}
            />
        </div>
    );
}