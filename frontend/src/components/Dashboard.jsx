import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

export default function Dashboard() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Adjust depending on how your token stores the name (e.g., decoded.name or decoded.username)
        setUsername(decoded.username || decoded.name || 'User');
      } catch (err) {
        console.error('Invalid token:', err);
        setUsername('User');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 px-4 py-8">
      <Navbar />
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-8 mt-6 space-y-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Welcome, {username} 👋</h2>
        <p className="text-gray-600">You're logged into your dashboard.</p>
        <button
          onClick={handleLogout}
          className="mt-4 bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-md transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
