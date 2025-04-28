require('dotenv').config();
const express = require('express');
const cors = require('cors');
const tradeRoutes = require('./routes/trade')

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');

// ... (middleware)
app.use('/api/auth', authRoutes);

app.use('/api/trade', tradeRoutes);

// Sample Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Server Start
const PORT = 5003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
