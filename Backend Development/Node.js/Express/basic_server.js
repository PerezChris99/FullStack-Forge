/**
 * Express.js Basic Server
 * ======================
 * This file demonstrates how to create a basic Express.js server with routes, middleware,
 * and error handling.
 */

const express = require('express');
const morgan = require('morgan');
const path = require('path');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Built-in middleware
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from 'public' folder

// Third-party middleware
app.use(morgan('dev')); // Log HTTP requests

// Custom middleware
const requestTimeMiddleware = (req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(`Request received at: ${req.requestTime}`);
  next();
};

app.use(requestTimeMiddleware);

// Route-specific middleware
const authMiddleware = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey === 'secret-api-key') {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized - Invalid API key' });
  }
};

// Basic routes
app.get('/', (req, res) => {
  res.send(`
    <h1>Welcome to Express.js</h1>
    <p>This is a basic Express server.</p>
    <p>Request received at: ${req.requestTime}</p>
  `);
});

// JSON response
app.get('/api/info', (req, res) => {
  res.json({
    name: 'Express Server',
    version: '1.0.0',
    timestamp: req.requestTime
  });
});

// Route parameters
app.get('/api/users/:id', (req, res) => {
  res.json({
    id: req.params.id,
    name: `User ${req.params.id}`,
    timestamp: req.requestTime
  });
});

// Query parameters
app.get('/api/search', (req, res) => {
  const { query, limit = 10, page = 1 } = req.query;
  
  res.json({
    query,
    limit: parseInt(limit),
    page: parseInt(page),
    results: [`Result for: ${query}`],
    timestamp: req.requestTime
  });
});

// Protected route using middleware
app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({
    message: 'You have accessed a protected route',
    timestamp: req.requestTime
  });
});

// POST request handling
app.post('/api/data', (req, res) => {
  console.log('Received data:', req.body);
  res.status(201).json({
    message: 'Data received successfully',
    data: req.body,
    timestamp: req.requestTime
  });
});

// Route grouping
const productRoutes = express.Router();

productRoutes.get('/', (req, res) => {
  res.json({ products: ['Product 1', 'Product 2', 'Product 3'] });
});

productRoutes.get('/:id', (req, res) => {
  res.json({ id: req.params.id, name: `Product ${req.params.id}` });
});

productRoutes.post('/', (req, res) => {
  res.status(201).json({ message: 'Product created', data: req.body });
});

// Mount the product routes
app.use('/api/products', productRoutes);

// Error handling middleware
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('To install required dependencies:');
  console.log('npm install express morgan');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});
