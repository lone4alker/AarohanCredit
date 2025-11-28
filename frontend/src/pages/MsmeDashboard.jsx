import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Home from '../pages/Home';
import Reports from '../pages/Reports';
import { Activity } from 'lucide-react';

export default function MsmeDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [user, setUser] = useState({ name: 'Guest', gstin: 'N/A' });

  useEffect(() => {
    // Load user from local storage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

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

  const handleSync = () => {
    setIsSyncing(true);
    // Simulate API call
    setTimeout(() => setIsSyncing(false), 2000);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#111217] font-sans selection:bg-indigo-500/30 text-gray-800 dark:text-gray-100">

      {/* 1. Sidebar Component */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        onLogout={handleLogout}
      />

      {/* Main Content Wrapper */}
      <div className="lg:ml-64 min-h-screen flex flex-col">

        {/* 2. Header Component (Includes Sync Button) */}
        <Header
          user={user}
          onSync={handleSync}
          isSyncing={isSyncing}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
        />

        {/* 3. Page Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {activeTab === 'home' && <Home isDarkMode={isDarkMode} />}
          {activeTab === 'reports' && <Reports isDarkMode={isDarkMode} />}
          {/* Placeholders for other routes */}
          {activeTab !== 'home' && activeTab !== 'reports' && (
            <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
              <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mb-4 border border-gray-700">
                <Activity size={32} />
              </div>
              <h2 className="text-xl font-semibold text-gray-300 capitalize">{activeTab} Module</h2>
              <p className="text-sm mt-2">Connecting to backend services...</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}