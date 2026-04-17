import { loginUser, registerUser } from "../services/authService.js";

const register = async (request, response) => {
  const result = await registerUser(request.body);

  response.status(201).json({
    success: true,
    message: "User registered successfully.",
    data: result,
  });
};

const login = async (request, response) => {
  const result = await loginUser(request.body);

  response.status(200).json({
    success: true,
    message: "Login successful.",
    data: result,
  });
};

export { login, register };
