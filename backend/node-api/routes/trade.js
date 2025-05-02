const express = require('express');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const prisma = new PrismaClient();
const router = express.Router();

// Simulate a random stock price between 90 and 110
let currentPrice = 100;

// Update price every 5 seconds
// setInterval(() => {
//   const randomChange = (Math.random() - 0.5) * 2; // random between -1 and +1
//   currentPrice += randomChange;
// }, 5000);

const fetchPrice = async (symbol = 'BTC') => {
  try {
    const res = await axios.get(`http://localhost:5263/api/price/${symbol}`);
    return res.data.price;
  } catch (err) {
    console.error('Error fetching price:', err.message);
    return null;
  }
};


// Middleware to protect routes
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid Token' });
  }
};

// Place a trade (BUY or SELL)
router.post('/place', authenticate, async (req, res) => {
  const { type, quantity, symbol } = req.body;

  if (!['BUY', 'SELL'].includes(type)) {
    return res.status(400).json({ message: 'Invalid trade type' });
  }

  if (!symbol || typeof symbol !== 'string') {
    return res.status(400).json({ message: 'Symbol is required' });
  }

  const currentPrice = await fetchPrice(symbol);
  if (!currentPrice) {
    return res.status(500).json({ message: 'Unable to fetch price for symbol' });
  }

  const trade = await prisma.trade.create({
    data: {
      userId: req.user.id,
      type,
      quantity,
      price: currentPrice,
      symbol: symbol.toUpperCase(),
    },
  });

  res.json({ message: 'Trade placed', trade });
});

// Get portfolio (all trades)
router.get('/portfolio', authenticate, async (req, res) => {
  const trades = await prisma.trade.findMany({
    where: { userId: req.user.id },
  });

  const summary = {};

  for (const trade of trades) {
    const sym = trade.symbol;
    if (!summary[sym]) {
      summary[sym] = { totalQuantity: 0, totalValue: 0 };
    }

    const q = trade.quantity;
    const p = trade.price;

    if (trade.type === 'BUY') {
      summary[sym].totalQuantity += q;
      summary[sym].totalValue += q * p;
    } else if (trade.type === 'SELL') {
      summary[sym].totalQuantity -= q;
      summary[sym].totalValue -= q * p;
    }
  }

  const response = {};

  for (const symbol of Object.keys(summary)) {
    const price = await fetchPrice(symbol);
    response[symbol] = {
      currentPrice: price,
      totalQuantity: summary[symbol].totalQuantity,
      portfolioValue: summary[symbol].totalQuantity * price,
    };
  }

  res.json(response);
});

router.get('/history', authenticate, async (req, res) => {
  const trades = await prisma.trade.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' },
  });

  res.json(trades);
});


module.exports = router;
