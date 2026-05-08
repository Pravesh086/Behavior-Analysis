import jwt from "jsonwebtoken";

import { User } from "../models/index.js";
import { AppError } from "./http.js";

const createToken = (payload) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new AppError("JWT_SECRET is not configured.", 500);
  }

  return jwt.sign(payload, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new AppError("JWT_SECRET is not configured.", 500);
  }

  try {
    return jwt.verify(token, secret);
  } catch (_error) {
    throw new AppError("Invalid or expired token.", 401);
  }
};

const requireAuth = async (request, _response, next) => {
  const authHeader = request.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    throw new AppError("Authorization token is required.", 401);
  }

  const token = authHeader.slice(7);
  const payload = verifyToken(token);
  const user = await User.findById(payload.id).select("_id username role isBlocked");

  if (!user) {
    throw new AppError("Authenticated user not found.", 401);
  }

  if (user.isBlocked) {
    throw new AppError("This account has been suspended.", 403);
  }

  request.user = {
    id: user._id.toString(),
    username: user.username,
    role: user.role || "student",
  };

  next();
};

const requireRole = (...allowedRoles) => (request, _response, next) => {
  if (!request.user) {
    throw new AppError("Authentication is required.", 401);
  }

  if (!allowedRoles.includes(request.user.role)) {
    throw new AppError("You do not have permission to access this resource.", 403);
  }

  next();
};

export { createToken, requireAuth, requireRole, verifyToken };
