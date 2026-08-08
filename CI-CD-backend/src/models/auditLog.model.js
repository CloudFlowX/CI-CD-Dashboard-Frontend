import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resource: {
      type: String,
      required: true,
    },
    resourceId: {
      type: String,
    },
    details: {
      type: String,
    },
    status: {
      type: String,
      enum: ["success", "failed", "warning"],
      default: "success",
    },
    ipAddress: {
      type: String,
      default: "127.0.0.1",
    }
  },
  { timestamps: true }
);

export default mongoose.model("AuditLog", auditLogSchema);
