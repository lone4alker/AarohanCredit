import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Home from '../pages/Home';
import SearchLoans from '../pages/SearchLoans';
import LoanApplications from '../pages/LoanApplications';
import Approvals from '../pages/Approvals';
import FinHealthAnalysis from '../pages/FinHealthAnalysis';
import Notifications from '../pages/Notifications';
import { Activity } from 'lucide-react';

export default function MsmeDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  // Initialize theme from localStorage or default to true (dark)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : true;
  });

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
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleSync = () => {
    setIsSyncing(true);
  };

  const handleAnalysisComplete = () => {
    setIsSyncing(false);
    setAnalysisComplete(prev => !prev); // Toggle to trigger re-fetch
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  }

  const ROUTE_TO_TAB = {
    '/msme-dashboard': 'home',
    '/search-loans': 'search',
    '/loan-applications': 'loans',
    '/approvals': 'approvals',
    '/analysis': 'finhealth-analysis',
    '/reports': 'reports',
    '/notifications': 'notifications',
  };

  useEffect(() => {
    const nextTab = ROUTE_TO_TAB[location.pathname] || 'home';
    setActiveTab(nextTab);
  }, [location.pathname]);

  const PAGE_TITLES = {
    home: 'Financial Health',
    search: 'Search Lenders',
    loans: 'Loan Applications',
    approvals: 'Approved Offers',
    reports: 'Detailed Reports',
    notifications: 'Notifications',
    'finhealth-analysis': 'Health Analysis Agent',
  };

  const msmeId = user?.msme_id || user?.id || 'MSME002';

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home isDarkMode={isDarkMode} analysisComplete={analysisComplete} />;
      case 'search':
        return <SearchLoans />;
      case 'loans':
        return <LoanApplications />;
      case 'approvals':
        return <Approvals />;
      case 'finhealth-analysis':
        return <FinHealthAnalysis msmeId={msmeId} />;
      // case 'reports':
      //   return <Reports isDarkMode={isDarkMode} />;
      case 'notifications':
        return <Notifications />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-white/60">
            <div className="w-16 h-16 bg-[#151920] rounded-2xl flex items-center justify-center mb-4 border border-[#00FF75]/20">
              <Activity size={32} className="text-[#00FF75]" />
            </div>
            <h2 className="text-xl font-semibold text-white capitalize">{activeTab} Module</h2>
            <p className="text-sm mt-2 text-white/40">Connecting to backend services...</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0d12] font-sans text-white">
      {/* Subtle grid overlay */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,255,117,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,117,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      />

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
          onAnalysisComplete={handleAnalysisComplete}
          isSyncing={isSyncing}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
          showSync={activeTab === 'home'}
          pageTitle={PAGE_TITLES[activeTab] || 'Dashboard Overview'}
        />

        {/* 3. Page Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto relative z-10">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}