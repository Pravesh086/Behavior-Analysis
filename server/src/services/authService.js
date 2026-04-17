import bcrypt from "bcryptjs";

import { User } from "../models/index.js";
import { createToken } from "../utils/auth.js";
import { AppError } from "../utils/http.js";

const sanitizeUser = (user) => ({
  id: user._id.toString(),
  username: user.username,
});

const registerUser = async ({ username, password }) => {
  if (!username || !password) {
    throw new AppError("Username and password are required.", 400);
  }

  const normalizedUsername = username.trim().toLowerCase();
  const existingUser = await User.findOne({ username: normalizedUsername });

  if (existingUser) {
    throw new AppError("Username is already taken.", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    username: normalizedUsername,
    password: hashedPassword,
  });

  const token = createToken({ id: user._id.toString(), username: user.username });

  return {
    token,
    user: sanitizeUser(user),
  };
};

const loginUser = async ({ username, password }) => {
  if (!username || !password) {
    throw new AppError("Username and password are required.", 400);
  }

  const normalizedUsername = username.trim().toLowerCase();
  const user = await User.findOne({ username: normalizedUsername });

  if (!user) {
    throw new AppError("Invalid username or password.", 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError("Invalid username or password.", 401);
  }

  const token = createToken({ id: user._id.toString(), username: user.username });

  return {
    token,
    user: sanitizeUser(user),
  };
};

export { loginUser, registerUser };
