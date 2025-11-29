// src/pages/LenderNotifications.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LenderSidebar from '../components/Lender/LenderSidebar'; 
import Header from '../components/Header';
// FIX: Added 'X' to the imports to resolve 'ReferenceError: X is not defined'
import { Bell, Zap, Clock, FileWarning, CheckCircle, TrendingUp, X } from 'lucide-react'; 

// Neon Blue Accent Color
const NEON_BLUE = '#4da3ff';

// --- Sample Data: Lender Notifications ---
const NOTIFICATIONS = [
    {
        id: 1,
        type: 'High Risk Alert',
        message: 'MSME "City Hardware" triggered a High Risk flag (Score 610). Review required before approval.',
        icon: FileWarning,
        iconColor: 'text-rose-400',
        borderColor: 'border-rose-500/30',
        time: '5 min ago',
    },
    {
        id: 2,
        type: 'Policy Match',
        message: 'New application from "Vedant Empires" perfectly matches the "Prime Enterprise Policy" (Score 780).',
        icon: CheckCircle,
        iconColor: 'text-emerald-400',
        borderColor: 'border-emerald-500/30',
        time: '3 hours ago',
    },
    {
        id: 3,
        type: 'Application Update',
        message: 'Application CRD780 status changed to "Pending Data" after 48 hours of review.',
        icon: Clock,
        iconColor: 'text-yellow-400',
        borderColor: 'border-yellow-500/30',
        time: 'Yesterday',
    },
    {
        id: 4,
        type: 'System Alert',
        message: 'AI Model v3.1 successfully deployed. Improved risk prediction accuracy by 1.2%.',
        icon: Zap,
        iconColor: `text-[${NEON_BLUE}]`,
        borderColor: `border-[${NEON_BLUE}]/30`,
        time: '2 days ago',
    },
    {
        id: 5,
        type: 'Financial Health Update',
        message: 'Financial Health Agent completed analysis for 15 pending applications.',
        icon: TrendingUp,
        iconColor: 'text-lime-400',
        borderColor: 'border-lime-500/30',
        time: '3 days ago',
    },
];

/**
 * Notification Item Component
 */
const NotificationItem = ({ type, message, time, icon: Icon, iconColor, borderColor }) => (
    <div 
        className={`flex items-start p-5 rounded-xl border ${borderColor} bg-[#111217] transition-all duration-300 hover:shadow-[0_0_15px_#4da3ff]/20 cursor-pointer`}
    >
        <div className={`mr-4 pt-1 ${iconColor}`}>
            <Icon size={24} />
        </div>
        <div className="flex-1">
            <p className="text-lg font-semibold text-white">{type}</p>
            <p className="text-gray-300 mt-1">{message}</p>
        </div>
        <span className="text-xs text-gray-500 ml-4 whitespace-nowrap">{time}</span>
    </div>
);


/**
 * Main Lender Notifications Page
 */
export default function LenderNotifications() {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [user] = useState({ name: 'HDFC Bank Team', branch: 'Mumbai-HQ' }); 
    const [isDarkMode] = useState(true);

    useEffect(() => {
        // Enforce dark mode and dark background for theme consistency
        document.documentElement.classList.add('dark', 'bg-[#0f1116]');
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-[#0f1116] font-sans text-gray-100 selection:bg-[#4da3ff]/30">

            <LenderSidebar
                activeTab="notifications" 
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
                    pageTitle="Real-time Notifications"
                />

                <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                    
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-white flex items-center">
                            <Bell size={28} className={`mr-3 text-[${NEON_BLUE}]`} style={{ color: NEON_BLUE }} />
                            Your Alert Feed
                        </h1>
                        <button
                            // Clear all button styled to match the theme
                            className={`flex items-center space-x-2 text-gray-400 hover:text-white px-3 py-2 rounded-lg text-sm transition-all border border-gray-700 hover:border-[${NEON_BLUE}]/50`}
                            onClick={() => alert("Cleared all notifications (simulation)")}
                        >
                            <X size={16} /> {/* X is now correctly imported and used */}
                            <span>Mark All Read</span>
                        </button>
                    </div>

                    {/* --- Notification List Container (Neon Styled) --- */}
                    <div className="space-y-4">
                        
                        {NOTIFICATIONS.length > 0 ? (
                            NOTIFICATIONS.map(notification => (
                                <NotificationItem 
                                    key={notification.id}
                                    type={notification.type}
                                    message={notification.message}
                                    time={notification.time}
                                    icon={notification.icon}
                                    // Use style prop for NEON_BLUE if necessary for dynamic Tailwind classes, but iconColor property is mostly text-utility classes which are fine
                                    iconColor={notification.iconColor} 
                                    borderColor={notification.borderColor}
                                />
                            ))
                        ) : (
                            <div className="text-center p-10 bg-[#111217] rounded-xl border border-gray-700">
                                <Bell size={48} className="mx-auto text-gray-600 mb-3" />
                                <p className="text-lg font-semibold text-gray-300">No new alerts.</p>
                                <p className="text-sm mt-1 text-gray-500">Your lending pipeline is clear.</p>
                            </div>
                        )}
                    </div>

                </main>
            </div>
        </div>
    );
}