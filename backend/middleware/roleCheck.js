export const checkAdmin = (req, res, next) => {
  if (req.userRole !== 'Admin') {
    return res.status(403).json({ message: 'Access denied. Admin role required.' });
  }
  next();
};

export const checkMember = (req, res, next) => {
  if (req.userRole !== 'Member' && req.userRole !== 'Admin') {
    return res.status(403).json({ message: 'Access denied. Member role required.' });
  }
  next();
};
