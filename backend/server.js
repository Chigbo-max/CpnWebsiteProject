require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');
const connectDB = require('./config/mongodb');
const Admin = require('./models/Admin');
const rateLimit = require('express-rate-limit');

const app = express();


// Enhanced CORS configuration
const allowedOrigins = [
  'https://cprofessionalsnetwork.onrender.com',
  'https://cpn-frontend-dev.onrender.com',
  'http://localhost:5173'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));


// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 600, // Limit each IP to 600 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.headers['upgrade'] === 'websocket',
});

// Apply rate limiting globally
// app.use(limiter);





app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Connect to MongoDB
connectDB();

// Seed super admin on startup
(async () => {
  try {
    const count = await Admin.countDocuments({ role: 'superadmin' });
    if (count === 0) {
      const bcrypt = require('bcryptjs');
      const password_hash = await bcrypt.hash(process.env.SUPERADMIN_PASSWORD, 10);
      await Admin.create({ username: process.env.SUPERADMIN_USERNAME, email: process.env.SUPERADMIN_EMAIL, password_hash, role: 'superadmin' });
      console.log('Seeded superadmin user: ', process.env.SUPERADMIN_USERNAME);
    }
  } catch (e) {
    console.error('Error seeding superadmin:', e.message);
  }
})();

// Health check with DB verification
app.get('/health', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const dbState = mongoose.connection.readyState;
    const isConnected = dbState === 1;
    
    res.status(200).json({ 
      status: 'OK',
      database: isConnected ? 'connected' : 'disconnected',
      websocket: wss.clients.size
    });
  } catch (err) {
    res.status(500).json({ 
      status: 'DB_ERROR',
      message: 'Database connection failed'
    });
  }
});

// Routes
const routes = [
  { path: '/api/auth', router: require('./routes/auth') },
  { path: '/api/admin', router: require('./routes/admin') },
  { path: '/api/blog', router: require('./routes/blog') },
  { path: '/api/contact', router: require('./routes/contact') },
  { path: '/api/subscribers', router: require('./routes/subscribers') },
  { path: '/api/events', router: require('./routes/events') },
  { path: '/api/enrollments', router: require('./routes/enrollments') },
  { path: '/api/users', router: require('./routes/users') }
];

routes.forEach(route => {
  app.use(route.path, route.router);
});

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// WebSocket Server
const server = http.createServer(app);
const wss = new WebSocket.Server({ 
  server,
  verifyClient: (info, done) => {
    const origin = info.origin || info.req.headers.origin;
    if (allowedOrigins.includes(origin)) {
      return done(true);
    }
    return done(false, 401, 'Unauthorized');
  }
});

wss.on('connection', (ws, req) => {
  console.log('New WebSocket connection');

   // Ping every 30 seconds to keep connection alive
  ws.isAlive = true;
  ws.on('pong', () => { ws.isAlive = true; });
  
  ws.on('message', (message) => {
    try {
      
      const data = JSON.parse(message);
      console.log('Received:', data);
    } catch (err) {
      console.error('Invalid WebSocket message:', err);
    }
  });

  ws.on('close', () => {
    console.log('WebSocket disconnected');
  });
});

// Ping clients every 30 seconds
setInterval(() => {
  wss.clients.forEach((client) => {
    if (!client.isAlive) return client.terminate();
    client.isAlive = false;
    client.ping();
  });
}, 30000);



function broadcastDashboardUpdate(data) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ 
        type: 'dashboard-update',
        timestamp: new Date().toISOString(),
        ...data 
      }));
    }
  });
}

app.set('broadcastDashboardUpdate', broadcastDashboardUpdate);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ message: 'CORS policy violation' });
  }
  
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`WebSocket running`);
  });
}

module.exports = { app, server, broadcastDashboardUpdate };














