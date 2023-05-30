const express = require('express');
const router = express.Router();
const { createOrder, getAllOrders, getOrderById, updateOrder, deleteOrder, searchOrderByStatus } = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin');

// Route to create a new order (requires authentication)
router.post('/orders', authMiddleware, createOrder);

// Route to get all orders (requires authentication and admin privileges)
router.get('/orders', authMiddleware, isAdmin, getAllOrders);

// Route to search orders by status (requires authentication and admin privileges)
router.get('/orders/search', authMiddleware, searchOrderByStatus);

// Route to get a specific order by ID (requires authentication and admin privileges)
router.get('/orders/:id', authMiddleware, isAdmin, getOrderById);

// Route to update an order by ID (requires authentication and admin privileges)
router.put('/orders/:id', authMiddleware, isAdmin, updateOrder);

// Route to delete an order by ID (requires authentication and admin privileges)
router.delete('/orders/:id', authMiddleware, isAdmin, deleteOrder);

module.exports = router;
