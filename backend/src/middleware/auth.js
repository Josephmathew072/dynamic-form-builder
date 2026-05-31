// import jwt from 'jsonwebtoken';
// import User from '../models/User.js';

// export const protect = async (req, res, next) => {
//   let token;
//   if (req.headers.authorization?.startsWith('Bearer')) {
//     token = req.headers.authorization.split(' ')[1];
//   }
//   if (!token) {
//     return res.status(401).json({ message: 'Not authorized, no token' });
//   }
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = await User.findById(decoded.id).select('-password');
//     next();
//   } catch (error) {
//     res.status(401).json({ message: 'Not authorized, token failed' });
//   }
// };

// export const superAdminOnly = (req, res, next) => {
//   if (req.user && req.user.role === 'superadmin') {
//     next();
//   } else {
//     res.status(403).json({ message: 'Access denied. Super admin only.' });
//   }
// };

// export const adminOnly = (req, res, next) => {
//   if (req.user && (req.user.role === 'admin' || req.user.role === 'superadmin')) {
//     next();
//   } else {
//     res.status(403).json({ message: 'Access denied. Admin only.' });
//   }
// };

export const protect = async (req, res, next) => {
  // TEMPORARILY DISABLED
  // Just set a dummy user
  req.user = { _id: 'dummy', role: 'superadmin' };
  return next();
};