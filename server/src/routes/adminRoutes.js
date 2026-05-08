import { Router } from "express";

import {
  getLeaderboard,
  getStats,
  getStudentDetails,
  listStudents,
  removeSubmission,
  updateUserBlockStatus,
} from "../controllers/adminController.js";
import { requireAuth, requireRole } from "../utils/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const adminRouter = Router();

adminRouter.use(asyncHandler(requireAuth));
adminRouter.use(asyncHandler(requireRole("admin")));

adminRouter.get("/students", asyncHandler(listStudents));
adminRouter.get("/students/:userId", asyncHandler(getStudentDetails));
adminRouter.get("/stats", asyncHandler(getStats));
adminRouter.get("/leaderboard", asyncHandler(getLeaderboard));
adminRouter.delete("/submissions/:submissionId", asyncHandler(removeSubmission));
adminRouter.patch("/users/:userId/block", asyncHandler(updateUserBlockStatus));

export { adminRouter };
