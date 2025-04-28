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