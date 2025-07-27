const jwt = require('jsonwebtoken');

const authenticateAdmin = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    
   
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded; // decoded should include id, username, role
    next();
  } catch (error) {
    console.error('Auth error:', error.message);
    res.status(401).json({ message: 'Invalid token.' });
  }
};

module.exports = { authenticateAdmin }; 