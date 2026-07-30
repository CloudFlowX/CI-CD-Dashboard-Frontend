import mongoose from "mongoose";

const repositorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    githubUrl: {
      type: String,
      required: true,
      trim: true,
    },

    branch: {
      type: String,
      default: "main",
    },

    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "private",
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Repository = mongoose.model("Repository", repositorySchema);

export default Repository;