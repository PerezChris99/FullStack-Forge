const express = require('express');
const router = express.Router();

// --------- Simple Routes ---------

// Define a simple route for the root path
router.get('/', (req, res) => {
    res.send('Welcome to the Node.js + Express Beginner Routing!');
});

// Define a route for a specific path
router.get('/about', (req, res) => {
    res.send('About this routing example.');
});

// --------- Route Parameters ---------

// Route with a single parameter
router.get('/users/:id', (req, res) => {
    const userId = req.params.id;
    res.send(`User ID: ${userId}`);
});

// Route with multiple parameters
router.get('/posts/:year/:month', (req, res) => {
    const { year, month } = req.params;
    res.send(`Posts from ${month}/${year}`);
});

// Optional parameters with regex
router.get('/products/:category?', (req, res) => {
    const category = req.params.category || 'all';
    res.send(`Products in category: ${category}`);
});

// --------- Query Parameters ---------

// Route using query parameters
router.get('/search', (req, res) => {
    const { q, limit = 10, page = 1 } = req.query;
    res.json({
        query: q,
        results: `Showing page ${page} with ${limit} results for query: ${q || 'all'}`
    });
});

// --------- HTTP Methods ---------

// POST example
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    // This is just a demo - don't handle authentication like this in production!
    if (username === 'user' && password === 'pass') {
        res.status(200).json({ message: 'Login successful' });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

// PUT example
router.put('/users/:id', (req, res) => {
    const userId = req.params.id;
    const userData = req.body;
    res.json({
        message: `User ${userId} updated`,
        data: userData
    });
});

// DELETE example
router.delete('/users/:id', (req, res) => {
    const userId = req.params.id;
    res.json({ message: `User ${userId} deleted` });
});

// --------- Route Chaining ---------

// Chain multiple HTTP methods for the same path
router.route('/contacts')
    .get((req, res) => {
        res.send('Get all contacts');
    })
    .post((req, res) => {
        res.send('Create a new contact');
    });

router.route('/contacts/:id')
    .get((req, res) => {
        res.send(`Get contact ${req.params.id}`);
    })
    .put((req, res) => {
        res.send(`Update contact ${req.params.id}`);
    })
    .delete((req, res) => {
        res.send(`Delete contact ${req.params.id}`);
    });

// --------- Route Middleware ---------

// Middleware for a specific route
const validateUser = (req, res, next) => {
    // Example of route-specific middleware
    const userId = req.params.id;
    if (userId && /^\d+$/.test(userId)) {  // Check if ID is numeric
        next(); // Proceed to the route handler
    } else {
        res.status(400).json({ error: 'Invalid user ID format' });
    }
};

// Route with middleware
router.get('/admin/:id', validateUser, (req, res) => {
    res.send(`Admin user: ${req.params.id}`);
});

// Export the router to be used in the main app
module.exports = router;