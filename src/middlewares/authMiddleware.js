const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Usuario no encontrado' });
      }
      
      if (!req.user.isActive) {
        return res.status(401).json({ success: false, message: 'Usuario inactivo' });
      }
      
      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Token no válido' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'No autorizado, token requerido' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Rol '${req.user.role}' no autorizado para esta acción` 
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
