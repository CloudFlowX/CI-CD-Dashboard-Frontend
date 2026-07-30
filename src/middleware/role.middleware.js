export const authorize = (...roles) => {
  return (req, res, next) => {
    // Check user exists
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Check role
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access Denied",
      });
    }

    next();
  };
};