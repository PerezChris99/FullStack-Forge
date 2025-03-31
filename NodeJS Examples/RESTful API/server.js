/**
 * RESTful API Example with Node.js and Express
 * 
 * This example demonstrates how to create a complete CRUD API
 * following RESTful conventions with Express.js
 */

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/restful-api-example';

// Middleware
app.use(helmet());                             // Security headers
app.use(cors());                               // Enable CORS
app.use(express.json());                       // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(morgan('dev'));                        // HTTP request logger

// MongoDB connection (in-memory data is used if MongoDB isn't available)
let useMongoose = false;
let products = [];

// Create directory structure for models and routes
const fs = require('fs');
const path = require('path');

const modelsDir = path.join(__dirname, 'models');
const routesDir = path.join(__dirname, 'routes');

if (!fs.existsSync(modelsDir)){
    fs.mkdirSync(modelsDir, { recursive: true });
}

if (!fs.existsSync(routesDir)){
    fs.mkdirSync(routesDir, { recursive: true });
}

// Create Product model file
const productModelPath = path.join(modelsDir, 'Product.js');
if (!fs.existsSync(productModelPath)) {
    const productModelContent = `
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    inStock: {
        type: Boolean,
        default: true
    },
    quantity: {
        type: Number,
        default: 0,
        min: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Product', ProductSchema);
`;
    fs.writeFileSync(productModelPath, productModelContent);
}

// Create routes file
const productRoutesPath = path.join(routesDir, 'products.js');
if (!fs.existsSync(productRoutesPath)) {
    const productRoutesContent = `
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET all products
router.get('/', async (req, res) => {
    try {
        const { category, inStock } = req.query;
        let query = {};
        
        if (category) {
            query.category = category;
        }
        
        if (inStock !== undefined) {
            query.inStock = inStock === 'true';
        }
        
        const products = await Product.find(query);
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET a single product
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST create a new product
router.post('/', async (req, res) => {
    try {
        const product = new Product(req.body);
        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT update a product
router.put('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        Object.keys(req.body).forEach(key => {
            product[key] = req.body[key];
        });
        
        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PATCH update specific fields of a product
router.patch('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );
        
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        res.json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE a product
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
`;
    fs.writeFileSync(productRoutesPath, productRoutesContent);
}

// Try to connect to MongoDB
if (process.env.USE_MONGODB === 'true') {
    mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('Connected to MongoDB');
        useMongoose = true;
        
        // Use Mongoose models and routes
        app.use('/api/products', require('./routes/products'));
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB, using in-memory data instead:', err.message);
        setupInMemoryApi();
    });
} else {
    console.log('Using in-memory data storage (MongoDB not configured)');
    setupInMemoryApi();
}

// Setup API with in-memory storage
function setupInMemoryApi() {
    // Initialize with some sample data
    products = [
        { id: 1, name: 'Laptop', price: 999.99, category: 'Electronics', inStock: true, quantity: 15, createdAt: new Date() },
        { id: 2, name: 'Desk Chair', price: 199.50, category: 'Furniture', inStock: true, quantity: 8, createdAt: new Date() },
        { id: 3, name: 'Coffee Mug', price: 12.99, category: 'Kitchen', inStock: true, quantity: 50, createdAt: new Date() },
        { id: 4, name: 'Headphones', price: 59.99, category: 'Electronics', inStock: false, quantity: 0, createdAt: new Date() },
        { id: 5, name: 'Notebook', price: 4.99, category: 'Office Supplies', inStock: true, quantity: 100, createdAt: new Date() }
    ];
    
    // GET all products
    app.get('/api/products', (req, res) => {
        const { category, inStock } = req.query;
        
        let filteredProducts = [...products];
        
        if (category) {
            filteredProducts = filteredProducts.filter(p => 
                p.category.toLowerCase() === category.toLowerCase()
            );
        }
        
        if (inStock !== undefined) {
            const inStockBool = inStock === 'true';
            filteredProducts = filteredProducts.filter(p => p.inStock === inStockBool);
        }
        
        res.json(filteredProducts);
    });
    
    // GET a single product
    app.get('/api/products/:id', (req, res) => {
        const id = parseInt(req.params.id);
        const product = products.find(p => p.id === id);
        
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        res.json(product);
    });
    
    // POST create a new product
    app.post('/api/products', (req, res) => {
        const { name, price, category, description, inStock = true, quantity = 0 } = req.body;
        
        // Validate required fields
        if (!name || !price || !category) {
            return res.status(400).json({ error: 'Name, price, and category are required fields' });
        }
        
        // Generate a new ID
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        
        // Create the new product
        const newProduct = {
            id: newId,
            name,
            price: parseFloat(price),
            category,
            description: description || '',
            inStock: Boolean(inStock),
            quantity: parseInt(quantity),
            createdAt: new Date()
        };
        
        // Add to our "database"
        products.push(newProduct);
        
        res.status(201).json(newProduct);
    });
    
    // PUT update a product
    app.put('/api/products/:id', (req, res) => {
        const id = parseInt(req.params.id);
        const productIndex = products.findIndex(p => p.id === id);
        
        if (productIndex === -1) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        const { name, price, category, description, inStock, quantity } = req.body;
        
        // Update the product (full replacement)
        products[productIndex] = {
            id,
            name: name || products[productIndex].name,
            price: price !== undefined ? parseFloat(price) : products[productIndex].price,
            category: category || products[productIndex].category,
            description: description !== undefined ? description : products[productIndex].description,
            inStock: inStock !== undefined ? Boolean(inStock) : products[productIndex].inStock,
            quantity: quantity !== undefined ? parseInt(quantity) : products[productIndex].quantity,
            createdAt: products[productIndex].createdAt
        };
        
        res.json(products[productIndex]);
    });
    
    // PATCH update specific fields of a product
    app.patch('/api/products/:id', (req, res) => {
        const id = parseInt(req.params.id);
        const productIndex = products.findIndex(p => p.id === id);
        
        if (productIndex === -1) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        // Update only the provided fields
        const updatedProduct = { ...products[productIndex] };
        
        Object.keys(req.body).forEach(key => {
            if (key in updatedProduct) {
                // Convert values to appropriate types
                if (key === 'price') {
                    updatedProduct[key] = parseFloat(req.body[key]);
                } else if (key === 'inStock') {
                    updatedProduct[key] = Boolean(req.body[key]);
                } else if (key === 'quantity') {
                    updatedProduct[key] = parseInt(req.body[key]);
                } else {
                    updatedProduct[key] = req.body[key];
                }
            }
        });
        
        products[productIndex] = updatedProduct;
        res.json(updatedProduct);
    });
    
    // DELETE a product
    app.delete('/api/products/:id', (req, res) => {
        const id = parseInt(req.params.id);
        const initialLength = products.length;
        
        products = products.filter(p => p.id !== id);
        
        if (products.length === initialLength) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        res.json({ message: 'Product deleted successfully' });
    });
}

