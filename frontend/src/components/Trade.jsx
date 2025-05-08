import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import socket from '../socket';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL;

export default function Trade() {
  const [quantity, setQuantity] = useState('');
  const [portfolio, setPortfolio] = useState({ portfolio: {}, balance: 0 });
  const [symbol, setSymbol] = useState('BTC');
  const symbols = ['BTC', 'ETH', 'AAPL'];

  const token = localStorage.getItem('token');

  const fetchPortfolio = async () => {
    try {
      const res = await axios.get(`${API_URL}/trade/portfolio`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPortfolio(res.data);
    } catch (err) {
      console.error("Failed to fetch portfolio:", err);
    }
  };

  const placeTrade = async (type) => {
    try {
      await axios.post(
        `${API_URL}/trade/place`,
        {
          type,
          quantity: parseFloat(quantity),
          symbol,
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

    socket.on('trade_confirmation', (msg) => {
      toast.success(msg, {
        position: 'bottom-right',
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    });

    return () => {
      clearInterval(interval);
      socket.off('trade_confirmation');
    };
  }, []);

  const selected = portfolio.portfolio[symbol];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 px-4 py-8">
      <Navbar />
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-8 space-y-6 mt-6">
        <h2 className="text-2xl font-semibold text-gray-800 text-center">Trading Dashboard</h2>

        <div className="text-center text-lg text-gray-700">
          <p className="mb-2">
            <span className="font-medium">Current Price:</span>{' '}
            ${selected?.currentPrice?.toFixed(2) ?? 'Loading...'}
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 justify-center">
          <select value={symbol} onChange={(e) => setSymbol(e.target.value)}>
            {symbols.map(sym => <option key={sym} value={sym}>{sym}</option>)}
          </select>

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

        <div className="text-center text-lg text-gray-800 font-medium mt-4">
          Available Cash Balance: ${portfolio.balance?.toFixed(2) ?? '...'}
        </div>

        <div className="space-y-4 mt-6">
          {Object.entries(portfolio.portfolio).map(([sym, data]) => (
            <div key={sym} className="border-t pt-2">
              <h4 className="font-semibold text-lg text-gray-700">{sym}</h4>
              <p><span className="font-medium">Current Price:</span> ${data.currentPrice?.toFixed(2)}</p>
              <p><span className="font-medium">Total Quantity:</span> {data.totalQuantity}</p>
              <p><span className="font-medium">Average Buy Price:</span> ${data.avgBuyPrice?.toFixed(2)}</p>
              <p><span className="font-medium">Portfolio Value:</span> ${data.portfolioValue?.toFixed(2)}</p>
              <p>
                <span className="font-medium">Unrealized P&L:</span>{' '}
                <span className={data.unrealizedPnl >= 0 ? 'text-green-600' : 'text-red-600'}>
                  ${data.unrealizedPnl?.toFixed(2)}
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
