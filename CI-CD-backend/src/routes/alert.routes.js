import express from "express";
import { getAlerts, updateAlertStatus, deleteAlert } from "../controllers/alert.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = express.Router();

router.use(protect);

router.route("/")
  .get(getAlerts);

router.route("/:id")
  .put(authorize("admin", "developer"), updateAlertStatus)
  .delete(authorize("admin"), deleteAlert);

export default router;
