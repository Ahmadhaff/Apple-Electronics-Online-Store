// authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authMiddleware = async (req, res, next) => {
  try {
    // Get the JWT token from the "Authorization" header
    const token = req.headers.authorization.split(' ')[1];

    // Verify the JWT token and extract the user ID
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    // Find the user by ID and attach the user object to the request
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    req.user = user;

    // Call the next middleware function
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};

module.exports = authMiddleware;
