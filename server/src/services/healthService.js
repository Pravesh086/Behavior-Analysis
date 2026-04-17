const getHealthStatus = () => ({
  success: true,
  message: "API is healthy.",
  timestamp: new Date().toISOString(),
});

export { getHealthStatus };
