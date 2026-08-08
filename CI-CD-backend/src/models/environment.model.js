import mongoose from "mongoose";

const environmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    provider: {
      type: String,
      enum: ["AWS", "GCP", "Azure", "On-Premise", "Local"],
      default: "AWS",
    },
    region: {
      type: String,
      required: true,
      default: "us-east-1",
    },
    status: {
      type: String,
      enum: ["Healthy", "Degraded", "Offline"],
      default: "Healthy",
    },
    servicesCount: {
      type: Number,
      default: 0,
    },
    cpuUsage: {
      type: Number,
      default: 0,
    },
    memUsage: {
      type: Number,
      default: 0,
    },
    lastDeployment: {
      type: String,
      default: "N/A",
    },
    deploymentStatus: {
      type: String,
      default: "No Deployments",
    },
    clusterName: {
      type: String,
      default: "",
    },
    instances: {
      type: String,
      default: "0 nodes",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Environment", environmentSchema);
