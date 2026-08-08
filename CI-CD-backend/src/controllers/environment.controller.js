import logger from "../config/logger.js";
import Environment from "../models/environment.model.js";
import EnvVar from "../models/envVar.model.js";

// ======================================
// Get All Environments
// ======================================
export const getEnvironments = async (req, res) => {
  try {
    const environments = await Environment.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: environments.length,
      environments,
    });
  } catch (error) {
    logger.error("GET ENVIRONMENTS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Create Environment
// ======================================
export const createEnvironment = async (req, res) => {
  try {
    const { name, provider, region, clusterName } = req.body;

    if (!name || !region) {
      return res.status(400).json({
        success: false,
        message: "Environment name and region are required.",
      });
    }

    const environment = await Environment.create({
      name,
      provider: provider || "AWS",
      region,
      clusterName: clusterName || "",
      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Environment created successfully.",
      environment,
    });
  } catch (error) {
    logger.error("CREATE ENVIRONMENT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get Env Vars
// ======================================
export const getEnvVars = async (req, res) => {
  try {
    const envVars = await EnvVar.find().populate("environment", "name");

    return res.status(200).json({
      success: true,
      count: envVars.length,
      envVars,
    });
  } catch (error) {
    logger.error("GET ENV VARS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Create Env Var
// ======================================
export const createEnvVar = async (req, res) => {
  try {
    const { environmentId, key, value, scope, masked } = req.body;

    if (!environmentId || !key || !value) {
      return res.status(400).json({
        success: false,
        message: "Environment, key, and value are required.",
      });
    }

    const envVar = await EnvVar.create({
      environment: environmentId,
      key,
      value,
      scope: scope || "Local",
      masked: masked || false,
      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Environment variable created successfully.",
      envVar,
    });
  } catch (error) {
    logger.error("CREATE ENV VAR ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
