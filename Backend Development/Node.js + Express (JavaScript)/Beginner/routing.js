const express = require('express');
const router = express.Router();

// Define a simple route
router.get('/', (req, res) => {
    res.send('Welcome to the Node.js + Express Beginner Routing!');
});

// Define a route for a specific path
router.get('/about', (req, res) => {
    res.send('About this routing example.');
});

// Export the router to be used in the main app
module.exports = router;