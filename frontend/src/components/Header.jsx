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
            <header className="h-20 bg-white/80 dark:bg-[#1a1b23]/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30 px-4 lg:px-8 flex items-center justify-between">

                {/* Left: Mobile Toggle & Title */}
                <div className="flex items-center">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 -ml-2 mr-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white lg:hidden"
                        aria-label="Toggle menu"
                    >
                        <Menu size={24} />
                    </button>
                    {/* Display the custom pageTitle or default to "Dashboard Overview" */}
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white hidden sm:block">
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
                                className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-indigo-500/30 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                <RefreshCw size={16} className={isSyncing ? 'animate-spin' : ''} />
                                <span>{isSyncing ? 'Syncing...' : 'Sync Data'}</span>
                            </button>
                            <span className="text-[10px] text-gray-500 mt-1.5 font-mono">Last: Today 10:42 AM</span>
                        </div>
                    )}
                    
                    {/* Translation Button */}
                    <button
                        className="p-2 rounded-lg bg-gray-200/60 dark:bg-gray-800/60 border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-300/70 dark:hover:bg-gray-700 transition-colors"
                        aria-label="Translate"
                    >
                        <Globe size={18} />
                    </button>

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-lg bg-gray-200/60 dark:bg-gray-800/60 border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-300/70 dark:hover:bg-gray-700 transition-colors"
                        aria-label="Toggle color mode"
                    >
                        {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                    </button>

                    <div className="h-8 w-px bg-gray-300 dark:bg-gray-700 hidden sm:block"></div>

                    {/* Profile */}
                    <div className="flex items-center space-x-3">
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-semibold text-gray-800 dark:text-white">{user?.name || 'Guest'}</p>
                            {/* Displaying 'role' (e.g., Bank Team) for Lender, 'gstin' for MSME */}
                            <p className="text-xs text-gray-500 font-mono tracking-wide">{user?.gstin || user?.branch || 'N/A'}</p>
                        </div>

                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 p-[2px]">
                            <div className="w-full h-full rounded-full bg-white dark:bg-[#1a1b23] flex items-center justify-center">
                                {/* Note: Ensure 'pfp1' asset is correctly linked */}
                                <img src={pfp1} alt="Profile" className="w-full h-full rounded-full object-cover opacity-80" />
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            {/* SyncModal is only shown when showSync is true and Sync button is clicked */}
            {showSync && <SyncModal isOpen={isModalOpen} onClose={handleClose} onComplete={handleComplete} />}
        </Fragment>
    );
};

export default Header;