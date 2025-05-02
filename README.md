# 📈 Real-Time Trading Platform

A simplified but realistic real-time trading platform built with:

- **Frontend:** React (Trading Dashboard, Order Book, Analytics)
- **Backend:** Node.js/Express API + C# (.NET Core Microservice)
- **Database:** PostgreSQL
- **Real-time:** WebSockets for live updates
- **DevOps:** Docker, Kubernetes, GitHub Actions for CI/CD

---

## 🏗 Architecture Overview

```
[React Frontend] <--REST/WebSocket--> [Node.js API] <--gRPC/HTTP--> [C# Service]
        |                                  |                             |
     (Web)                             (API, WebSocket)            (Calculation)
        |                                  |                             |
    [Docker Container]              [Docker Container]             [Docker Container]
        |______________________________Kubernetes Cluster___________________________|
                                   |                  |
                            [PostgreSQL DB]     [Redis Cache (optional)]
```

---

## 🚀 Core Features

- User Registration/Login (JWT)
- Trade Simulation (Buy/Sell)
- Order Matching Engine
- Portfolio Tracking
- Analytics Dashboard
- Admin Panel
- Real-time Updates (WebSockets)
- DevOps with Docker, Kubernetes, and CI/CD (GitHub Actions)

---

## 📁 File/Folder Structure

To create the project structure:

```bash
mkdir -p trading-platform/{backend/{node-api,csharp-service},frontend,db,devops/{docker,k8s,ci},docs} && touch trading-platform/README.md
```

Project structure:

```
trading-platform/
├── backend/
│   ├── node-api/          # Node.js/Express API (main backend)
│   └── csharp-service/    # .NET Core microservice (calculations)
├── frontend/              # React app (dashboard, UI)
├── db/                    # DB migration scripts, seed data
├── devops/
│   ├── docker/            # Dockerfiles for each service
│   ├── k8s/               # Kubernetes YAMLs
│   └── ci/                # GitHub Actions, scripts
├── README.md
└── docs/
```

---

## ⚙️ Tech Stack Decision

| Layer           | Technology                                    |
|-----------------|------------------------------------------------|
| Frontend        | React + TypeScript (Vite or CRA)               |
| Backend         | Node.js (Express) + TypeScript (optional)      |
| Microservice    | C# (.NET Core Web API)                         |
| Database        | PostgreSQL                                     |
| Authentication  | JWT                                            |
| Real-time       | Socket.IO (Node) + WebSocket client (React)    |
| Testing         | Jest (Node.js), xUnit (C#), React Testing Library |
| CI/CD           | GitHub Actions (build, test, deploy)           |
| DevOps          | Docker, Kubernetes                            |

---

## 🌟 First Sprint — User Authentication & Project Setup

### 🏆 Sprint 1 Goal
Set up the monorepo, initialize backend, frontend, and C# service with basic structure, and implement User Registration/Login in the Node.js API.

---

### 📝 Action Plan

#### 1. Repo Setup
- Create a new GitHub repository: `trading-platform`
- Initialize folders based on the structure above.

#### 2. Backend (Node.js API)
- Set up a basic Express API.
- Connect to PostgreSQL using Prisma, TypeORM, Sequelize, or Knex.
- Implement `/register` and `/login` endpoints.
- Issue JWTs on login.

#### 3. Frontend (React)
- Set up a new React project using Vite or Create React App.
- Create Registration and Login forms.
- Connect the forms to backend endpoints via API.

#### 4. (Optional) C# Microservice
- Scaffold a .NET Core Web API (integration with backend will happen after authentication is ready).

#### 5. DevOps
- Write simple Dockerfiles for Node.js and React apps.
- Create a `docker-compose.yml` file for local development setup.

---

### 📦 Deliverables for Sprint 1

- [x] User can register and login via API.
- [x] JWT authentication is implemented.
- [x] React UI for registration and login pages.
- [x] Backend and Frontend apps run with Docker Compose.

---

# 🔥 Project Progress

Future sprints will focus on:

- Order Matching Engine
- Real-time WebSocket Updates
- Portfolio Tracking
- Analytics Dashboard
- Scaling with Kubernetes
- Full CI/CD Pipeline with GitHub Actions

---


## 🚀 Sprint 1 — Part 1: Backend Setup

### 1. Initialize Node.js Project

Inside the `backend/node-api/` folder:

```bash
cd backend/node-api
npm init -y
```

---

### 2. Install Backend Dependencies

```bash
npm install express cors dotenv jsonwebtoken bcryptjs pg
```

---

### 3. Install Dev Dependencies

```bash
npm install --save-dev nodemon
```

Add to `package.json`:

```json
"scripts": {
  "dev": "nodemon index.js"
}
```

---

### 4. Create `index.js`

```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

### 5. Create `.env` File

```plaintext
PORT=5000
JWT_SECRET=your_jwt_secret_here
DATABASE_URL=postgresql://your_db_username:your_db_password@localhost:5432/your_db_name
```

---

## 🚀 Sprint 1 — Part 2: User Registration/Login API

### 6. Create Authentication Routes

Create `backend/node-api/routes/auth.js`:

```javascript
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

const users = [];

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  users.push({ username, password: hashedPassword });

  res.status(201).json({ message: 'User registered successfully' });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);

  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ token });
});

