require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const authRoutes = require('./routes/auth');
const tradeRoutes = require('./routes/trade');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/trade', tradeRoutes);

// Sample Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Create HTTP server and Socket.IO instance
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  }
});

// Socket.IO logic
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join user-specific room when user registers socket
  socket.on('register', (userId) => {
    socket.join(String(userId));
    console.log(`Socket ${socket.id} joined room: ${userId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make io accessible in route handlers
app.set('io', io);

// Server Start
const PORT = 5003;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
