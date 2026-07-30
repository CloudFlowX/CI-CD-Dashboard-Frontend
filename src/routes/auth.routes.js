import express from "express";
import {
  register,
  login,
  getProfile,
} from "../controllers/auth.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = express.Router();

// ==========================
// Public Routes
// ==========================

// Register User
router.post("/register", register);

// Login User
router.post("/login", login);

// ==========================
// Protected Routes
// ==========================

// Logged-in User Profile
router.get("/profile", protect, getProfile);

// ==========================
// Role-Based Access Control
// ==========================

// Admin Only
router.get("/admin", protect, authorize("admin"), (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome Admin",
    user: req.user,
  });
});

// Admin + Developer
router.get(
  "/developer",
  protect,
  authorize("admin", "developer"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome Developer",
      user: req.user,
    });
  }
);

// Admin + Developer + Viewer
router.get(
  "/viewer",
  protect,
  authorize("admin", "developer", "viewer"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome Viewer",
      user: req.user,
    });
  }
);

export default router;