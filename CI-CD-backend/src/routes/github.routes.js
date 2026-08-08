import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import { getGitHubActionsRuns, triggerGitHubAction } from "../controllers/github.controller.js";

const router = express.Router();

router.get("/runs", protect, authorize("admin", "developer", "viewer"), getGitHubActionsRuns);
router.post("/trigger", protect, authorize("admin", "developer"), triggerGitHubAction);

export default router;
