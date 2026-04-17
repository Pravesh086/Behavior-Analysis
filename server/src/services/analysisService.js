import { SurveySubmission } from "../models/index.js";
import { loadQuestionBank } from "../utils/questionBank.js";
import { getPerformanceAnalysis } from "./performanceService.js";
import { validateScoresPayload } from "./questionService.js";

const getAreaStatus = (score) => {
  if (score < 10) {
    return "Severe weakness";
  }

  if (score <= 20) {
    return "Moderate weakness";
  }

  return "Acceptable / Strong";
};

const buildAreaScores = (answers, questionBank) =>
  questionBank.topics.map((topic) => {
    const topicAnswers = answers.filter((answer) => answer.topic === topic.title);
    const score = topicAnswers.reduce((sum, answer) => sum + answer.score, 0);
    const maxScore = topicAnswers.reduce((sum, answer) => sum + answer.maxScore, 0);

    return {
      area: topic.title,
      score,
      maxScore,
      status: getAreaStatus(score),
    };
  });

const buildWeakAreas = (areaScores) =>
  areaScores.filter((area) => area.status !== "Acceptable / Strong");

const analyzeAnswers = (answers) => {
  const questionBank = loadQuestionBank();
  const totalScore = answers.reduce((sum, answer) => sum + answer.score, 0);
  const totalMaxScore = answers.reduce((sum, answer) => sum + answer.maxScore, 0);
  const areaScores = buildAreaScores(answers, questionBank);

  return {
    totalScore,
    totalMaxScore,
    areaScores,
    weakAreas: buildWeakAreas(areaScores),
  };
};

const analyzeSavedSubmission = async (userId) => {
  const submission = await SurveySubmission.findOne({ userId });

  if (!submission) {
    return null;
  }

  const analysis = analyzeAnswers(submission.answers);
  const performanceAnalysis = await getPerformanceAnalysis(userId);

  return {
    ...analysis,
    performance_analysis: performanceAnalysis,
  };
};

const analyzeSubmissionPayload = async (userId, payload) => {
  if (payload?.scores) {
    const questionBank = loadQuestionBank();
    const answers = validateScoresPayload(payload.scores, questionBank);

    return analyzeAnswers(
      answers.map((answer) => ({
        ...answer,
        userId,
      })),
    );
  }

  return analyzeSavedSubmission(userId);
};

export { analyzeSavedSubmission, analyzeSubmissionPayload };
