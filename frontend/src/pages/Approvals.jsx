import React from 'react';
import {
    Briefcase,
    Zap,
    Shield,
    CheckCircle,
    Clock,
    DollarSign,
    Target,
    Activity,
    Users,
    XCircle,
    ArrowRight,
    Search,
} from 'lucide-react';
import Sidebar from '../components/Sidebar'; // Assuming existence
import Header from '../components/Header'; // Assuming existence
import { useNavigate } from 'react-router-dom'; // Assuming react-router-dom

// --- MOCK DATA ---
const MSME_PROFILE = {
    creditScore: 780,
    financialHealth: 'Good Standing',
    recommendationNote:
        'Strong cash flow and low monthly burn rate qualifies you for Prime-tier loans.',
};

const APPLICATION_STATUS = [
    {
        id: 'APP001',
        bank: 'Apex Bank',
        product: 'MSME Prime Capital',
        requestedAmount: '₹15.0 L',
        dateApplied: '2025-11-15',
        status: 'Approved', // KEY STATUS
        statusColor: 'bg-[#00ff75]',
        details: 'Approved for the full requested amount based on High Match score.',
    },
    {
        id: 'APP002',
        bank: 'FinServe NBFC',
        product: 'Digital Growth Loan',
        requestedAmount: '₹12.0 L',
        dateApplied: '2025-11-14',
        status: 'Counter Offer', // KEY STATUS
        statusColor: 'bg-yellow-500',
        details: 'Counter-offer provided. Check the "Counter Offers" section below for details.',
    },
    {
        id: 'APP003',
        bank: 'HDFC Bank',
        product: 'Business Term Loan',
        requestedAmount: '₹20.0 L',
        dateApplied: '2025-11-10',
        status: 'Pending Review', // KEY STATUS
        statusColor: 'bg-blue-500',
        details: 'Application is currently under final review by the underwriting team.',
    },
    {
        id: 'APP004',
        bank: 'Regional Credit Union',
        product: 'Working Capital Boost',
        requestedAmount: '₹8.0 L',
        dateApplied: '2025-11-05',
        status: 'Rejected', // KEY STATUS
        statusColor: 'bg-red-500',
        details: 'Rejected: Maximum monthly outflow exceeded policy limit for this product.',
    },
];

const COUNTER_OFFERS = [
    {
        id: 101,
        applicationId: 'APP002',
        originalProduct: 'Digital Growth Loan (Requested)',
        lender: 'FinServe NBFC',
        counterProduct: 'Mid-Tier Capital Assist',
        offeredAmount: '₹10.0 L', // Less than requested
        interestRate: '10.5%', // Slightly higher
        tenure: '30 Months',
        reason: 'Adjusted due to recent volatility in cash flow stability score.',
    },
    {
        id: 102,
        applicationId: 'APP005', // hypothetical new application
        originalProduct: 'Working Capital Loan',
        lender: 'ICICI Bank',
        counterProduct: 'Flexi-Pay Overdraft',
        offeredAmount: '₹7.0 L (Overdraft Limit)',
        interestRate: '12.0%',
        tenure: '12 Months (Renewable)',
        reason: 'Recommended lower risk product based on current low operational cash reserves.',
    },
];

// -------------------------------------------------------------------
// 1. Health Card (Re-used for context)
// -------------------------------------------------------------------
const HealthCard = ({ profile }) => (
    <div className="bg-[#1e1f29] p-6 rounded-2xl shadow-xl border border-[#00ff75]/30">
        <div className="flex items-center space-x-3 mb-4">
            <Zap className="text-[#00ff75] w-6 h-6" />
            <h3 className="text-lg font-semibold text-gray-100">
                Your Current Credit Snapshot
            </h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
                <p className="text-3xl font-bold text-[#00ff75]">{profile.creditScore}</p>
                <p className="text-sm text-gray-400">CrediFlow Score</p>
            </div>

            <div className="text-right">
                <p className="text-sm font-semibold text-green-400 mt-2">
                    {profile.financialHealth}
                </p>
                <p className="text-xs text-gray-400">Financial Health</p>
            </div>
        </div>

        <div className="mt-4 p-3 bg-gray-800/40 rounded-lg border border-[#00ff75]/20">
            <p className="text-sm italic text-gray-300">
                <span className="font-medium text-[#00ff75]">Guidance Agent:</span>{' '}
                {profile.recommendationNote}
            </p>
        </div>
    </div>
);

// -------------------------------------------------------------------
// 2. Application Status Card
// -------------------------------------------------------------------
const StatusIcon = ({ status }) => {
    switch (status) {
        case 'Approved':
            return <CheckCircle className="w-6 h-6 text-[#00ff75]" />;
        case 'Pending Review':
            return <Clock className="w-6 h-6 text-blue-400" />;
        case 'Counter Offer':
            return <DollarSign className="w-6 h-6 text-yellow-500" />;
        case 'Rejected':
            return <XCircle className="w-6 h-6 text-red-500" />;
        default:
            return <Activity className="w-6 h-6 text-gray-400" />;
    }
};

