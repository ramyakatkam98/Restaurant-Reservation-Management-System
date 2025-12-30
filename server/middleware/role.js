module.exports = function role(allowedRoles = []) {
  // allowedRoles can be ['admin'] or ['user','admin']
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
    if (!allowedRoles.includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
    next();
  };
};
