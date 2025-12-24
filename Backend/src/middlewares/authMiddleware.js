import jwt from "jsonwebtoken";

/**
 * Protect middleware — verifies JWT (cookie or Authorization header)
 * Attaches decoded payload to req.user (expected to contain { id, role, ... })
 */
export const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const tokenFromHeader = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
    const token = req.cookies?.token || tokenFromHeader;

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

/**
 * adminOnly middleware — allows only users with role === 'admin'
 */
export const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }
  return next();
};

/**
 * requireRole(role) — generic role guard
 */
export const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    if (req.user.role !== role) {
      return res.status(403).json({ message: "Access denied" });
    }
    return next();
  };
};

export default { protect, adminOnly, requireRole };