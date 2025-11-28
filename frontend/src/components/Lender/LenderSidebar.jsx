import {
  Activity,
  Bell,
  Wallet,
  LayoutDashboard,
  LogOut,
  FileText,
} from 'lucide-react';

const LenderSidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
  // Lender-specific menu items
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }, // Changed from 'home' to 'dashboard' for consistency
    { id: 'applications', label: 'Loan Applications', icon: Wallet },
    { id: 'reports', label: 'Detailed Reports', icon: FileText },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

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
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-[#1a1b23] text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-800 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        
        {/* Logo Section */}
        <div className="h-20 flex items-center px-6 border-b border-gray-200 dark:border-gray-800">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
            <Activity className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-gray-800 dark:text-white tracking-tight">CrediFlow</span>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 mt-4">
          <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 px-4">Menu</div>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                activeTab === item.id
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white shadow-lg shadow-black/5 dark:shadow-black/20'
                  : 'hover:bg-gray-100/50 dark:hover:bg-gray-800/50 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <item.icon size={20} className={`${activeTab === item.id ? 'text-indigo-500 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-400'} transition-colors`} />
              <span className="font-medium text-sm">{item.label}</span>
              {item.id === 'notifications' && (
                // Hardcoded notification count for example
                <span className="ml-auto w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">12</span>
              )}
            </button>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1b23]">
          <button className="flex items-center space-x-3 text-gray-600 dark:text-gray-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 px-4 py-3 rounded-xl transition-all w-full">
            <LogOut size={20} />
            <span className="font-medium text-sm">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default LenderSidebar;