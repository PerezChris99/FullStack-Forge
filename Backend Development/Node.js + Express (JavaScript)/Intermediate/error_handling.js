// error_handling.js

// Error handling middleware for Express applications

// This middleware function handles errors that occur during the request-response cycle.
// It takes four parameters: error, request, response, and next.

const errorHandler = (err, req, res, next) => {
    // Log the error for debugging purposes
    console.error(err.stack);

    // Send a response to the client with the error message
    res.status(500).json({
        message: 'Something went wrong!',
        error: err.message
    });
};

// Export the error handling middleware
module.exports = errorHandler;