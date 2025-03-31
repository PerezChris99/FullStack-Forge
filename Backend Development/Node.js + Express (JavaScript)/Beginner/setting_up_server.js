// setting_up_server.js

const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');

// Initialize express application
const app = express();

// Load environment variables
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware setup
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Security middleware
app.use(helmet()); // Set security HTTP headers
app.use(cors()); // Enable CORS for all routes

// Logging middleware
app.use(morgan(NODE_ENV === 'development' ? 'dev' : 'combined'));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Basic routes
app.get('/', (req, res) => {
    res.send({
        message: 'Hello, World! This is your Node.js server.',
        environment: NODE_ENV,
        timestamp: new Date().toISOString()
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'UP',
        timestamp: new Date().toISOString()
    });
});

// API routes - can be moved to separate files in a more complex app
app.get('/api/info', (req, res) => {
    res.json({
        name: 'Express Server API',
        version: '1.0.0',
        description: 'Simple API built with Node.js and Express'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        error: {
            message: err.message || 'Internal Server Error',
            status: statusCode
        }
    });
});

// 404 handler for undefined routes
app.use((req, res) => {
    res.status(404).json({
        error: {
            message: `Route not found: ${req.method} ${req.originalUrl}`,
            status: 404
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running in ${NODE_ENV} mode on http://localhost:${PORT}`);
    console.log(`Health check available at http://localhost:${PORT}/health`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

module.exports = app; // Export for testing