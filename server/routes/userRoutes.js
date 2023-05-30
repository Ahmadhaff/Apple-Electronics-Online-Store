const express = require('express');
const { register, login,  updateUserProfile, deleteAccount, logout } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin');
const router = express.Router();

// Route for user registration
router.post('/users/register', register);

// Route for user login
router.post('/users/login', login);

// Route to get user data (requires authentication and admin privileges)
// router.get('/users', authMiddleware, getAllUsers);

// Route to update user profile (requires authentication and admin privileges)
router.put('/users/profile', authMiddleware, isAdmin, updateUserProfile);

// Route to delete user account (requires authentication and admin privileges)
router.delete('/users/profile', authMiddleware, isAdmin, deleteAccount);

// Route for user logout (requires authentication)
router.get('/users/logout', authMiddleware, logout);

module.exports = router;
