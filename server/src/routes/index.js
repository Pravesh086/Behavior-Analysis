import { Router } from "express";

import { analysisRouter } from "./analysisRoutes.js";
import { adminRouter } from "./adminRoutes.js";
import { authRouter } from "./authRoutes.js";
import { healthRouter } from "./healthRoutes.js";
import { recommendationRouter } from "./recommendationRoutes.js";
import { reportRouter } from "./reportRoutes.js";
import { studentRouter } from "./studentRoutes.js";
import { surveyRouter } from "./surveyRoutes.js";

const apiRouter = Router();

apiRouter.use("/", analysisRouter);
apiRouter.use("/admin", adminRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/health", healthRouter);
apiRouter.use("/", recommendationRouter);
apiRouter.use("/", reportRouter);
apiRouter.use("/student", studentRouter);
apiRouter.use("/", surveyRouter);

export { apiRouter };
