import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav style={{ padding: '10px', borderBottom: '1px solid #ccc', marginBottom: '20px' }}>
      <Link to="/trade" style={{ marginRight: '15px' }}>Trade</Link>
      <Link to="/history" style={{ marginRight: '15px' }}>History</Link>
      <Link to="/dashboard" style={{ marginRight: '15px' }}>Dashboard</Link>
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
}
