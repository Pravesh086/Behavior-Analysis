import { Router } from "express";

import { getQuestions, submitQuestionScores } from "../controllers/questionController.js";
import { requireAuth } from "../utils/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const surveyRouter = Router();

surveyRouter.get("/questions", asyncHandler(requireAuth), asyncHandler(getQuestions));
surveyRouter.post("/submit-scores", asyncHandler(requireAuth), asyncHandler(submitQuestionScores));

export { surveyRouter };
