import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../components/Login';
import Register from '../components/Register';
import Dashboard from '../components/Dashboard';
import ProtectedRoute from './ProtectedRoute';
import Trade from '../components/Trade';

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/trade" element={
          <ProtectedRoute>
            <Trade />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}
