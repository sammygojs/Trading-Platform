import Navbar from './Navbar';

export default function NotFoundAuth() {
  return (
    <div>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h1>404 - Page Not Found</h1>
        <p>This page doesn't exist. Try navigating using the menu above.</p>
      </div>
    </div>
  );
}
