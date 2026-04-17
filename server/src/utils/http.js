class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
  }
}

const notFound = (request, response, next) => {
  const error = new AppError(`Route not found: ${request.originalUrl}`, 404);
  next(error);
};

const errorHandler = (error, _request, response, _next) => {
  const statusCode = error.statusCode || 500;

  response.status(statusCode).json({
    success: false,
    message: error.message || "Internal server error.",
  });
};

export { AppError, errorHandler, notFound };
