const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid');

//CRUD
// GET /api/products - Get all products
router.get('/api/products', (req,res)=>{
  res.json(products)
})

// GET /api/products/:id - Get a specific product
router.get('/api/products/:id', (req,res)=>{
    try {
        const product = products.find(p=>p.id === req.params.id)
        if(!product) 
            return res.status(404).json({message:'product not found'})
        res.status(200).json(product)
        
    } catch (error) {
        res.status(500).json(error)
        
    }
})

// POST /api/products - Create a new product

router.post('/api/products', (req, res)=>{
    try {
        const id = uuidv4();
        const {name, description, price, category,inStock} = req.body
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
router.put('/api/products/:id', (req,res)=>{

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
router.delete('/api/products/:id', (req, res)=>{
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
module.exports = router;