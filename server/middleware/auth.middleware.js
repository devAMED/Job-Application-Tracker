const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Token must exist
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // decoded contains { id, role, iat, exp }
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next(); // continue to route
  } catch (error) {
    return res.status(401).json({ message: "Token is invalid" });
  }
};

module.exports = authMiddleware;