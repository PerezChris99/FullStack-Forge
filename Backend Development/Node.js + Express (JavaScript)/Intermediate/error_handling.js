// error_handling.js

// Custom error classes for different types of errors
class ApplicationError extends Error {
    constructor(message, status) {
        super(message);
        this.name = this.constructor.name;
        this.status = status || 500;
        Error.captureStackTrace(this, this.constructor);
    }
}

class ValidationError extends ApplicationError {
    constructor(message, validationErrors = {}) {
        super(message || 'Validation Error', 400);
        this.validationErrors = validationErrors;
    }
}

class NotFoundError extends ApplicationError {
    constructor(message) {
        super(message || 'Resource not found', 404);
    }
}

class UnauthorizedError extends ApplicationError {
    constructor(message) {
        super(message || 'Unauthorized', 401);
    }
}

class ForbiddenError extends ApplicationError {
    constructor(message) {
        super(message || 'Forbidden', 403);
    }
}

// Async error handler wrapper to avoid try/catch blocks
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Main error handling middleware
const errorHandler = (err, req, res, next) => {
    // Set default status code and message if not provided
    const status = err.status || 500;
    const message = err.message || 'Something went wrong!';

    // Log the error for debugging purposes
    console.error(`[${new Date().toISOString()}] Error:`, err);
    
    // Determine environment to control error details in response
    const isProduction = process.env.NODE_ENV === 'production';
    
    // Prepare the error response
    const errorResponse = {
        status,
        message,
        ...(err.validationErrors && { validationErrors: err.validationErrors }),
        ...(isProduction ? {} : { 
            stack: err.stack,
            name: err.name
        })
    };
    
    // Send the error response
    res.status(status).json({
        error: errorResponse
    });
};

// Not found middleware - for undefined routes
const notFoundHandler = (req, res, next) => {
    const err = new NotFoundError(`Route not found: ${req.method} ${req.url}`);
    next(err);
};

// Common controller for handling 404 errors for resources
const resourceNotFound = (resource) => {
    return new NotFoundError(`${resource} not found`);
};

module.exports = {
    ValidationError,
    NotFoundError,
    UnauthorizedError,
    ForbiddenError,
    ApplicationError,
    asyncHandler,
    errorHandler,
    notFoundHandler,
    resourceNotFound
};