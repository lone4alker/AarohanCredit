import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  Bell,
  CheckCircle,
  FileText,
  LayoutDashboard,
  LogOut,
  Wallet,
  Menu,
  Search, // Added for mobile toggle icon
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen, onLogout }) => {
  const navigate = useNavigate();

  const menuItems = [
    { id: 'home', label: 'Dashboard', icon: LayoutDashboard, path: '/msme-dashboard' },
    { id: 'search', label: 'Search for Loans', icon: Search, path: '/search-loans' },
    { id: 'loans', label: 'Loan Applications', icon: Wallet, path: '/loan-applications' },
    { id: 'approvals', label: 'Approvals & Offers', icon: CheckCircle, path: '/approvals' },
    { id: 'finhealth-analysis', label: 'FinHealth Analysis', icon: FileText, path: '/analysis' },
    { id: 'notifications', label: 'Notifications', icon: Bell, path: '/notifications' },
  ];

  const handleNavigation = (item) => {
    setActiveTab(item.id);
    setIsOpen(false);
    // Navigate to the corresponding path
    if (item.path) {
      navigate(item.path);
    }
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

      {/* Sidebar Container */}
      {/* Used the dark theme classes from your MsmeDashboard reference */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0a0d12] text-white/60 border-r border-[#00FF75]/10 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>

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
          <div className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4 px-4">Menu</div>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item)}
              className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${activeTab === item.id
                ? 'bg-[#00FF75]/20 text-white border border-[#00FF75]/30 shadow-[0_0_15px_#00ff75]/20'
                : 'hover:bg-[#00FF75]/10 text-white/60 hover:text-white hover:border border-[#00FF75]/20'
                }`}
            >
              <item.icon size={20} className={`${activeTab === item.id ? 'text-[#00FF75]' : 'text-white/40 group-hover:text-[#00FF75]'} transition-colors`} />
              <span className="font-medium text-sm">{item.label}</span>
              {item.id === 'notifications' && (
                <span className="ml-auto w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">3</span>
              )}
            </button>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="absolute bottom-0 w-full p-4 border-t border-[#00FF75]/10 bg-[#0a0d12]">
          <button
            onClick={onLogout}
            className="flex items-center space-x-3 text-white/60 hover:text-red-400 hover:bg-red-400/10 px-4 py-3 rounded-xl transition-all w-full border border-transparent hover:border-red-400/20"
          >
            <LogOut size={20} />
            <span className="font-medium text-sm">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;