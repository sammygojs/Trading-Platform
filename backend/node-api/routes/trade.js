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
  const { type, quantity } = req.body;

  if (!['BUY', 'SELL'].includes(type)) {
    return res.status(400).json({ message: 'Invalid trade type' });
  }

  const currentPrice = await fetchPrice('BTC');
  if (!currentPrice) {
    return res.status(500).json({ message: 'Unable to fetch current price' });
  }

  const trade = await prisma.trade.create({
    data: {
      userId: req.user.id,
      type,
      quantity,
      price: currentPrice,
    },
  });

  res.json({ message: 'Trade placed', trade });
});



// Get portfolio (all trades)
router.get('/portfolio', authenticate, async (req, res) => {
  const trades = await prisma.trade.findMany({
    where: { userId: req.user.id },
  });

  let totalQuantity = 0;

  trades.forEach(trade => {
    if (trade.type === 'BUY') {
      totalQuantity += trade.quantity;
    } else if (trade.type === 'SELL') {
      totalQuantity -= trade.quantity;
    }
  });

  const currentPrice = await fetchPrice('BTC');
  if (!currentPrice) {
    return res.status(500).json({ message: 'Unable to fetch current price' });
  }

  res.json({
    currentPrice,
    totalQuantity,
    portfolioValue: totalQuantity * currentPrice,
  });
});


router.get('/history', authenticate, async (req, res) => {
  const trades = await prisma.trade.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' },
  });

  res.json(trades);
});


module.exports = router;
