// src/App.jsx (UPDATED)

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import MsmeDashboard from './pages/MsmeDashboard';
import LenderDashboard from './pages/LenderDashboard';
import LenderApplications from './pages/LenderApplications'; // New Import
import LenderPolicies from './pages/LenderPolicies'; // New Import
import Login from './pages/Login';
// Import or create placeholders for other lender pages if needed, 
// but for this example, we'll focus on the requested ones.

// Placeholder pages for reports and notifications
const LenderReports = () => <div className="p-8"><h1>Lender Reports Page</h1><p>Content coming soon.</p></div>;
const LenderNotifications = () => <div className="p-8"><h1>Lender Notifications Page</h1><p>Content coming soon.</p></div>;


function App() {
    return (
        <Router>
            <Routes>
                {/* Public Route */}
                <Route path="/" element={<Login />} />
                
                {/* MSME Routes */}
                <Route path="/msme-dashboard" element={<MsmeDashboard />} />
                
                {/* Lender Routes */}
                <Route path="/lender-dashboard" element={<LenderDashboard />} />
                <Route path="/lender-loans" element={<LenderApplications />} /> {/* Updated Loan Applications Route */}
                <Route path="/lender-policies" element={<LenderPolicies />} /> {/* New Policies Route */}
                
                {/* Placeholder Lender Routes */}
                <Route path="/lender-reports" element={<LenderReports />} />
                <Route path="/lender-notifications" element={<LenderNotifications />} />
                
                {/* Fallback/Error Route (Optional) */}
                {/* <Route path="*" element={<div>404 Not Found</div>} /> */}
            </Routes>
        </Router>
    );
}

export default App;