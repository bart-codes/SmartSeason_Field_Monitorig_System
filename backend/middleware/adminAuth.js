const adminAuth = (req, res, next) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Only admins can perform this action' });
  }
  next();
};

module.exports = adminAuth;
