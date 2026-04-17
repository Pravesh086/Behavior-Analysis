import { Router } from "express";

import { downloadReport } from "../controllers/reportController.js";
import { requireAuth } from "../utils/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const reportRouter = Router();

reportRouter.get("/download-report", asyncHandler(requireAuth), asyncHandler(downloadReport));

export { reportRouter };
