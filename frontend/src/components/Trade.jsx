import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

export default function Trade() {
  const [currentPrice, setCurrentPrice] = useState(0);
  const [quantity, setQuantity] = useState('');
  const [portfolio, setPortfolio] = useState({});

  const token = localStorage.getItem('token');

  const fetchPortfolio = async () => {
    try {
      const res = await axios.get('http://localhost:5003/api/trade/portfolio', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentPrice(res.data.currentPrice);
      setPortfolio(res.data);
    } catch (err) {
      console.error("Failed to fetch portfolio:", err);
    }
  };

  const placeTrade = async (type) => {
    try {
      await axios.post(
        'http://localhost:5003/api/trade/place',
        {
          type,
          quantity: parseFloat(quantity),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setQuantity('');
      fetchPortfolio();
    } catch (err) {
      console.error("Trade failed:", err);
    }
  };

  useEffect(() => {
    fetchPortfolio();
    const interval = setInterval(fetchPortfolio, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 px-4 py-8">
      <Navbar />
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-8 space-y-6 mt-6">
        <h2 className="text-2xl font-semibold text-gray-800 text-center">Trading Dashboard</h2>

        <div className="text-center text-lg text-gray-700">
          <p className="mb-2">
            <span className="font-medium">Current Price:</span> ${currentPrice.toFixed(2)}
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 justify-center">
          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <button
            onClick={() => placeTrade('BUY')}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-md transition"
          >
            Buy
          </button>
          <button
            onClick={() => placeTrade('SELL')}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-md transition"
          >
            Sell
          </button>
        </div>

        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-xl font-medium text-gray-800 mb-2">Portfolio</h3>
          <p>
            <span className="font-medium">Total Quantity:</span> {portfolio.totalQuantity ?? 0}
          </p>
          <p>
            <span className="font-medium">Portfolio Value:</span> ${portfolio.portfolioValue?.toFixed(2) ?? 0}
          </p>
        </div>
      </div>
    </div>
  );
}