const ApplicationStatusCard = ({ app }) => (
    <div className="bg-[#1e1f29] p-5 rounded-xl shadow-lg border border-gray-700 hover:border-[#00ff75]/50 transition-all flex justify-between items-center">
        <div className="flex items-center space-x-4">
            <StatusIcon status={app.status} />
            <div>
                <p className="text-lg font-semibold text-gray-50">{app.bank}</p>
                <p className="text-sm text-gray-400">{app.product}</p>
            </div>
        </div>

        <div className="flex-1 min-w-0 mx-6 hidden md:block">
            <p className="text-sm text-gray-300 truncate">{app.details}</p>
            <p className="text-xs text-gray-500 mt-1">Applied: {app.dateApplied}</p>
        </div>

        <div className="text-right flex flex-col items-end">
            <span
                className={`text-xs font-bold px-3 py-1 rounded-full text-black ${app.statusColor}`}
            >
                {app.status}
            </span>
            <p className="text-sm font-medium text-gray-300 mt-2">{app.requestedAmount}</p>
        </div>

        <button className="ml-4 p-2 rounded-full hover:bg-gray-700/50 transition hidden sm:block">
            <ArrowRight className="w-5 h-5 text-[#00ff75]" />
        </button>
    </div>
);

// -------------------------------------------------------------------
// 3. Counter Offer Card
// -------------------------------------------------------------------
const CounterOfferCard = ({ offer }) => (
    <div className="bg-[#1e1f29] p-6 rounded-2xl shadow-xl hover:shadow-[0_0_25px_#facc1555] transition-shadow border border-yellow-600/50 flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
            <h4 className="text-xl font-bold text-yellow-400 flex items-center">
                <Users className="w-5 h-5 mr-2" /> {offer.lender}
            </h4>
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-yellow-500 text-black">
                New Offer
            </span>
        </div>

        <p className="text-xl font-extrabold text-gray-50 mb-1">{offer.counterProduct}</p>
        <p className="text-sm text-gray-400 mb-4 italic">
            (Original Request: {offer.originalProduct})
        </p>

        <div className="grid grid-cols-3 gap-2 text-center my-4 border-y border-gray-700 py-3">
            <div className="p-1">
                <p className="text-lg font-semibold text-yellow-400">{offer.offeredAmount}</p>
                <p className="text-xs text-gray-400">Offered Amount</p>
            </div>

            <div className="p-1">
                <p className="text-lg font-semibold text-yellow-400">{offer.interestRate}</p>
                <p className="text-xs text-gray-400">Interest</p>
            </div>

            <div className="p-1">
                <p className="text-lg font-semibold text-yellow-400">{offer.tenure}</p>
                <p className="text-xs text-gray-400">Tenure</p>
            </div>
        </div>

        <div className="mt-2 pt-3 border-t border-gray-700/50">
            <p className="text-xs font-semibold text-gray-300 mb-1 flex items-center">
                <Target className="w-3 h-3 mr-1 text-yellow-400" /> Lender Rationale:
            </p>
            <p className="text-sm text-gray-400 italic">{offer.reason}</p>
        </div>

        <div className="flex space-x-4 mt-6">
            <button className="flex-1 py-3 bg-yellow-500 hover:bg-yellow-600 rounded-lg text-black font-semibold transition duration-150">
                Accept Offer
            </button>
            <button className="flex-1 py-3 border border-yellow-500 text-yellow-500 hover:bg-yellow-500/10 rounded-lg font-semibold transition duration-150">
                View Details
            </button>
        </div>
    </div>
);

