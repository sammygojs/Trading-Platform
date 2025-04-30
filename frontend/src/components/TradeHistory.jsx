import { useEffect, useState } from 'react';
import axios from 'axios';
import PortfolioChart from './PortfolioChart'

export default function TradeHistory() {
  const [trades, setTrades] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchHistory = async () => {
      const res = await axios.get('http://localhost:5003/api/trade/history', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTrades(res.data);
    };

    fetchHistory();
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <h2>Trade History</h2>

      <PortfolioChart trades={trades} />

      <table border="1" cellPadding="6" style={{ marginTop: '20px' }}>
        <thead>
          <tr>
            <th>Type</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {trades.map((t) => (
            <tr key={t.id}>
              <td>{t.type}</td>
              <td>{t.quantity}</td>
              <td>{t.price.toFixed(2)}</td>
              <td>{new Date(t.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
