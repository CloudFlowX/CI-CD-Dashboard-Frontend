import Alert from "../models/alert.model.js";
import logger from "../config/logger.js";

// ======================================
// Get All Alerts
// ======================================
export const getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find()
      .populate("assignee", "fullName email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      alerts,
    });
  } catch (error) {
    logger.error("GET ALERTS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Update Alert Status
// ======================================
export const updateAlertStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, assignee } = req.body;

    const alert = await Alert.findById(id);
    if (!alert) {
      return res.status(404).json({ success: false, message: "Alert not found" });
    }

    if (status) alert.status = status;
    if (assignee) alert.assignee = assignee;

    await alert.save();

    return res.status(200).json({
      success: true,
      alert,
    });
  } catch (error) {
    logger.error("UPDATE ALERT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Delete Alert
// ======================================
export const deleteAlert = async (req, res) => {
  try {
    const { id } = req.params;
    const alert = await Alert.findByIdAndDelete(id);

    if (!alert) {
      return res.status(404).json({ success: false, message: "Alert not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Alert deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
