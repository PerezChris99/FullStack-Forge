// middleware.js

// Middleware function to log requests
const logger = (req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next(); // Pass control to the next middleware
};

// Middleware function to check for authentication
const authenticate = (req, res, next) => {
    const token = req.headers['authorization'];
    if (token) {
        // Logic to verify token (this is just a placeholder)
        next(); // Token is valid, proceed to the next middleware
    } else {
        res.status(401).send('Unauthorized'); // No token provided
    }
};

// Middleware function to handle errors
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!'); // Generic error message
};

// Exporting the middleware functions
module.exports = {
    logger,
    authenticate,
    errorHandler
};