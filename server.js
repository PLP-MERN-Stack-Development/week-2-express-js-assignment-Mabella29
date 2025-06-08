// server.js - Starter Express server for Week 2 assignment

// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
const {logger, authenticate, validationProductCreation} = require('./middleware')


// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(bodyParser.json());
app.use(express.json());
app.use(logger);
app.use(authenticate);

// Sample in-memory products database
let products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with 128GB storage',
    price: 800,
    category: 'electronics',
    inStock: true
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false
  }
];

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Product API! Go to /api/products to see all products.');
});

// TODO: Implement the following routes:
// GET /api/products - Get all products
app.get('/api/products', (req,res)=>{
  res.json(products)
})

// GET /api/products/:id - Get a specific product
app.get('/api/products/:id', (req,res)=>{
  try {
    const product = products.find(p => p.id === req.params.id)
      if(!product){
        return res.status(404).json({message:'product not found'})

      }
    res.status(200).json(product)
    
  } catch (error) {
    res.status(500).json(error)
    
  }
})
// POST /api/products - Create a new product
const id = uuidv4()
app.post('/api/products',(req,res)=>{
  try {
    const {name, description, price, category, inStock}  = req.body;
    const product = {id,name, description, price, category, inStock}
    if(!name|| !description || !category) 
      return res.status(400).json({message: 'name , description and category are required'})

    products.push(product)
    res.status(201).json(product)

  } catch (error) {
    res.status(400).json(error)
    
  }
})
// PUT /api/products/:id - Update a product
app.put('/api/products/:id', (req,res)=>{
  try {
    const product = products.find(p => p.id === req.params.id);
    const {name, description, price, category,inStock} = req.body
    if(!product)
      return res.status(404).json({message:'product not found'})
    if(name !== undefined) product.name = name;
    if(description !== undefined) product.description = description;
    if(price !== undefined) product.price = price;
    if(category !== undefined) product.category = category;
    if(inStock !== undefined) product.inStock = inStock;
    res.status(200).json(product)
    
  } catch (error) {
    res.status(500).json(error)
    
  }
})
// DELETE /api/products/:id - Delete a product
app.delete('/api/products/:id', (req, res)=>{
  try {
    const product = products.find(d =>d.id === req.params.id)
    if(!product) 
      return res.status(404).json({mssg:'product not found'})
    products = products.filter(d=>d.id !== req.params.id)
    res.status(200).json(product)
  } catch (error) {
    res.status(500).json(error)
  }
})

// Example route implementation for GET /api/products
app.get('/api/products', (req, res) => {
  res.json(products);
});

// TODO: Implement custom middleware for:
// - Request logging

// - Authentication

//validation Product
app.use(validationProductCreation)
// - Error handling


//Advanced 
// 🔍 Search by name
app.get('/api/products/search', (req, res) => {
  const { name } = req.query;
  if (!name) return res.status(400).json({ message: 'Please provide a name to search' });

  const result = products.filter(p =>
    p.name.toLowerCase().includes(name.toLowerCase())
  );
  res.status(200).json(result);
});

// Filter + Pagination
app.get('/api/products', (req, res) => {
  let { category, page = 1, limit = 10 } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);

  let filtered = products;

  if (category) {
    filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginated = filtered.slice(startIndex, endIndex);

  res.status(200).json({
    total: filtered.length,
    page,
    limit,
    data: paginated,
  });
});


app.get('/api/products/stats', (req, res) => {
  const stats = {};

  products.forEach(p => {
    if (stats[p.category]) {
      stats[p.category]++;
    } else {
      stats[p.category] = 1;
    }
  });

  res.status(200).json({ stats });
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
module.exports = app; 