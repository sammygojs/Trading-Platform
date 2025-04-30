import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

export default function Trade() {
  const [currentPrice, setCurrentPrice] = useState(0);
  const [quantity, setQuantity] = useState('');
  const [portfolio, setPortfolio] = useState({});

  const token = localStorage.getItem('token');

  const fetchPortfolio = async () => {
    const res = await axios.get('http://localhost:5003/api/trade/portfolio', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setCurrentPrice(res.data.currentPrice);
    setPortfolio(res.data);
  };

  const placeTrade = async (type) => {
    await axios.post('http://localhost:5003/api/trade/place', {
      type,
      quantity: parseFloat(quantity),
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setQuantity('');
    fetchPortfolio();
  };

  useEffect(() => {
    fetchPortfolio();
    const interval = setInterval(fetchPortfolio, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <Navbar />
      <h2>Trading</h2>
      <p>Current Price: {currentPrice.toFixed(2)}</p>
      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />
      <button onClick={() => placeTrade('BUY')}>Buy</button>
      <button onClick={() => placeTrade('SELL')}>Sell</button>

      <h3>Portfolio</h3>
      <p>Total Quantity: {portfolio.totalQuantity}</p>
      <p>Portfolio Value: {portfolio.portfolioValue?.toFixed(2)}</p>
    </div>
  );
}
