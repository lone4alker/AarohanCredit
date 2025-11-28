import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import MsmeDashboard from './pages/MsmeDashboard';
import LenderDashboard from './pages/LenderDashboard';
import Login from './pages/Login';

function App() {


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/msme-dashboard" element={<MsmeDashboard />} />
        <Route path="/lender-dashboard" element={<LenderDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
