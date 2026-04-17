import { getRecommendationsForUser } from "../services/recommendationService.js";

const getRecommendations = async (request, response) => {
  const result = await getRecommendationsForUser(request.user.id);

  response.status(200).json({
    success: true,
    message: result.length ? "Recommendations fetched successfully." : "No recommendations available yet.",
    data: result,
  });
};

export { getRecommendations };
