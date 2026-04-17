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
  const user = await User.findById(payload.id).select("_id username");

  if (!user) {
    throw new AppError("Authenticated user not found.", 401);
  }

  request.user = {
    id: user._id.toString(),
    username: user.username,
  };

  next();
};

export { createToken, requireAuth, verifyToken };
