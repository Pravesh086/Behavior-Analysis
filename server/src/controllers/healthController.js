import { getHealthStatus } from "../services/healthService.js";

const getHealth = (_request, response) => {
  const payload = getHealthStatus();

  response.status(200).json(payload);
};

export { getHealth };
