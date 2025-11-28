import React from 'react';
import { Briefcase, Zap, Shield, TrendingUp, Search } from 'lucide-react';
import Sidebar from '../components/Sidebar'; // Assuming the path is correct
import Header from '../components/Header'; // <-- IMPORT THE NEW HEADER
import { useNavigate } from 'react-router-dom';

// --- Mock Data based on Policy Matching Agent's Output ---
const MSME_PROFILE = {
  creditScore: 780,
  financialHealth: 'Good Standing',
  maxEligibleAmount: 1500000, // ₹15.0 L
  recommendationNote: 'Strong cash flow and low monthly burn rate qualifies you for Prime-tier loans.',
};

const LOAN_OFFERS = [
  {
    id: 1,
    bank: 'Apex Bank',
    product: 'MSME Prime Capital',
    maxAmount: '₹15.0 L',
    interestRate: '9.5%',
    tenure: '36 Months',
    policyCriteria: 'Score > 750, Monthly Burn < ₹9 L',
    status: 'High Match',
    color: 'bg-indigo-600',
  },
  {
    id: 2,
    bank: 'FinServe NBFC',
    product: 'Digital Growth Loan',
    maxAmount: '₹12.0 L',
    interestRate: '10.2%',
    tenure: '24 Months',
    policyCriteria: 'Score > 700, Min Revenue ₹10 L',
    status: 'Good Match',
    color: 'bg-green-600',
  },
  {
    id: 3,
    bank: 'Regional Credit Union',
    product: 'Working Capital Boost',
    maxAmount: '₹8.0 L',
    interestRate: '11.8%',
    tenure: '48 Months',
    policyCriteria: 'Any Score, GST Filing History > 12 Months',
    status: 'Available',
    color: 'bg-yellow-600',
  },
];


/**
 * 1. MSME Health Card - Updated for dark theme
 */
