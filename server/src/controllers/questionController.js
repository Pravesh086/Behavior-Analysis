import { getQuestionsForUser, submitScores } from "../services/questionService.js";

const getQuestions = async (request, response) => {
  const result = await getQuestionsForUser(request.user.id);

  response.status(200).json({
    success: true,
    message: "Questions fetched successfully.",
    data: result,
  });
};

const submitQuestionScores = async (request, response) => {
  const result = await submitScores(request.user.id, request.body);

  response.status(200).json({
    success: true,
    message: "Scores submitted successfully.",
    data: result,
  });
};

export { getQuestions, submitQuestionScores };
