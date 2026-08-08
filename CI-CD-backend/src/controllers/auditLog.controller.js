import AuditLog from "../models/auditLog.model.js";
import logger from "../config/logger.js";

// ======================================
// Get All Audit Logs
// ======================================
export const getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate("user", "fullName email role")
      .sort({ createdAt: -1 })
      .limit(100);

    return res.status(200).json({
      success: true,
      logs,
    });
  } catch (error) {
    logger.error("GET AUDIT LOGS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Helper to create an Audit Log
// ======================================
export const createAuditLog = async ({ action, user, resource, resourceId, details, status, ipAddress }) => {
  try {
    await AuditLog.create({
      action,
      user,
      resource,
      resourceId,
      details,
      status,
      ipAddress
    });
  } catch (error) {
    logger.error("CREATE AUDIT LOG ERROR:", error);
  }
};
