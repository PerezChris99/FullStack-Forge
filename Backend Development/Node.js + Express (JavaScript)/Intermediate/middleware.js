// middleware.js

const jwt = require('jsonwebtoken');

// Middleware function to log requests with timestamps and request details
const logger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    const { method, url, ip } = req;
    console.log(`[${timestamp}] ${method} ${url} - IP: ${ip}`);
    
    // Track response time
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[${timestamp}] ${method} ${url} - ${res.statusCode} - ${duration}ms`);
    });
    
    next();
};

// Middleware function to check for authentication with better JWT handling
const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            return res.status(401).json({ error: 'Authorization header is required' });
        }
        
        if (!authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Invalid authorization format, must be Bearer token' });
        }
        
        const token = authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ error: 'Token not provided' });
        }
        
        // Use environment variable for secret in production
        const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
        
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({ error: 'Token has expired' });
                }
                return res.status(403).json({ error: 'Invalid or malformed token' });
            }
            
            // Add decoded user information to request object
            req.user = decoded;
            next();
        });
    } catch (error) {
        res.status(500).json({ error: 'Authentication error' });
    }
};

// Role-based authorization middleware
const authorize = (roles = []) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        
        const userRole = req.user.role;
        
        if (roles.length && !roles.includes(userRole)) {
            return res.status(403).json({ 
                error: 'Forbidden: Insufficient permissions' 
            });
        }
        
        next();
    };
};

// Enhanced error handler with more detailed error responses
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    
    // Log stack trace but don't send it to client in production
    const isProduction = process.env.NODE_ENV === 'production';
    
    const errorResponse = {
        message: err.message || 'Internal server error',
        status: err.status || 500,
        ...(isProduction ? {} : { stack: err.stack })
    };
    
    // Log the error for monitoring
    console.error(`[ERROR] ${req.method} ${req.url}:`, err);
    
    res.status(errorResponse.status).json({
        error: errorResponse.message,
        ...(isProduction ? {} : { details: errorResponse })
    });
};

// CORS middleware
const cors = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    next();
};

// Request rate limiting middleware
const rateLimit = (maxRequests = 100, windowMs = 60000) => {
    const clients = new Map();
    
    return (req, res, next) => {
        const clientIP = req.ip;
        const now = Date.now();
        
        if (!clients.has(clientIP)) {
            clients.set(clientIP, []);
        }
        
        const clientRequests = clients.get(clientIP);
        
        // Filter out old requests outside the time window
        const recentRequests = clientRequests.filter(timestamp => now - timestamp < windowMs);
        clients.set(clientIP, recentRequests);
        
        if (recentRequests.length >= maxRequests) {
            return res.status(429).json({
                error: 'Too many requests, please try again later'
            });
        }
        
        // Add current request timestamp
        recentRequests.push(now);
        clients.set(clientIP, recentRequests);
        
        next();
    };
};

// Exporting the middleware functions
module.exports = {
    logger,
    authenticate,
    authorize,
    errorHandler,
    cors,
    rateLimit
};