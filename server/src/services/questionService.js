import { SurveySubmission } from "../models/index.js";
import { AppError } from "../utils/http.js";
import { loadQuestionBank } from "../utils/questionBank.js";

const buildScoreMap = (submission) => {
  if (!submission) {
    return {};
  }

  return Object.fromEntries(submission.answers.map((answer) => [String(answer.questionId), answer.score]));
};

const getQuestionsForUser = async (userId) => {
  const questionBank = loadQuestionBank();
  const submission = await SurveySubmission.findOne({ userId });

  return {
    totalQuestions: questionBank.totalQuestions,
    totalTopics: questionBank.totalTopics,
    topics: questionBank.topics,
    existingScores: buildScoreMap(submission),
    answeredCount: submission?.answers.length || 0,
    submittedAt: submission?.updatedAt?.toISOString() || null,
  };
};

const validateScoresPayload = (scores, questionBank) => {
  if (!scores || Array.isArray(scores) || typeof scores !== "object") {
    throw new AppError("scores must be an object keyed by question id.", 400);
  }

  const questionIds = new Set(questionBank.questions.map((question) => String(question.id)));
  const submittedIds = Object.keys(scores);

  for (const submittedId of submittedIds) {
    if (!questionIds.has(submittedId)) {
      throw new AppError(`Unknown question id: ${submittedId}`, 400);
    }
  }

  const missingIds = questionBank.questions
    .map((question) => String(question.id))
    .filter((questionId) => !(questionId in scores));

  if (missingIds.length > 0) {
    throw new AppError(`All 105 questions must be answered before submission. Missing: ${missingIds.length}`, 400);
  }

  return questionBank.questions.map((question) => {
    const rawScore = scores[String(question.id)];
    const score = Number(rawScore);

    if (!Number.isInteger(score) || score < 1 || score > 5) {
      throw new AppError(`Question ${question.id} must have an integer score between 1 and 5.`, 400);
    }

    return {
      questionId: question.id,
      question: question.text,
      topic: question.topic,
      score,
      maxScore: question.maxScore,
    };
  });
};

const submitScores = async (userId, payload) => {
  const questionBank = loadQuestionBank();
  const answers = validateScoresPayload(payload.scores, questionBank);
  const totalScore = answers.reduce((sum, answer) => sum + answer.score, 0);
  const averageScore = Number((totalScore / answers.length).toFixed(2));

  const submission = await SurveySubmission.findOneAndUpdate(
    { userId },
    {
      userId,
      answers,
      totalScore,
      averageScore,
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    },
  );

  return {
    totalQuestions: answers.length,
    totalScore: submission.totalScore,
    averageScore: submission.averageScore,
    submittedAt: submission.updatedAt.toISOString(),
  };
};

export { getQuestionsForUser, submitScores, validateScoresPayload };
