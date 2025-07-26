require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');
const setupDatabase = require('./setup');
const pool = require('./config/database');

const app = express();

// Enhanced CORS configuration
const allowedOrigins = [
  'https://christianprofessionalsnetwork.onrender.com',
  'https://cpnwebsiteproject.onrender.com',
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

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check with DB verification
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).json({ 
      status: 'OK',
      database: 'connected',
      websocket: wss.clients.size
    });
  } catch (err) {
    res.status(500).json({ 
      status: 'DB_ERROR',
      message: 'Database connection failed'
    });
  }
});

// Initialize database (only in development)
if (process.env.NODE_ENV !== 'production') {
  setupDatabase().catch(console.error);
}

// Routes
const routes = [
  { path: '/api/auth', router: require('./routes/auth') },
  { path: '/api/admin', router: require('./routes/admin') },
  { path: '/api/blog', router: require('./routes/blog') },
  { path: '/api/contact', router: require('./routes/contact') },
  { path: '/api/subscribers', router: require('./routes/subscribers') },
  { path: '/api/events', router: require('./routes/events') },
  { path: '/api/enrollments', router: require('./routes/enrollments') }
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
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket running on wss://cpnwebsiteproject.onrender.com`);
});

module.exports = { app, server, broadcastDashboardUpdate };




// const express = require('express');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const path = require('path');
// const http = require('http');
// const WebSocket = require('ws');

// // Load environment variables
// dotenv.config();

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Health check endpoint
// app.get('/health', (req, res) => {
//   res.status(200).json({ status: 'OK', message: 'Server is running' });
// });

// // Database connection
// const pool = require('./config/database');
// // Test database connection (non-blocking)
// pool.query('SELECT NOW()', (err, res) => {
//   if (err) {
//     console.error('Database connection error:', err);
//   } else {
//     console.log('Database connected successfully');
//   }
// });

// // Routes
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/admin', require('./routes/admin'));
// app.use('/api/blog', require('./routes/blog'));
// app.use('/api/contact', require('./routes/contact'));
// app.use('/api/subscribers', require('./routes/subscribers'));
// app.use('/api/events', require('./routes/events'));
// app.use('/api/enrollments', require('./routes/enrollments'));

// // Serve static files
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ message: 'Something went wrong!' });
// });

// const server = http.createServer(app);
// const wss = new WebSocket.Server({ server });

// function broadcastDashboardUpdate(data) {
//   wss.clients.forEach(client => {
//     if (client.readyState === WebSocket.OPEN) {
//       client.send(JSON.stringify({ type: 'dashboard-update', ...data }));
//     }
//   });
// }

// app.set('broadcastDashboardUpdate', broadcastDashboardUpdate);

// const PORT = process.env.PORT || 5000;

// server.listen(PORT, '::', () => {
//   console.log(`Server running on port [::]: ${PORT}`);
// });

// module.exports = { broadcastDashboardUpdate }; 












