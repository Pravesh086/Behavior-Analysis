import { analyzeSubmissionPayload } from "../services/analysisService.js";

const analyzeSurvey = async (request, response) => {
  const result = await analyzeSubmissionPayload(request.user.id, request.body);

  response.status(200).json({
    success: true,
    message: result ? "Survey analyzed successfully." : "No submitted scores found for analysis yet.",
    data: result,
  });
};

export { analyzeSurvey };
