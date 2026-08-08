import express from "express";

// ==============================
// Controllers
// ==============================
import {
  createRepository,
  getRepositories,
  getRepositoryById,
  updateRepository,
  deleteRepository,
} from "../controllers/repository.controller.js";

// ==============================
// Middlewares
// ==============================
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = express.Router();

/* =====================================================
   Create Repository
   URL : POST /api/v1/repositories
   Access : Admin, Developer
===================================================== */
router.post(
  "/",
  protect,
  authorize("admin", "developer"),
  createRepository
);

/* =====================================================
   Get All Repositories
   URL : GET /api/v1/repositories
   Access : Admin, Developer, Viewer
===================================================== */
router.get(
  "/",
  protect,
  authorize("admin", "developer", "viewer"),
  getRepositories
);

/* =====================================================
   Get Repository By ID
   URL : GET /api/v1/repositories/:id
   Access : Admin, Developer, Viewer
===================================================== */
router.get(
  "/:id",
  protect,
  authorize("admin", "developer", "viewer"),
  getRepositoryById
);

/* =====================================================
   Update Repository
   URL : PUT /api/v1/repositories/:id
   Access : Admin, Developer
===================================================== */
router.put(
  "/:id",
  protect,
  authorize("admin", "developer"),
  updateRepository
);

/* =====================================================
   Delete Repository
   URL : DELETE /api/v1/repositories/:id
   Access : Admin
===================================================== */
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteRepository
);

export default router;