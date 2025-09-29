const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Improve MongoDB connection: retries and fallback to local
mongoose.set('strictQuery', false);

const routes = () => {
  // Routes (registered after DB is ready)
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/users', require('./routes/users'));
  app.use('/api/teachers', require('./routes/teachers'));
  app.use('/api/students', require('./routes/students'));
  app.use('/api/subjects', require('./routes/subjects'));
  app.use('/api/pricing', require('./routes/pricing'));
  app.use('/api/tutors', require('./routes/tutors'));
  app.use('/api/admin', require('./routes/admin'));
};

async function connectWithRetry(uri, options = {}, retries = 5, delayMs = 2000) {
  let attempt = 0;
  while (attempt < retries) {
    try {
      attempt += 1;
      console.log(`Attempting MongoDB connection to ${uri} (attempt ${attempt}/${retries})`);
      await mongoose.connect(uri, options);
      console.log('MongoDB connected successfully');
      return true;
    } catch (err) {
      console.error(`MongoDB connection attempt ${attempt} failed:`, err.message || err);
      if (attempt >= retries) break;
      await new Promise(r => setTimeout(r, delayMs));
    }
  }
  return false;
}

// Simple health route
app.get('/health', (req, res) => res.json({ ok: true, mongo: mongoose.connection.readyState }));

// Serve static files from React build
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

const PORT = parseInt(process.env.PORT, 10) || 5000;

async function start() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/home-tuition';
  const opts = { useNewUrlParser: true, useUnifiedTopology: true };

  const ok = await connectWithRetry(uri, opts, 5, 2500);
  if (!ok && uri !== 'mongodb://localhost:27017/home-tuition') {
    console.warn('Primary MongoDB failed. Trying local MongoDB fallback...');
    const localOk = await connectWithRetry('mongodb://localhost:27017/home-tuition', opts, 5, 2000);
    if (!localOk) {
      console.error('All MongoDB connection attempts failed. Starting server without DB (some features will be disabled).');
    }
  }

  // Register routes after DB attempt (so require() won't fail due to model expectations)
  try {
    routes();
  } catch (err) {
    console.error('Error registering routes:', err);
  }

  // Start server with error handling to avoid unhandled exceptions on EADDRINUSE
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Make sure no other server is running on that port.`);
      process.exit(1);
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });

  // Graceful shutdown
  const graceful = async () => {
    console.log('Shutting down...');
    try {
      await mongoose.disconnect();
      server.close(() => {
        console.log('Closed out remaining connections');
        process.exit(0);
      });
    } catch (err) {
      console.error('Error during shutdown', err);
      process.exit(1);
    }
  };

  process.on('SIGTERM', graceful);
  process.on('SIGINT', graceful);
}

start().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

