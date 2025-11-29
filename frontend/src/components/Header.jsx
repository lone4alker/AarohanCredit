// src/components/Header.jsx

import React, { useState, Fragment } from 'react';
// Assuming 'pfp1' path is correct and 'SyncModal' component exists
import pfp1 from "../assets/pfp1.jpg";
import {
    Menu,
    Sun,
    Moon,
    Globe,
    RefreshCw,
} from 'lucide-react';
import SyncModal from './sync-modal'; // Placeholder for the actual modal component

/**
 * Header Component
 * Displays navigation controls, theme toggle, sync button (for MSME), and user profile.
 * * @param {object} user - User object with name, gstin/branch.
 * @param {boolean} isSyncing - State of data syncing.
 * @param {function} toggleSidebar - Function to open/close the mobile sidebar.
 * @param {boolean} isDarkMode - Current theme state.
 * @param {function} toggleTheme - Function to switch between light/dark mode.
 * @param {boolean} showSync - Controls visibility of the Sync Data button (true for MSME).
 * @param {function} onSync - Function to handle the data synchronization process.
 * @param {string} pageTitle - The main heading for the current page.
 */
const Header = ({ user, isSyncing, toggleSidebar, isDarkMode, toggleTheme, showSync = false, onSync, pageTitle }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    const handleSyncClick = () => {
        setIsModalOpen(true);
        // Execute the parent's onSync prop if provided
        if (onSync) {
            onSync();
        }
    };

    const handleClose = () => {
        setIsModalOpen(false);
    };

    const handleComplete = () => {
        // Placeholder for completion logic
    };

    return (
        <Fragment>
            <header className="h-20 bg-[#0a0d12]/95 backdrop-blur-xl border-b border-[#00FF75]/10 sticky top-0 z-30 px-4 lg:px-8 flex items-center justify-between">

                {/* Left: Mobile Toggle & Title */}
                <div className="flex items-center">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 -ml-2 mr-2 text-white/60 hover:text-white lg:hidden"
                        aria-label="Toggle menu"
                    >
                        <Menu size={24} />
                    </button>
                    {/* Display the custom pageTitle or default to "Dashboard Overview" */}
                    <h2 className="text-xl font-semibold text-white hidden sm:block">
                        {pageTitle || "Dashboard Overview"}
                    </h2>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center space-x-4 lg:space-x-6">

                    {/* SYNC BUTTON - Only show if 'showSync' is true (e.g., for MSME) */}
                    {showSync && (
                        <div className="flex flex-col items-end mr-2">
                            <button
                                onClick={handleSyncClick}
                                disabled={isSyncing}
                                className="flex items-center space-x-2 bg-[#00FF75] hover:bg-[#0DF86A] text-[#0a0d12] px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-[0_0_20px_#00ff75] hover:shadow-[0_0_30px_#00ff75] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                <RefreshCw size={16} className={isSyncing ? 'animate-spin' : ''} />
                                <span>{isSyncing ? 'Syncing...' : 'Sync Data'}</span>
                            </button>
                            <span className="text-[10px] text-white/40 mt-1.5 font-mono">Last: Today 10:42 AM</span>
                        </div>
                    )}

                    {/* Translation Button */}
                    <button
                        className="p-2 rounded-lg bg-[#151920] border border-[#00FF75]/20 text-white/60 hover:text-white hover:border-[#00FF75]/40 transition-colors"
                        aria-label="Translate"
                    >
                        <Globe size={18} />
                    </button>

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-lg bg-[#151920] border border-[#00FF75]/20 text-white/60 hover:text-white hover:border-[#00FF75]/40 transition-colors"
                        aria-label="Toggle color mode"
                    >
                        {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                    </button>

                    <div className="h-8 w-px bg-[#00FF75]/20 hidden sm:block"></div>

                    {/* Profile */}
                    <div className="relative group">
                        <button
                            className="flex items-center space-x-3 focus:outline-none"
                            onClick={() => setIsPopoverOpen(!isPopoverOpen)}
                            onBlur={() => setTimeout(() => setIsPopoverOpen(false), 200)}
                        >
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-semibold text-white">{user?.name || 'Guest'}</p>
                                {/* Displaying 'role' (e.g., Bank Team) for Lender, 'customId' for MSME */}
                                <p className="text-xs text-white/40 font-mono tracking-wide">{user?.customId || user?.branch || 'N/A'}</p>
                            </div>

                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#00FF75] to-[#0DF86A] p-[2px] shadow-[0_0_10px_#00ff75]">
                                <div className="w-full h-full rounded-full bg-[#0a0d12] flex items-center justify-center">
                                    <img src={pfp1} alt="Profile" className="w-full h-full rounded-full object-cover opacity-80" />
                                </div>
                            </div>
                        </button>

                        {/* Profile Popover */}
                        {isPopoverOpen && (
                            <div className="absolute right-0 top-14 w-72 bg-[#151920] border border-[#00FF75]/20 rounded-xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-200">
                                <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-[#00FF75]/10">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#00FF75] to-[#0DF86A] p-[2px]">
                                        <img src={pfp1} alt="Profile" className="w-full h-full rounded-full object-cover" />
                                    </div>
                                    <div>
                                        <p className="text-white font-semibold">{user?.name || 'Guest'}</p>
                                        <p className="text-xs text-[#00FF75] font-mono">{user?.customId || 'N/A'}</p>
                                    </div>
                                </div>

                                <div className="space-y-3 text-sm">
                                    <div>
                                        <p className="text-white/40 text-xs mb-0.5">Email</p>
                                        <p className="text-white truncate">{user?.email || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-white/40 text-xs mb-0.5">Phone</p>
                                        <p className="text-white">{user?.phone || 'N/A'}</p>
                                    </div>
                                    {user?.gstin && (
                                        <div>
                                            <p className="text-white/40 text-xs mb-0.5">GSTIN</p>
                                            <p className="text-white font-mono">{user.gstin}</p>
                                        </div>
                                    )}
                                    {user?.address && (
                                        <div>
                                            <p className="text-white/40 text-xs mb-0.5">Address</p>
                                            <p className="text-white text-xs leading-relaxed">
                                                {user.address.street}, {user.address.city}, {user.address.state} - {user.address.pincode}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>
            {/* SyncModal is only shown when showSync is true and Sync button is clicked */}
            {showSync && <SyncModal isOpen={isModalOpen} onClose={handleClose} onComplete={handleComplete} />}
        </Fragment>
    );
};

export default Header;