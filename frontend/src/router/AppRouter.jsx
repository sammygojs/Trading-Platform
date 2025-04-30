import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../components/Login';
import Register from '../components/Register';
import Dashboard from '../components/Dashboard';
import ProtectedRoute from './ProtectedRoute';
import Trade from '../components/Trade';
import TradeHistory from '../components/TradeHistory';
import NotFound from '../components/NotFound';
import NotFoundAuth from '../components/NotFoundAuth';

export default function AppRouter() {
  const token = localStorage.getItem('token');
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/history" element={
          <ProtectedRoute>
            <TradeHistory />
          </ProtectedRoute>
        } />
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
        {/* <Route path="*" element={<NotFound />} /> */}
        <Route path="*" element={token ? <NotFoundAuth /> : <NotFound />} />
      </Routes>
    </Router>
  );
}
