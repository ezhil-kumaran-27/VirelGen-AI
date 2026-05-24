import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
// Login route removed
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Protected Routes inside Layout */}
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/history" element={<div className="glass p-6 rounded-2xl"><h2 className="text-2xl font-bold">History (Coming Soon)</h2></div>} />
          <Route path="/settings" element={<div className="glass p-6 rounded-2xl"><h2 className="text-2xl font-bold">Settings (Coming Soon)</h2></div>} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
