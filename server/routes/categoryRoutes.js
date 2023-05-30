const express = require('express');
const router = express.Router();
const { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory } = require('../controllers/categoryController');
const authMiddleware = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin');

// Route to get all categories (requires authentication and admin privileges)
router.get('/categories', authMiddleware, isAdmin, getCategories);

// Route to get a specific category by ID (requires authentication and admin privileges)
router.get('/categories/:id', authMiddleware, isAdmin, getCategoryById);

// Route to create a new category (requires authentication and admin privileges)
router.post('/categories', authMiddleware, isAdmin, createCategory);

// Route to update a category by ID (requires authentication and admin privileges)
router.put('/categories/:id', authMiddleware, isAdmin, updateCategory);

// Route to delete a category by ID (requires authentication and admin privileges)
router.delete('/categories/:id', authMiddleware, isAdmin, deleteCategory);

module.exports = router;
