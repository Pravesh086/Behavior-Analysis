import { RECOMMENDATION_CONFIG } from "../config/recommendationConfig.js";
import { SurveySubmission } from "../models/index.js";
import { loadQuestionBank } from "../utils/questionBank.js";
import { analyzeSavedSubmission } from "./analysisService.js";

const getIssueKey = (status) => {
  if (status === "Severe weakness") {
    return "Severe";
  }

  if (status === "Moderate weakness") {
    return "Moderate";
  }

  return "Strong";
};

const buildOverrideRecommendations = (area, issueKey) =>
  RECOMMENDATION_CONFIG.overrides?.[area]?.[issueKey]?.filter(Boolean) || [];

const buildDerivedRecommendations = (answers, count) =>
  answers
    .sort((left, right) => left.score - right.score || left.questionId - right.questionId)
    .slice(0, count)
    .map((answer) => answer.guidance);

const getRecommendationsForArea = (submission, areaScore, questionBank) => {
  const issueKey = getIssueKey(areaScore.status);

  if (issueKey === "Strong") {
    return null;
  }

  const overrideRecommendations = buildOverrideRecommendations(areaScore.area, issueKey);
  if (overrideRecommendations.length > 0) {
    return {
      area: areaScore.area,
      issueLevel: areaScore.status,
      recommendations: overrideRecommendations,
    };
  }

  const recommendationCount = RECOMMENDATION_CONFIG.defaults[issueKey]?.recommendationCount || 3;
  const questionMap = new Map(questionBank.questions.map((question) => [question.id, question]));
  const areaAnswers = submission.answers
    .filter((answer) => answer.topic === areaScore.area)
    .map((answer) => ({
      ...answer,
      guidance: questionMap.get(answer.questionId)?.guidance || "",
    }))
    .filter((answer) => answer.guidance);

  return {
    area: areaScore.area,
    issueLevel: areaScore.status,
    recommendations: buildDerivedRecommendations(areaAnswers, recommendationCount),
  };
};

const getRecommendationsForUser = async (userId) => {
  const submission = await SurveySubmission.findOne({ userId });

  if (!submission) {
    return [];
  }

  const analysis = await analyzeSavedSubmission(userId);
  if (!analysis) {
    return [];
  }

  const questionBank = loadQuestionBank();
  const recommendations = analysis.weakAreas
    .map((areaScore) => getRecommendationsForArea(submission, areaScore, questionBank))
    .filter(Boolean);

  return recommendations;
};

export { getRecommendationsForUser };
