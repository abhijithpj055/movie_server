// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const protect = async (req, res, next) => {
  let token
if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  if (!token) {
    console.log(" No token provided");
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded user id:', decoded.id);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      console.log(" Token decoded but user not found in DB");
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    console.log(" Authenticated user:", req.user.email, "Role:", req.user.role);


    next();
  } catch (err) {
     console.log(" JWT verification failed", err.message);
    res.status(401).json({ message: 'Not authorized' });
  }
};

const admin = (req, res, next) => {
  console.log("req.body",req.body);
  
   console.log(" Checking admin for user:", req.user?.email, "Role:", req.user?.role);
  if (req.user && req.user.role==='admin') {
       console.log(" Admin access granted");
  
    next();
  } else {
        console.log(" Admin access denied");

    res.status(403).json({ message: 'Admin access required' });
  }
};

module.exports = { protect, admin };