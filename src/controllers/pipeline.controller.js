import Pipeline from "../models/pipeline.model.js";
import Repository from "../models/repository.model.js";
import {
  cloneRepository,
  buildProject,
} from "../services/pipeline.service.js";

// ======================================
// Create Pipeline
// ======================================
export const createPipeline = async (req, res) => {
  try {
    const {
      name,
      repository,
      branch,
      buildCommand,
      dockerfilePath,
      environment,
      deploymentTarget,
    } = req.body;

    if (!name || !repository) {
      return res.status(400).json({
        success: false,
        message: "Pipeline name and repository are required.",
      });
    }

    const repo = await Repository.findById(repository);

    if (!repo) {
      return res.status(404).json({
        success: false,
        message: "Repository not found.",
      });
    }

    const pipeline = await Pipeline.create({
      name,
      repository,
      branch,
      buildCommand,
      dockerfilePath,
      environment,
      deploymentTarget,
      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Pipeline created successfully.",
      pipeline,
    });
  } catch (error) {
    console.error("CREATE PIPELINE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get All Pipelines
// ======================================
export const getAllPipelines = async (req, res) => {
  try {
    const pipelines = await Pipeline.find()
      .populate("repository", "name githubUrl branch")
      .populate("createdBy", "fullName email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: pipelines.length,
      pipelines,
    });
  } catch (error) {
    console.error("GET PIPELINES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get Pipeline By ID
// ======================================
export const getPipelineById = async (req, res) => {
  try {
    const { id } = req.params;

    const pipeline = await Pipeline.findById(id)
      .populate("repository", "name githubUrl branch")
      .populate("createdBy", "fullName email role");

    if (!pipeline) {
      return res.status(404).json({
        success: false,
        message: "Pipeline not found.",
      });
    }

    return res.status(200).json({
      success: true,
      pipeline,
    });
  } catch (error) {
    console.error("GET PIPELINE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Update Pipeline
// ======================================
export const updatePipeline = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      branch,
      buildCommand,
      dockerfilePath,
      environment,
      deploymentTarget,
      status,
    } = req.body;

    const pipeline = await Pipeline.findById(id);

    if (!pipeline) {
      return res.status(404).json({
        success: false,
        message: "Pipeline not found.",
      });
    }

    pipeline.name = name || pipeline.name;
    pipeline.branch = branch || pipeline.branch;
    pipeline.buildCommand = buildCommand || pipeline.buildCommand;
    pipeline.dockerfilePath =
      dockerfilePath || pipeline.dockerfilePath;
    pipeline.environment =
      environment || pipeline.environment;
    pipeline.deploymentTarget =
      deploymentTarget || pipeline.deploymentTarget;
    pipeline.status = status || pipeline.status;

    await pipeline.save();

    return res.status(200).json({
      success: true,
      message: "Pipeline updated successfully.",
      pipeline,
    });
  } catch (error) {
    console.error("UPDATE PIPELINE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Delete Pipeline
// ======================================
export const deletePipeline = async (req, res) => {
  try {
    const { id } = req.params;

    const pipeline = await Pipeline.findById(id);

    if (!pipeline) {
      return res.status(404).json({
        success: false,
        message: "Pipeline not found.",
      });
    }

    await pipeline.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Pipeline deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE PIPELINE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Trigger Pipeline
// ======================================
export const triggerPipeline = async (req, res) => {
  try {
    const { id } = req.params;

    // Find Pipeline
    const pipeline = await Pipeline.findById(id);

    if (!pipeline) {
      return res.status(404).json({
        success: false,
        message: "Pipeline not found.",
      });
    }

    // Find Repository
    const repository = await Repository.findById(
      pipeline.repository
    );

    if (!repository) {
      return res.status(404).json({
        success: false,
        message: "Repository not found.",
      });
    }

    // Update status to running
    pipeline.status = "running";
    await pipeline.save();

    // Clone GitHub Repository (use pipeline branch, fallback to repo branch)
    const branchToClone =
      pipeline.branch || repository.branch || "main";

    const projectPath = await cloneRepository(
      repository.githubUrl,
      repository.name,
      branchToClone
    );

    // ===========================
    // Build Project
    // ===========================
    const logs = await buildProject(
      projectPath,
      pipeline.buildCommand
    );

    // ===========================
    // Update Status
    // ===========================
    pipeline.status = "success";
    await pipeline.save();

    return res.status(200).json({
      success: true,
      message: "Pipeline executed successfully.",
      projectPath,
      logs,
    });
  } catch (error) {
    console.error("TRIGGER PIPELINE ERROR:", error);

    // Mark pipeline as failed if it was found
    try {
      const failedPipeline = await Pipeline.findById(
        req.params.id
      );
      if (failedPipeline && failedPipeline.status === "running") {
        failedPipeline.status = "failed";
        await failedPipeline.save();
      }
    } catch (saveError) {
      console.error("FAILED TO UPDATE PIPELINE STATUS:", saveError);
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};