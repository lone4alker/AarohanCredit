import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Pages
import LandingPage from './pages/Landing';
import Login from './pages/Login';

// MSME Imports
import MsmeDashboard from './pages/MsmeDashboard';

// Lender Imports
import LenderDashboard from './pages/LenderDashboard';
import LenderApplications from './pages/LenderApplications'; // From your 1st snippet
import LenderPolicies from './pages/LenderPolicies';
import LenderReports from './pages/LenderReports';
import LenderNotifications from './pages/LenderNotifications';

function App() {
    return (
        <Router>
            <Routes>
                {/* --- Public Routes --- */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />

                {/* --- MSME Routes --- */}
                <Route path="/msme-dashboard" element={<MsmeDashboard />} />
                <Route path="/search-loans" element={<MsmeDashboard />} />
                <Route path="/loan-applications" element={<MsmeDashboard />} />
                <Route path="/approvals" element={<MsmeDashboard />} />
                <Route path="/analysis" element={<MsmeDashboard />} />
                <Route path="/notifications" element={<MsmeDashboard />} />

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