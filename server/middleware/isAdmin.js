const isAdmin = (req, res, next) => {
    const user = req.user; // assumes user object is attached to request object in middleware
  
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized.' });
    }
  
    next();
  };
  
  module.exports = isAdmin;
  