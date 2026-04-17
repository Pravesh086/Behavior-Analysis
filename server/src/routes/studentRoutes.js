import { Router } from "express";

import { getStudentProfile, upsertStudentProfile } from "../controllers/studentController.js";
import { requireAuth } from "../utils/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const studentRouter = Router();

studentRouter.use(asyncHandler(requireAuth));
studentRouter.post("/profile", asyncHandler(upsertStudentProfile));
studentRouter.get("/profile", asyncHandler(getStudentProfile));

export { studentRouter };