// -------------------------------------------------------------------
// 4. Main Page Component
// -------------------------------------------------------------------
export default function ApprovalsAndOffers() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = React.useState('');
    const [activeTab, setActiveTab] = React.useState('approvals');
    const [sidebarOpen, setSidebarOpen] = React.useState(false);
    const [isSyncing, setIsSyncing] = React.useState(false);
    const [isDarkMode, setIsDarkMode] = React.useState(true);

    const user = { name: 'MSME', gstin: '27ABCDE1234F' };

    // --- State and Handlers (Simplified for this example) ---
    const handleLogout = () => navigate('/');
    const handleSync = () => {
        setIsSyncing(true);
        setTimeout(() => setIsSyncing(false), 2000);
    };
    const toggleTheme = () => setIsDarkMode(!isDarkMode);

    // Filtered applications based on search term
    const filteredApplications = APPLICATION_STATUS.filter(
        (app) =>
            app.bank.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.product.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Separating application types for display
    const approvedApplications = filteredApplications.filter(
        (app) => app.status === 'Approved'
    );
    const pendingApplications = filteredApplications.filter(
        (app) => app.status === 'Pending Review' || app.status === 'Counter Offer'
    );
    const otherApplications = filteredApplications.filter(
        (app) => app.status === 'Rejected'
    );

    const filteredCounterOffers = COUNTER_OFFERS.filter(
        (offer) =>
            offer.lender.toLowerCase().includes(searchTerm.toLowerCase()) ||
            offer.counterProduct.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div
            className={`min-h-screen font-sans ${
                isDarkMode
                    ? 'dark bg-[#111217] text-gray-100'
                    : 'bg-gray-100 text-gray-800'
            }`}
        >
            <Sidebar
                activeTab="Approvals & Offers"
                setActiveTab={setActiveTab} // Note: Sidebar would handle navigation updates
                isOpen={sidebarOpen}
                setIsOpen={setSidebarOpen}
                onLogout={handleLogout}
            />

            <div className="lg:ml-64 min-h-screen flex flex-col">
                <Header
                    user={user}
                    isSyncing={isSyncing}
                    onSync={handleSync}
                    toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                    isDarkMode={isDarkMode}
                    toggleTheme={toggleTheme}
                    showSync={true}
                    pageTitle="Approvals & Offers"
                />

                <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                    <div className="space-y-8">
                        {/* 1. Credit Snapshot */}
                        <HealthCard profile={MSME_PROFILE} />

                        {/* 2. Search Bar */}
                        <div className="flex items-center bg-[#1e1f29] p-3 rounded-xl border border-[#00ff75]/20 shadow-lg">
                            <Search className="text-[#00ff75] w-5 h-5 mr-3" />
                            <input
                                type="text"
                                placeholder="Search applications or offers by Bank/Product..."
                                className="flex-grow bg-transparent text-gray-100 placeholder-gray-500 focus:outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        
                        {/* 3. Approved Applications */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-50 mb-4 flex items-center">
                                <CheckCircle className="w-6 h-6 mr-2 text-[#00ff75]" /> Approved Applications ({approvedApplications.length})
                            </h2>
                            <div className="space-y-4">
                                {approvedApplications.length > 0 ? (
                                    approvedApplications.map((app) => (
                                        <ApplicationStatusCard key={app.id} app={app} />
                                    ))
                                ) : (
                                    <p className="text-gray-400 p-4 bg-[#1e1f29] rounded-xl">
                                        No applications are currently approved.
                                    </p>
                                )}
                            </div>
                        </section>

                        <hr className="border-gray-700" />
                        
                        {/* 4. Counter Offers Section */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-50 mb-4 flex items-center">
                                <DollarSign className="w-6 h-6 mr-2 text-yellow-500" /> Counter Offers ({filteredCounterOffers.length})
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredCounterOffers.length > 0 ? (
                                    filteredCounterOffers.map((offer) => (
                                        <CounterOfferCard key={offer.id} offer={offer} />
                                    ))
                                ) : (
                                    <p className="md:col-span-2 lg:col-span-3 text-gray-400 p-4 bg-[#1e1f29] rounded-xl">
                                        No counter offers available at this time.
                                    </p>
                                )}
                            </div>
                        </section>

                        <hr className="border-gray-700" />

                        {/* 5. Pending & Other Applications */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-50 mb-4 flex items-center">
                                <Clock className="w-6 h-6 mr-2 text-blue-400" /> Pending & Other Applications
                            </h2>
                            <div className="space-y-4">
                                {pendingApplications.length > 0 && (
                                    <div className="space-y-4 border-l-4 border-blue-500 pl-4 bg-[#1e1f29] p-4 rounded-xl">
                                        <h3 className="text-xl font-semibold text-blue-400">In Review ({pendingApplications.length})</h3>
                                        {pendingApplications.map((app) => (
                                            <ApplicationStatusCard key={app.id} app={app} />
                                        ))}
                                    </div>
                                )}
                                {otherApplications.length > 0 && (
                                    <div className="space-y-4 border-l-4 border-red-500 pl-4 bg-[#1e1f29] p-4 rounded-xl">
                                        <h3 className="text-xl font-semibold text-red-400">Rejected ({otherApplications.length})</h3>
                                        {otherApplications.map((app) => (
                                            <ApplicationStatusCard key={app.id} app={app} />
                                        ))}
                                    </div>
                                )}
                                {pendingApplications.length === 0 && otherApplications.length === 0 && (
                                    <p className="text-gray-400 p-4 bg-[#1e1f29] rounded-xl">
                                        No pending or rejected applications found.
                                    </p>
                                )}
                            </div>
                        </section>

                        {/* 6. Transparency Note */}
                        <div className="p-5 bg-[#00ff7520] rounded-xl border border-[#00ff75]/40 text-green-200">
                            <p className="text-sm font-medium">💡 Transparency Note:</p>
                            <p className="text-xs mt-1">
                                Our Guidance Agent provides rationale for rejections and counter-offers, giving you clear next steps to improve your credit eligibility.
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}