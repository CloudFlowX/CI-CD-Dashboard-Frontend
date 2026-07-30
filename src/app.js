import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./routes/auth.routes.js";
import repositoryRoutes from "./routes/repository.routes.js";
import pipelineRoutes from "./routes/pipeline.routes.js";


const app = express();

// ==========================
// Middlewares
// ==========================
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================
// API Routes
// ==========================

// Authentication Routes
app.use("/api/v1/auth", authRoutes);

// Repository Routes
app.use("/api/v1/repositories", repositoryRoutes);

// Pipeline Routes
app.use("/api/v1/pipelines", pipelineRoutes);

// ==========================
// Health Check Route
// ==========================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Cloud Orchestrator API Running 🚀",
  });
});

export default app;