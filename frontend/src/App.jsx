import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import MsmeDashboard from './pages/MsmeDashboard';
import LenderDashboard from './pages/LenderDashboard';
import Login from './pages/Login';
import LoanApplications from './pages/LoanApplications';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/msme-dashboard" element={<MsmeDashboard />} />
        <Route path="/lender-dashboard" element={<LenderDashboard />} />
        <Route path="/loan-applications" element={<LoanApplications />} />
        {/* Placeholder routes for full functionality */}
        <Route path="/approvals" element={<LoanApplications />} />
        <Route path="/reports" element={<LoanApplications />} />
        <Route path="/notifications" element={<LoanApplications />} />
      </Routes>
    </Router>
  );
}

export default App;