module.exports = router;
```

---

### 7. Connect Routes to Express App

Update `backend/node-api/index.js`:

```javascript
const authRoutes = require('./routes/auth');

app.use('/api/auth', authRoutes);
```

---

## 🏁 Sprint 1 Checkpoints

- [x] Server running at `http://localhost:5003`
- [x] POST `/api/auth/register` to create a user
- [x] POST `/api/auth/login` to receive JWT

Run the server:

```bash
npm run dev
```

## 🚀 Sprint 1 — Part 3: Connect Node.js API to PostgreSQL

### 1. Install Prisma ORM

```bash
npm install prisma @prisma/client
```

Initialize Prisma:

```bash
npx prisma init
```

This creates:
- `prisma/schema.prisma` (where you'll define models)
- `.env` (already exists; ensure `DATABASE_URL` is correct)

---

### 2. Setup `.env` DATABASE_URL

Example:

```plaintext
DATABASE_URL="postgresql://your_user:your_password@localhost:5432/your_database?schema=public"
```

Change `your_user`, `your_password`, and `your_database` according to your PostgreSQL setup.

---

### 3. Update `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id       Int    @id @default(autoincrement())
  username String @unique
  password String
}
```

This defines your `User` model.

---

### 4. Run Migration

```bash
npx prisma migrate dev --name init
```

This will:
- Create the `User` table inside your database
- Generate the Prisma client

---

### 5. Update Backend to Use Prisma

Update `backend/node-api/routes/auth.js`:

```javascript
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  const existingUser = await prisma.user.findUnique({ where: { username } });
  if (existingUser) {
    return res.status(400).json({ message: 'Username already taken' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: { username, password: hashedPassword },
  });

  res.status(201).json({ message: 'User registered successfully' });
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await prisma.user.findUnique({ where: { username } });

  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.json({ token });
});

module.exports = router;
```

---

## 🚀 Sprint 1 — Part 4: Frontend Setup

### 1. Initialize React Frontend

From project root:

```bash
cd frontend
npm create vite@latest
```

- Project name: `frontend`
- Framework: `React`
- Variant: `JavaScript` (or `TypeScript` if you prefer)

Install dependencies:

```bash
cd frontend
npm install
```

---

### 2. Install Axios and React Router

```bash
npm install axios react-router-dom
```

- `axios`: for making HTTP requests
- `react-router-dom`: for client-side routing

---

### 3. Create Basic Frontend Folder Structure

Inside `frontend/src/`:

```
src/
├── api/
│   └── auth.js       # Axios functions for login/register
├── components/
│   ├── Login.jsx     # Login page
│   ├── Register.jsx  # Register page
│   └── Dashboard.jsx # After login (protected page)
├── App.jsx
├── main.jsx
├── router/
│   └── AppRouter.jsx # All routes
└── styles/
    └── styles.css    # (optional)
```

---

### 4. Set up Axios API Calls

`frontend/src/api/auth.js`:

```javascript
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export const register = (userData) => {
  return axios.post(`${API_URL}/register`, userData);
};

export const login = (userData) => {
  return axios.post(`${API_URL}/login`, userData);
};
```

---

### 5. Create React Pages

✅ `frontend/src/components/Register.jsx`:

```jsx
import { useState } from 'react';
import { register } from '../api/auth';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await register({ username, password });
      alert('Registration successful!');
    } catch (error) {
      alert('Registration failed');
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Register</h2>
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Register</button>
    </form>
  );
}
```

✅ `frontend/src/components/Login.jsx`:

```jsx
import { useState } from 'react';
import { login } from '../api/auth';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ username, password });
      localStorage.setItem('token', res.data.token);
      alert('Login successful!');
      window.location.href = '/dashboard';
    } catch (error) {
      alert('Login failed');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  );
}
```

---

### 6. Set up Routing

✅ `frontend/src/router/AppRouter.jsx`:

```jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from '../components/Register';
import Login from '../components/Login';
import Dashboard from '../components/Dashboard';

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}
```

✅ `frontend/src/App.jsx`:

```jsx
import AppRouter from './router/AppRouter';

export default function App() {
  return <AppRouter />;
}
```

---

### 7. Run the Frontend

Inside `frontend/`:

```bash
npm run dev
```

✅ Frontend available at `http://localhost:5173/`.

---

