// restful_apis.js

const express = require('express');
const router = express.Router();

// Sample data
let items = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
];

// Input validation middleware
const validateItem = (req, res, next) => {
    const { name } = req.body;
    if (!name || typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ error: 'Item name is required and must be a non-empty string' });
    }
    next();
};

// GET all items with optional filtering
router.get('/items', (req, res) => {
    try {
        const { name } = req.query;
        if (name) {
            const filteredItems = items.filter(item => 
                item.name.toLowerCase().includes(name.toLowerCase())
            );
            return res.json(filteredItems);
        }
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve items' });
    }
});

// GET an item by ID
router.get('/items/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }
        
        const item = items.find(i => i.id === id);
        if (!item) return res.status(404).json({ error: 'Item not found' });
        
        res.json(item);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve item' });
    }
});

// POST a new item
router.post('/items', validateItem, (req, res) => {
    try {
        const newItem = {
            id: items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1,
            name: req.body.name.trim(),
        };
        items.push(newItem);
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create item' });
    }
});

// PUT update an item
router.put('/items/:id', validateItem, (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }
        
        const item = items.find(i => i.id === id);
        if (!item) return res.status(404).json({ error: 'Item not found' });

        item.name = req.body.name.trim();
        res.json(item);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update item' });
    }
});

// DELETE an item
router.delete('/items/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }
        
        const itemIndex = items.findIndex(i => i.id === id);
        if (itemIndex === -1) return res.status(404).json({ error: 'Item not found' });

        const deletedItem = items[itemIndex];
        items.splice(itemIndex, 1);
        res.json({ message: 'Item deleted successfully', item: deletedItem });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete item' });
    }
});

module.exports = router;