if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');
const connectDB = require('./config/mongodb');
const Admin = require('./models/Admin');
const rateLimit = require('express-rate-limit');

const app = express();

// --- Test environment handling ---
if (process.env.NODE_ENV === 'test') {
  console.log('Test environment: Exporting mock server');

  const app = express();
  app.use(express.json());

  [
    { path: '/api/auth', router: require('./routes/auth') },
    { path: '/api/admin', router: require('./routes/admin') },
    { path: '/api/blog', router: require('./routes/blog') },
    { path: '/api/contact', router: require('./routes/contact') },
    { path: '/api/subscribers', router: require('./routes/subscribers') },
    { path: '/api/events', router: require('./routes/events') },
    { path: '/api/enrollments', router: require('./routes/enrollments') },
    { path: '/api/users', router: require('./routes/users') }
  ].forEach(route => app.use(route.path, route.router));

  module.exports = { 
    app, 
    server: { listen: () => {}, close: () => {} },
    broadcastDashboardUpdate: () => {}
  };
} else {
  // Normal server initialization for non-test environments
  initializeServer();
}

function initializeServer() {
  // --- CORS ---
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://cprofessionalsnetworkdev.onrender.com',
    'https://cpn-frontend-dev.onrender.com',
    'https://cpn-front-dev.onrender.com',
  ];

  app.use(cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      console.log('CORS blocked origin:', origin);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET','POST','PUT','DELETE','OPTIONS','PATCH'],
    allowedHeaders: ['Content-Type','Authorization','X-Requested-With','Accept','Origin']
  }));

  // --- Rate limiting ---
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 600,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => (req.headers['upgrade'] || '').toLowerCase() === 'websocket',
  });
  if (process.env.NODE_ENV === 'production') app.use(limiter);

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // --- DB Connection ---
  connectDB();

  // --- Seed superadmin ---
  (async () => {
    try {
      const count = await Admin.countDocuments({ role: 'superadmin' });
      if (count === 0) {
        const bcrypt = require('bcryptjs');
        const password_hash = await bcrypt.hash(process.env.SUPERADMIN_PASSWORD, 10);
        await Admin.create({
          username: process.env.SUPERADMIN_USERNAME,
          email: process.env.SUPERADMIN_EMAIL,
          password_hash,
          role: 'superadmin'
        });
        console.log('Seeded superadmin user:', process.env.SUPERADMIN_USERNAME);
      }
    } catch (e) {
      console.error('Error seeding superadmin:', e.message);
    }
  })();

  // --- Server + WebSocket ---
  const server = http.createServer(app);
  const wss = new WebSocket.Server({ server, clientTracking: true });

  // WebSocket connection handling
  wss.on('connection', (ws, req) => {
    console.log('✅ New WebSocket connection');
    ws.isAlive = true;

    const origin = req.headers.origin;
    if (origin && !allowedOrigins.includes(origin)) {
      console.log('❌ WebSocket connection rejected due to CORS:', origin);
      ws.close(1008, 'Not allowed by CORS');
      return;
    }

    ws.on('pong', () => { ws.isAlive = true; });

    ws.on('close', (code, reason) => {
      console.log(`❌ WebSocket disconnected - Code: ${code}, Reason: ${reason}`);
    });

    ws.on('error', (err) => {
      console.error('WebSocket error:', err.message);
    });
  });

  // Keep-alive ping/pong
  const keepAliveInterval = setInterval(() => {
    wss.clients.forEach((ws) => {
      if (!ws.isAlive) return ws.terminate();
      ws.isAlive = false;
      try { ws.ping(); } catch { ws.terminate(); }
    });
  }, 30000);

  wss.on('close', () => clearInterval(keepAliveInterval));

  // --- Dashboard broadcast ---
  function broadcastDashboardUpdate(update) {
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        try {
          client.send(JSON.stringify({ 
            type: 'dashboard-update', 
            payload: update,
            timestamp: Date.now()
          }));
        } catch (err) {
          console.error('Broadcast error:', err.message);
          client.terminate();
        }
      }
    });
  }
  app.set('broadcastDashboardUpdate', broadcastDashboardUpdate);

  // --- Health check ---
  app.get('/health', async (req, res) => {
    try {
      const mongoose = require('mongoose');
      const dbState = mongoose.connection.readyState;
      res.status(200).json({
        status: 'OK',
        database: dbState === 1 ? 'connected' : 'disconnected',
        websocket: wss.clients.size
      });
    } catch (err) {
      res.status(500).json({ status: 'DB_ERROR', message: 'Database connection failed' });
    }
  });

  // --- Routes ---
  [
    { path: '/api/auth', router: require('./routes/auth') },
    { path: '/api/admin', router: require('./routes/admin') },
    { path: '/api/blog', router: require('./routes/blog') },
    { path: '/api/contact', router: require('./routes/contact') },
    { path: '/api/subscribers', router: require('./routes/subscribers') },
    { path: '/api/events', router: require('./routes/events') },
    { path: '/api/enrollments', router: require('./routes/enrollments') },
    { path: '/api/users', router: require('./routes/users') }
  ].forEach(route => app.use(route.path, route.router));

  // --- Static files ---
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  // --- Error handler ---
  app.use((err, req, res, next) => {
    console.error(err.stack);
    if (err.message === 'Not allowed by CORS') 
      return res.status(403).json({ message: 'CORS policy violation' });
    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  });

  // --- Start server ---
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🔌 WebSocket running at ${process.env.NODE_ENV === 'production' ? 'wss' : 'ws'}://localhost:${PORT}`);
  });

  module.exports = { app, server, broadcastDashboardUpdate };
}