const HealthCard = ({ profile }) => (
  // Updated dark background and border
  <div className="bg-[#1e1f29] p-6 rounded-2xl shadow-xl border border-gray-700/50">
    <div className="flex items-center space-x-3 mb-4">
      <Zap className="text-indigo-400 w-6 h-6" />
      <h3 className="text-lg font-semibold text-gray-100">Your Current Eligibility Snapshot</h3>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-3xl font-bold text-indigo-400">
          {profile.creditScore}
        </p>
        <p className="text-sm text-gray-400">CrediFlow Score</p>
      </div>
      <div>
        <p className="text-3xl font-bold text-green-400">
          {/* Format as Indian Rupees (Lakhs) */}
          {profile.maxEligibleAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
        </p>
        <p className="text-sm text-gray-400">Maximum Eligible Amount</p>
      </div>
    </div>
    <div className="mt-4 p-3 bg-gray-700/50 rounded-lg">
      <p className="text-sm italic text-gray-300">
        <span className="font-medium text-indigo-300">Agent Note:</span> {profile.recommendationNote}
      </p>
    </div>
  </div>
);

/**
 * 2. Loan Offer Card - Updated for dark theme
 */
const OfferCard = ({ offer }) => (
  // Updated dark background and hover effect
  <div className="bg-[#1e1f29] p-6 rounded-2xl shadow-lg hover:shadow-indigo-500/30 transition-shadow border border-gray-700/50 flex flex-col justify-between">
    <div>
      <div className="flex justify-between items-start mb-4">
        <h4 className="text-xl font-bold text-gray-50">{offer.bank}</h4>
        <span className={`text-xs font-medium px-3 py-1 rounded-full text-white ${offer.color}`}>
          {offer.status}
        </span>
      </div>
      <p className="text-2xl font-extrabold text-indigo-400 mb-4">{offer.product}</p>

      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-2 text-center my-4">
        {/* Updated metric background */}
        <div className="p-2 bg-gray-800/50 rounded-lg">
          <p className="text-sm font-semibold text-gray-200">{offer.maxAmount}</p>
          <p className="text-xs text-gray-400">Max Loan</p>
        </div>
        <div className="p-2 bg-gray-800/50 rounded-lg">
          <p className="text-sm font-semibold text-gray-200">{offer.interestRate}</p>
          <p className="text-xs text-gray-400">Interest</p>
        </div>
        <div className="p-2 bg-gray-800/50 rounded-lg">
          <p className="text-sm font-semibold text-gray-200">{offer.tenure}</p>
          <p className="text-xs text-gray-400">Tenure</p>
        </div>
      </div>

      {/* Policy Match Transparency */}
      <div className="mt-4 pt-3 border-t border-gray-700">
        <p className="text-xs font-semibold text-gray-300 mb-1 flex items-center">
          <Shield className="w-3 h-3 mr-1 text-green-400" /> Policy Match Criteria:
        </p>
        <p className="text-sm text-gray-400 italic">{offer.policyCriteria}</p>
      </div>
    </div>

    {/* Updated button style */}
    <button className="mt-6 w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-semibold transition duration-150 shadow-md shadow-indigo-500/50">
      View Details & Apply
    </button>
  </div>
);

/**
 * Main Loan Applications Component, integrated with layout.
 */
export default function LoanApplications() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [activeTab, setActiveTab] = React.useState('loans');
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [isDarkMode, setIsDarkMode] = React.useState(true); // Default to dark mode for UI consistency

  // Mock user and theme state
  const user = { name: 'MSME', gstin: '27ABCDE1234F' };

  const handleLogout = () => {
    navigate('/');
  };

  const handleSync = () => {
    setIsSyncing(true);
    // Simulate API call
    setTimeout(() => setIsSyncing(false), 2000);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // Logic to update the 'dark' class on the HTML root element
    const root = window.document.documentElement;
    if (!isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };


  const filteredOffers = LOAN_OFFERS.filter(offer =>
    offer.bank.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offer.product.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    // Set dark mode class globally for the app wrapper
    <div className={`min-h-screen font-sans ${isDarkMode ? 'dark bg-[#111217] text-gray-100' : 'bg-gray-100 text-gray-800'}`}>

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

        {/* 2. Header Component (Now imported and used) */}
        <Header
          user={user}
          isSyncing={isSyncing}
          onSync={handleSync}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
          showSync={true} // MSME dashboard usually has a sync button
          pageTitle="Credit Marketplace" // Custom prop to handle the title
        />

        {/* 3. Page Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <div className="space-y-8">
            
            {/* Title Block - Removed the h1 here since the Header handles the main title */}
            <div className="hidden">
              <TrendingUp className="text-indigo-500 w-8 h-8" />
              <h1 className="text-3xl font-extrabold text-gray-100">
                Your Credit Marketplace
              </h1>
            </div>

            {/* Top Section: Health & Summary */}
            <HealthCard profile={MSME_PROFILE} />
            
            {/* Search Bar */}
            <div className="flex items-center bg-[#1e1f29] p-3 rounded-xl border border-gray-700/50 shadow-lg">
              <Search className="text-gray-400 w-5 h-5 mr-3" />
              <input
                type="text"
                placeholder="Search offers by Bank or Product name..."
                className="flex-grow bg-transparent text-gray-100 placeholder-gray-500 focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Loan Offers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredOffers.length > 0 ? (
                filteredOffers.map((offer) => (
                  <OfferCard key={offer.id} offer={offer} />
                ))
              ) : (
                <div className="md:col-span-2 xl:col-span-3 text-center py-10 bg-[#1e1f29] rounded-2xl border border-gray-700/50">
                  <Briefcase className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-lg font-semibold text-gray-300">No matching offers found.</p>
                  <p className="text-sm text-gray-400">Try adjusting your search or check back later.</p>
                </div>
              )}
            </div>
            
            {/* Call to Action/Information Block */}
            <div className="p-5 bg-indigo-900/40 rounded-xl border border-indigo-500/50 text-indigo-200">
                <p className="text-sm font-medium">💡 Transparency Note:</p>
                <p className="text-xs mt-1">
                    All offers are dynamically matched by our **Policy Matching Agent** based on your real-time financial health. Click 'View Details' to see the full Bank/NBFC policy criteria (Interest, collateral, tenure, etc.) before applying.
                </p>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}