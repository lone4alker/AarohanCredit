import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Pages
import LandingPage from './pages/Landing';
import Login from './pages/Login';

// MSME Imports
import MsmeDashboard from './pages/MsmeDashboard';
import LoanApplications from './pages/LoanApplications'; 
import ApprovalsAndOffers from './pages/Approvals';// From your 2nd snippet (likely used by MSME)

// Lender Imports
import LenderDashboard from './pages/LenderDashboard';
import LenderApplications from './pages/LenderApplications'; // From your 1st snippet
import LenderPolicies from './pages/LenderPolicies';

// Placeholder Components for Lender
const LenderReports = () => <div className="p-8"><h1>Lender Reports Page</h1><p>Content coming soon.</p></div>;
const LenderNotifications = () => <div className="p-8"><h1>Lender Notifications Page</h1><p>Content coming soon.</p></div>;

function App() {
    return (
        <Router>
            <Routes>
                {/* --- Public Routes --- */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />

                {/* --- MSME Routes --- */}
                <Route path="/msme-dashboard" element={<MsmeDashboard />} />
                <Route path="/approvals" element={<ApprovalsAndOffers />} />

                {/* These routes were missing in snippet 1, causing MSME features to break */}
                <Route path="/loan-applications" element={<LoanApplications />} />
                <Route path="/reports" element={<LoanApplications />} />
                <Route path="/notifications" element={<LoanApplications />} />

                {/* --- Lender Routes --- */}
                <Route path="/lender-dashboard" element={<LenderDashboard />} />
                <Route path="/lender-loans" element={<LenderApplications />} />
                <Route path="/lender-policies" element={<LenderPolicies />} />
                <Route path="/lender-reports" element={<LenderReports />} />
                <Route path="/lender-notifications" element={<LenderNotifications />} />

            </Routes>
        </Router>
    );
}

export default App;