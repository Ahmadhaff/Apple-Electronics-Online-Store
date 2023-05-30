const express = require('express');
const router = express.Router();
const {addToCart,removeFromCart,updateCartItemQuantity,clearCart,getCartItems,checkout} = require('../controllers/cartController');
const authMiddleware = require('../middleware/authMiddleware');

// Add a product to the cart
router.post('/cart/items',authMiddleware,addToCart);

// Remove a product from the cart
router.delete('/cart/items/:id',authMiddleware, removeFromCart);

// Update the quantity of a product in the cart
router.patch('/cart/items/:id',authMiddleware,  updateCartItemQuantity);

// Clear the entire cart
router.delete('/cart/items',authMiddleware,  clearCart);

// Get all items in the cart
router.get('/cart/items', authMiddleware, getCartItems);

// Checkout and place an order
router.post('/cart/checkout', authMiddleware,  checkout);

module.exports = router;
