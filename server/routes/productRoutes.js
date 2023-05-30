const express = require('express');
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct, productSearch } = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin');
const router = express.Router();

// Route to get all products
router.get('/products', getProducts);

// Route to search for products
router.get('/products/search', productSearch);

// Route to get a specific product by ID (requires authentication)
router.get('/products/:id', authMiddleware, getProductById);

// Route to create a new product (requires authentication and admin privileges)
router.post('/products', authMiddleware, isAdmin, createProduct);

// Route to update a product by ID (requires authentication and admin privileges)
router.put('/products/:id', authMiddleware, isAdmin, updateProduct);

// Route to delete a product by ID (requires authentication and admin privileges)
router.delete('/products/:id', authMiddleware, isAdmin, deleteProduct);

module.exports = router;
