// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// /**
//  * Verifies the Bearer JWT from Authorization header.
//  * Attaches `req.user` for downstream use.
//  */
// const protect = async (req, res, next) => {
//   let token;

//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith('Bearer ')
//   ) {
//     token = req.headers.authorization.split(' ')[1];
//   }

//   if (!token) {
//     return res.status(401).json({ success: false, message: 'Not authorized. No token.' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     // Attach the user (without password) to the request object
//     req.user = await User.findById(decoded.id).select('-password');

//     if (!req.user) {
//       return res.status(401).json({ success: false, message: 'User no longer exists.' });
//     }

//     if (!req.user.isActive) {
//       return res.status(403).json({ success: false, message: 'Account is inactive. Contact admin.' });
//     }

//     next();
//   } catch (err) {
//     return res.status(401).json({ success: false, message: 'Token invalid or expired.' });
//   }
// };

// /**
//  * Role guard — use AFTER `protect`.
//  * Usage: authorizeRoles('admin') or authorizeRoles('admin', 'member')
//  */
// const authorizeRoles = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       return res.status(403).json({
//         success: false,
//         message: `Role '${req.user.role}' is not authorized for this action.`,
//       });
//     }
//     next();
//   };
// };

// module.exports = { protect, authorizeRoles };



const jwt  = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer '))
    token = req.headers.authorization.split(' ')[1];

  if (!token)
    return res.status(401).json({ success: false, message: 'Not authorized. No token.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user)
      return res.status(401).json({ success: false, message: 'User no longer exists.' });
    if (!req.user.isActive)
      return res.status(403).json({ success: false, message: 'Account inactive. Contact admin.' });
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Token invalid or expired.' });
  }
};

const authorizeRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role))
    return res.status(403).json({
      success: false,
      message: `Role '${req.user.role}' is not authorized.`,
    });
  next();
};

// Shorthand for admin-only routes
const adminOnly = authorizeRoles('admin');

module.exports = { protect, authorizeRoles, adminOnly };