// Root route - API documentation
app.get('/', (req, res) => {
    res.json({
        message: 'RESTful API Example',
        version: '1.0.0',
        endpoints: [
            { method: 'GET', path: '/api/products', description: 'Get all products' },
            { method: 'GET', path: '/api/products?category={category}&inStock={boolean}', description: 'Filter products' },
            { method: 'GET', path: '/api/products/:id', description: 'Get a specific product' },
            { method: 'POST', path: '/api/products', description: 'Create a new product' },
            { method: 'PUT', path: '/api/products/:id', description: 'Update a product (full replacement)' },
            { method: 'PATCH', path: '/api/products/:id', description: 'Update specific fields of a product' },
            { method: 'DELETE', path: '/api/products/:id', description: 'Delete a product' }
        ],
        storage: useMongoose ? 'MongoDB' : 'In-memory'
    });
});

// Create a .env file with configuration options
const envFilePath = path.join(__dirname, '.env');
if (!fs.existsSync(envFilePath)) {
    const envFileContent = `
# Server Configuration
PORT=3000

# MongoDB Configuration
USE_MONGODB=false
MONGODB_URI=mongodb://localhost:27017/restful-api-example

# Enable for production
# NODE_ENV=production
`;
    fs.writeFileSync(envFilePath, envFileContent);
}

// Create package.json if it doesn't exist
const packageJsonPath = path.join(__dirname, 'package.json');
if (!fs.existsSync(packageJsonPath)) {
    const packageJsonContent = `
{
  "name": "restful-api-example",
  "version": "1.0.0",
  "description": "RESTful API example with Express.js",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "express": "^4.18.2",
    "helmet": "^7.0.0",
    "mongoose": "^7.0.3",
    "morgan": "^1.10.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.22"
  }
}
`;
    fs.writeFileSync(packageJsonPath, packageJsonContent);
}

// Create README.md if it doesn't exist
const readmePath = path.join(__dirname, 'README.md');
if (!fs.existsSync(readmePath)) {
    const readmeContent = `
# RESTful API Example

This is a complete RESTful API example built with Node.js and Express.js.

## Features

- CRUD operations for a product inventory
- RESTful API design
- MongoDB integration (optional)
- In-memory data storage fallback
- Input validation
- Error handling
- Filtering and sorting

## API Endpoints

- \`GET /api/products\`: Get all products
- \`GET /api/products?category={category}&inStock={boolean}\`: Filter products
- \`GET /api/products/:id\`: Get a specific product
- \`POST /api/products\`: Create a new product
- \`PUT /api/products/:id\`: Update a product (full replacement)
- \`PATCH /api/products/:id\`: Update specific fields of a product
- \`DELETE /api/products/:id\`: Delete a product

## Getting Started

1. Install dependencies: \`npm install\`
2. Configure .env file for MongoDB (optional)
3. Start the server: \`npm start\` or \`npm run dev\` for development

## Project Structure

- \`server.js\`: Main application file
- \`models/\`: MongoDB schemas
- \`routes/\`: API route handlers
- \`.env\`: Configuration options
`;
    fs.writeFileSync(readmePath, readmeContent);
}

// Error handling middleware
app.use((req, res, next) => {
    res.status(404).json({ error: 'Not Found - The requested resource does not exist' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Server error', 
        message: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred'
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API documentation available at http://localhost:${PORT}`);
});
