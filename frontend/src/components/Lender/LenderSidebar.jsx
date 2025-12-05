// src/components/Lender/LenderSidebar.jsx

import React from 'react';
import {
    Activity,
    Bell,
    Wallet,
    LayoutDashboard,
    LogOut,
    FileText,
    Settings,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LenderSidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen, onLogout }) => {
    const navigate = useNavigate();

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, route: '/lender-dashboard' },
        { id: 'loans', label: 'Loan Applications', icon: Wallet, route: '/lender-loans' },
        { id: 'policies', label: 'Lending Policies', icon: Settings, route: '/lender-policies' },
        { id: 'reports', label: 'Detailed Reports', icon: FileText, route: '/lender-reports' },
        { id: 'notifications', label: 'Notifications', icon: Bell, route: '/lender-notifications' },
    ];

    const handleNavigation = (item) => {
        navigate(item.route);
        if (setActiveTab) setActiveTab(item.id);
        setIsOpen(false);
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 
                bg-[#0a0d12] text-white/60 
                border-r border-[#4da3ff]/20
                transition-transform duration-300 ease-in-out 
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
            >

                {/* Logo Section */}
                <div className="h-20 flex items-center px-6 border-b border-[#4da3ff]/20">
                    <div className="w-10 h-10 rounded-lg 
                        bg-gradient-to-br from-[#4da3ff] to-[#82c0ff]
                        flex items-center justify-center mr-3 
                        shadow-[0_0_15px_#4da3ff]">
                        <Activity className="text-[#0a0d12] w-6 h-6" />
                    </div>
                    <span className="text-xl font-bold text-white tracking-tight">
                        Aarohan Credit
                    </span>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-2 mt-4">
                    <div className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4 px-4">
                        Menu
                    </div>

                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleNavigation(item)}
                            className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl
                                transition-all duration-200 group
                                ${activeTab === item.id
                                    ? 'bg-[#4da3ff]/25 text-white border border-[#4da3ff]/40 shadow-[0_0_15px_#4da3ff]/40'
                                    : 'hover:bg-[#4da3ff]/15 text-white/60 hover:text-white hover:border border-[#4da3ff]/30'
                                }`}
                        >
                            <item.icon
                                size={20}
                                className={`${activeTab === item.id
                                        ? 'text-[#4da3ff]'
                                        : 'text-white/40 group-hover:text-[#4da3ff]'
                                    } transition-colors`}
                            />

                            <span className="font-medium text-sm">{item.label}</span>

                            {item.id === 'notifications' && (
                                <span className="ml-auto w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                    12
                                </span>
                            )}
                        </button>
                    ))}
                </nav>

                {/* Sign Out */}
                <div className="absolute bottom-0 w-full p-4 border-t border-[#4da3ff]/20 bg-[#0a0d12]">
                    <button
                        onClick={onLogout}
                        className="flex items-center space-x-3 text-white/60 
                                hover:text-red-400 hover:bg-red-400/10 
                                px-4 py-3 rounded-xl transition-all w-full 
                                border border-transparent hover:border-red-400/20"
                    >
                        <LogOut size={20} />
                        <span className="font-medium text-sm">Sign Out</span>
                    </button>
                </div>

            </aside>
        </>
    );
};

export default LenderSidebar;
