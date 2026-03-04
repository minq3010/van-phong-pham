import jwt from "jsonwebtoken";

// It's better to store secrets in environment variables
const ACCESS_TOKEN_SECRET =
  "76ca127f19145007f2723d48ce8cbf296fb7427ac4ffe557daa38952697dabb272c181f843bccfd89065158f44470be37eca0f6e6ba9da90a107f2dc0b90164a";

// Role hierarchy: manage (cao nhất) > admin > user
const ROLES = {
  MANAGE: "manage",
  ADMIN: "admin",
  USER: "user",
};

const verifyToken = (req, res, next, allowedRoles) => {
  try {
    // Ưu tiên cookie, fallback sang Authorization header
    const token =
      req.cookies?.accessToken ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token missing in cookies",
      });
    }

    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({
            success: false,
            message: "Token expired",
          });
        } else if (err.name === "JsonWebTokenError") {
          return res.status(400).json({
            success: false,
            message: "Invalid token",
          });
        } else {
          return res.status(400).json({
            success: false,
            message: "Token verification failed",
          });
        }
      }
      if (!allowedRoles.includes(decoded.role)) {
        return res.status(403).json({
          success: false,
          message: `Access denied: Requires one of roles [${allowedRoles.join(", ")}]`,
        });
      }
      // Attach decoded user to request
      req.user = decoded;
      next();
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Middleware cho admin và manage (manage là cao nhất, có đủ quyền của admin)
export const checkout = (req, res, next) => {
  verifyToken(req, res, next, [ROLES.ADMIN, ROLES.MANAGE]);
};

// Middleware chỉ dành riêng cho manage (role cao nhất)
export const checkManage = (req, res, next) => {
  verifyToken(req, res, next, [ROLES.MANAGE]);
};

// Middleware xác thực mọi user đã đăng nhập (tất cả role)
export const checkUser = (req, res, next) => {
  verifyToken(req, res, next, [ROLES.USER, ROLES.ADMIN, ROLES.MANAGE]);
};

// Middleware kiểm tra ownership: user chỉ được truy cập data của chính mình
// admin và manage được bypass (có thể xem của bất kỳ ai)
export const checkOwner = (req, res, next) => {
  // Ưu tiên cookie, fallback sang Authorization header
  const token =
    req.cookies?.accessToken ||
    (req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access token missing in cookies",
    });
  }

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ success: false, message: "Token expired" });
      }
      return res.status(400).json({ success: false, message: "Invalid token" });
    }

    req.user = decoded;

    // admin và manage được xem tất cả
    if (decoded.role === ROLES.ADMIN || decoded.role === ROLES.MANAGE) {
      return next();
    }

    // user chỉ được xem data của chính mình — so sánh với param :userid hoặc :id
    const paramUserId = req.params.userid || req.params.id;
    if (paramUserId && decoded.id !== paramUserId) {
      return res.status(403).json({
        success: false,
        message: "Access denied: You can only access your own data",
      });
    }

    next();
  });
};