## 🚀 Sprint 1 — Part 5: Add Protected Route (JWT Check)

### 🎯 Why a Protected Route?

Currently, anyone can manually type `http://localhost:5173/dashboard` and access the dashboard even without logging in.

✅ We want to protect `/dashboard`:
- If no valid token (JWT) in `localStorage`, redirect to `/` (login page).
- If logged in (token exists), allow access.

---

## 📋 Steps to Implement Protected Route

### 1. Create `ProtectedRoute.jsx`

Inside `frontend/src/router/ProtectedRoute.jsx`:

```jsx
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
}
```

✅ This component checks if a token exists in localStorage.

---

### 2. Update `AppRouter.jsx` to Use ProtectedRoute

Modify `frontend/src/router/AppRouter.jsx`:

```jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../components/Login';
import Register from '../components/Register';
import Dashboard from '../components/Dashboard';
import ProtectedRoute from './ProtectedRoute';

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}
```

✅ Now `/dashboard` is protected.

---

### 3. (Optional) Add Logout Button to Dashboard

Update `frontend/src/components/Dashboard.jsx`:

```jsx
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div>
      <h2>Welcome to Dashboard</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
```

✅ Now user can log out, clearing the token and redirecting back to login.

---

## 🚀 Sprint 2 — Add Basic Trading Functionality

### 1. Database: Add a Trade Model (Backend Prisma)

Update your `prisma/schema.prisma`:

```prisma
model Trade {
  id        Int      @id @default(autoincrement())
  userId    Int
  type      String   // BUY or SELL
  quantity  Float
  price     Float
  createdAt DateTime @default(now())

  User User @relation(fields: [userId], references: [id])
}
```

✅ This creates a `Trade` table with fields to track user trades.

---

### 2. Run Prisma Migration

```bash
npx prisma migrate dev --name add-trade
```

✅ Updates your local database with the new `Trade` table.

---

### 3. Backend: Create Trading Endpoints

Create `backend/node-api/routes/trade.js`:

```javascript
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const router = express.Router();

let currentPrice = 100;

setInterval(() => {
  const randomChange = (Math.random() - 0.5) * 2;
  currentPrice += randomChange;
}, 5000);

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

router.post('/place', authenticate, async (req, res) => {
  const { type, quantity } = req.body;

  if (!['BUY', 'SELL'].includes(type)) {
    return res.status(400).json({ message: 'Invalid trade type' });
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

router.get('/portfolio', authenticate, async (req, res) => {
  const trades = await prisma.trade.findMany({
    where: { userId: req.user.id },
  });

  let totalQuantity = 0;
  let totalValue = 0;

  trades.forEach(trade => {
    if (trade.type === 'BUY') {
      totalQuantity += trade.quantity;
      totalValue += trade.price * trade.quantity;
    } else if (trade.type === 'SELL') {
      totalQuantity -= trade.quantity;
      totalValue -= trade.price * trade.quantity;
    }
  });

  res.json({
    currentPrice,
    totalQuantity,
    portfolioValue: totalQuantity * currentPrice,
  });
});

module.exports = router;
```

---

### 4. Connect Trade Route in Backend

Update `backend/node-api/index.js`:

```javascript
const tradeRoutes = require('./routes/trade');

app.use('/api/trade', tradeRoutes);
```

✅ Backend now supports:
- `POST /api/trade/place`
- `GET /api/trade/portfolio`

---

### 5. Frontend: Create a Trading Page

Create `frontend/src/components/Trade.jsx`:

```jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Trade() {
  const [currentPrice, setCurrentPrice] = useState(0);
  const [quantity, setQuantity] = useState('');
  const [portfolio, setPortfolio] = useState({});

  const token = localStorage.getItem('token');

  const fetchPortfolio = async () => {
    const res = await axios.get('http://localhost:5000/api/trade/portfolio', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setCurrentPrice(res.data.currentPrice);
    setPortfolio(res.data);
  };

  const placeTrade = async (type) => {
    await axios.post('http://localhost:5000/api/trade/place', {
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
    <div>
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
```

---

### 6. Update AppRouter

Update `frontend/src/router/AppRouter.jsx`:

```jsx
import Trade from '../components/Trade';

<Route path="/trade" element={
  <ProtectedRoute>
    <Trade />
  </ProtectedRoute>
} />
```

✅ Now users can access `/trade` to buy/sell and view their portfolio.

---

## ↺ Updates (1/05/2025)

### 🛠️ C# Microservice Integration
- Created a standalone C# (.NET Core Web API) service to simulate and return asset prices.
- Exposes endpoint: `GET /api/price/{symbol}`.
- Returns: `{ "symbol": "BTC", "price": 102.33, "timestamp": "..." }`
- Started the service locally and tested via browser and Postman.

