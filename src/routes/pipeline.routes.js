import express from "express";

import {
  createPipeline,
  getAllPipelines,
  getPipelineById,
  updatePipeline,
  deletePipeline,
  triggerPipeline,
} from "../controllers/pipeline.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = express.Router();

/* =====================================================
   Create Pipeline
===================================================== */
router.post(
  "/",
  protect,
  authorize("admin", "developer"),
  createPipeline
);

/* =====================================================
   Get All Pipelines
===================================================== */
router.get(
  "/",
  protect,
  authorize("admin", "developer", "viewer"),
  getAllPipelines
);

/* =====================================================
   Get Pipeline By ID
===================================================== */

router.get(
  "/:id",
  protect,
  authorize("admin", "developer", "viewer"),
  getPipelineById
);

/* =====================================================
   Update Pipeline
===================================================== */

router.put(
  "/:id",
  protect,
  authorize("admin", "developer"),
  updatePipeline
);

/* =====================================================
   Delete Pipeline
===================================================== */

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deletePipeline
);

/* =====================================================
    Trigger Pipeline
===================================================== */

router.post(
  "/:id/trigger",
  protect,
  authorize("admin", "developer"),
  triggerPipeline
);
export default router;