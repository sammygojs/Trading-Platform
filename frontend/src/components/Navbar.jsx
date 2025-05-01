import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex space-x-6">
          <Link to="/trade" className="text-gray-700 font-medium hover:text-blue-600 transition">Trade</Link>
          <Link to="/history" className="text-gray-700 font-medium hover:text-blue-600 transition">History</Link>
          <Link to="/dashboard" className="text-gray-700 font-medium hover:text-blue-600 transition">Dashboard</Link>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-1.5 rounded-md transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