### 👨‍💻 Node.js Backend Changes
- Removed simulated price logic (`currentPrice` and `setInterval`) from `routes/trade.js`.
- Added `axios` and implemented a new function `fetchPrice(symbol)` to call the C# service.
- Updated `/api/trade/place` and `/api/trade/portfolio` to use `fetchPrice()` instead of `currentPrice`.

### 🔐 Frontend Authentication Enhancements
- Installed and configured `jwt-decode` to verify JWT expiration on the frontend.
- Modified `ProtectedRoute.jsx` to decode token and reject access if expired.
- Added automatic redirect from `/` to `/dashboard` if token exists and is valid (in `Login.jsx`).

### 📍 Navigation and Routing Improvements
- Implemented a shared navigation tab that appears **only after login**.
- Added a generic fallback `NotFound.jsx` component.
- Logic shows different fallback pages based on whether the user is authenticated or not.

### ✅ Summary of Files Modified
- `backend/node-api/routes/trade.js`: replaced local price with external call
- `frontend/src/api/auth.js`: no changes here
- `frontend/src/router/ProtectedRoute.jsx`: checks token expiration
- `frontend/src/components/Login.jsx`: auto-redirects to dashboard
- `frontend/src/components/NotFound.jsx`: shows fallback UI based on login
- `frontend/src/AppRouter.jsx`: updated with new routes and ProtectedRoute logic

---

## ↺ Updates 2/5/2025

### 🛠️ C# Microservice Integration

* Created a standalone C# (.NET Core Web API) service to simulate and return asset prices.
* Exposes endpoint: `GET /api/price/{symbol}`.
* Returns: `{ "symbol": "BTC", "price": 102.33, "timestamp": "..." }`
* Enabled CORS for development testing.

### 👨‍💻 Node.js Backend Changes

* Removed local price simulation from `trade.js`.
* Introduced `fetchPrice(symbol)` using Axios to call the C# price service.
* Trade placement (`/api/trade/place`) now accepts and stores `symbol`.
* Portfolio endpoint (`/api/trade/portfolio`) aggregates trades per symbol and queries live prices.
* Prisma schema updated to add `symbol` field to `Trade` model with default fallback during migration.

### 🔐 Frontend Authentication Enhancements

* Used `jwt-decode` to verify token expiration and route users appropriately.
* Auto-redirects from login to dashboard when token is valid.
* Protected routes enforce valid and non-expired JWTs.

### 📍 Navigation and Routing Improvements

* Added a navigation menu post-login.
* Added a fallback 404 page based on authentication state.

### 📈 Frontend Trading Logic Enhancements

* Users can now select between multiple commodities: BTC, ETH, AAPL.
* Trades are placed with the selected symbol.
* Portfolio is rendered with grouped views per symbol.
* Trade history now includes the traded symbol in its data table.
* Charting via Recharts shows portfolio value over time.
* Current price updates periodically based on selected symbol.

### ✅ Summary of Key Files Modified

* `prisma/schema.prisma`: added `symbol` to `Trade`
* `backend/node-api/routes/trade.js`: used `symbol` in trade placement and portfolio
* `frontend/src/components/Trade.jsx`: added dropdown for symbols, renders grouped portfolio
* `frontend/src/components/TradeHistory.jsx`: added `symbol` column
* `frontend/src/components/PortfolioChart.jsx`: renders chart using updated `trades`
* `frontend/src/router/ProtectedRoute.jsx`: token expiration check using `jwt-decode`

---

## 🔄 Updates 3/5/2025

### 🛠️ C# Microservice Integration

* Created a standalone C# (.NET Core Web API) service to simulate and return asset prices.
* Exposes endpoint: `GET /api/price/{symbol}`.
* Example response: `{ "symbol": "BTC", "price": 102.33, "timestamp": "..." }`

### 👨‍💻 Node.js Service Update

* Removed local price simulation.
* Integrated Axios call in Node.js backend to fetch live prices from the C# service.
* Refactored `/place` and `/portfolio` routes to use dynamic prices via C#.
* Fixed Prisma update logic bug by separating `increment` and `decrement` balance updates.

### 💹 Multi-Commodity Trading

* Added support for trading multiple assets: `BTC`, `ETH`, and `AAPL`.
* Schema updated: added `symbol` column to `Trade` table via Prisma migration.
* Portfolio response groups trades by symbol with `totalQuantity`, `avgBuyPrice`, `portfolioValue`, and `unrealizedPnl`.

### 🖥️ Frontend Enhancements

* Updated Trade page to allow selecting symbols from a dropdown.
* Displayed live current price, quantity, portfolio value, and P\&L per symbol.
* Showed available cash balance.
* Handled missing price safely with fallback rendering.

### 🧠 Debugging & Fixes

* Fixed persistent `500 Internal Server Error` from Prisma due to conflicting balance updates.
* Improved error logging in frontend for failed trade submissions.

---
