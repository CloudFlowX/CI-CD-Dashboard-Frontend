import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import {
  getEnvironments,
  createEnvironment,
  getEnvVars,
  createEnvVar,
} from "../controllers/environment.controller.js";

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);

// All roles can view, but only admin and developer can create
router
  .route("/")
  .get(authorize("admin", "developer", "viewer"), getEnvironments)
  .post(authorize("admin", "developer"), createEnvironment);

router
  .route("/vars")
  .get(authorize("admin", "developer", "viewer"), getEnvVars)
  .post(authorize("admin", "developer"), createEnvVar);

export default router;
