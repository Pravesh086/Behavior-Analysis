import "dotenv/config";
import cors from "cors";
import express from "express";
import morgan from "morgan";

import { apiRouter } from "./routes/index.js";
import { errorHandler, notFound } from "./utils/http.js";

const app = express();

const configuredOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = new Set([
  ...configuredOrigins,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:4173",
  "http://127.0.0.1:4173",
]);

app.use((request, _response, next) => {
  console.log(
    `[request] ${request.method} ${request.originalUrl} origin=${request.headers.origin || "n/a"} host=${request.headers.host || "n/a"}`,
  );
  next();
});

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.get("/", (_request, response) => {
  response.status(200).json({
    success: true,
    message: "MERN boilerplate server is running.",
  });
});

app.use("/api/v1", apiRouter);

app.use(notFound);
app.use(errorHandler);

export { app };
