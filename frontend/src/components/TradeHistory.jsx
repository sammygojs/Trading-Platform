import { useEffect, useState } from 'react';
import axios from 'axios';
import PortfolioChart from './PortfolioChart';
import Navbar from './Navbar';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 px-4 py-8">
      <Navbar />

      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8 mt-6 space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800 text-center">Trade History</h2>

        <PortfolioChart trades={trades} />

        <div className="overflow-x-auto mt-4">
          <table className="min-w-full table-auto border-collapse rounded-md overflow-hidden shadow-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-600 text-sm uppercase tracking-wider">
              <th className="px-6 py-3 text-left">Symbol</th>
                <th className="px-6 py-3 text-left">Type</th>
                <th className="px-6 py-3 text-left">Quantity</th>
                <th className="px-6 py-3 text-left">Price</th>
                <th className="px-6 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {trades.map((t) => (
                <tr key={t.id} className="border-t">
                  <td className="px-6 py-3">{t.symbol}</td>
                  <td className="px-6 py-3">{t.type}</td>
                  <td className="px-6 py-3">{t.quantity}</td>
                  <td className="px-6 py-3">${t.price.toFixed(2)}</td>
                  <td className="px-6 py-3">{new Date(t.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
