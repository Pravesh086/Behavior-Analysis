import { Router } from "express";

import { analyzeSurvey } from "../controllers/analysisController.js";
import { requireAuth } from "../utils/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const analysisRouter = Router();

analysisRouter.post("/analyze", asyncHandler(requireAuth), asyncHandler(analyzeSurvey));

export { analysisRouter };
