import Repository from "../models/repository.model.js";

// ======================================
// Create Repository
// ======================================
export const createRepository = async (req, res) => {
  try {
    const { name, githubUrl, branch, visibility } = req.body;

    // Validate Input
    if (!name || !githubUrl) {
      return res.status(400).json({
        success: false,
        message: "Repository name and GitHub URL are required.",
      });
    }

    // Check if repository already exists for this user
    const existingRepository = await Repository.findOne({
      githubUrl,
      owner: req.user._id,
    });

    if (existingRepository) {
      return res.status(409).json({
        success: false,
        message: "Repository already exists.",
      });
    }

    // Create Repository
    const repository = await Repository.create({
      name,
      githubUrl,
      branch,
      visibility,
      owner: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Repository created successfully.",
      repository,
    });
  } catch (error) {
    console.error("CREATE REPOSITORY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get All Repositories
// ======================================
export const getRepositories = async (req, res) => {
  try {
    const repositories = await Repository.find()
      .populate("owner", "fullName email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: repositories.length,
      repositories,
    });
  } catch (error) {
    console.error("GET REPOSITORIES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ======================================
// Get Repository By ID
// ======================================
export const getRepositoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const repository = await Repository.findById(id).populate(
      "owner",
      "fullName email role"
    );

    if (!repository) {
      return res.status(404).json({
        success: false,
        message: "Repository not found.",
      });
    }

    return res.status(200).json({
      success: true,
      repository,
    });
  } catch (error) {
    console.error("GET REPOSITORY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ======================================
// Update Repository
// ======================================
export const updateRepository = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, githubUrl, branch, visibility, status } = req.body;

    const repository = await Repository.findById(id);

    if (!repository) {
      return res.status(404).json({
        success: false,
        message: "Repository not found.",
      });
    }

    repository.name = name || repository.name;
    repository.githubUrl = githubUrl || repository.githubUrl;
    repository.branch = branch || repository.branch;
    repository.visibility = visibility || repository.visibility;
    repository.status = status || repository.status;

    await repository.save();

    return res.status(200).json({
      success: true,
      message: "Repository updated successfully.",
      repository,
    });
  } catch (error) {
    console.error("UPDATE REPOSITORY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ======================================
// Delete Repository
// ======================================
export const deleteRepository = async (req, res) => {
  try {
    const { id } = req.params;

    const repository = await Repository.findById(id);

    if (!repository) {
      return res.status(404).json({
        success: false,
        message: "Repository not found.",
      });
    }

    await repository.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Repository deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE REPOSITORY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};