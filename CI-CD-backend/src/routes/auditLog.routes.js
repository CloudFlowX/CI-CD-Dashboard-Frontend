import express from "express";
import { getAuditLogs } from "../controllers/auditLog.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = express.Router();

router.use(protect);
router.use(authorize("admin", "developer")); // Only admin/developer can view audit logs

router.route("/").get(getAuditLogs);

export default router;
