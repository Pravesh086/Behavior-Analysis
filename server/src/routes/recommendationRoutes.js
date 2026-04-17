import { Router } from "express";

import { getRecommendations } from "../controllers/recommendationController.js";
import { requireAuth } from "../utils/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const recommendationRouter = Router();

recommendationRouter.get("/recommendations", asyncHandler(requireAuth), asyncHandler(getRecommendations));

export { recommendationRouter };
