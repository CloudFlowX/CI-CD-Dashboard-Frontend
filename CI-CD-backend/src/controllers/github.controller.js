import logger from "../config/logger.js";
import axios from "axios";

export const getGitHubActionsRuns = async (req, res) => {
  try {
    const token = process.env.GITHUB_TOKEN;
    const defaultRepo = process.env.GITHUB_DEFAULT_REPO || "kunalkumar563/Cloud-Orchestrator-Updated";

    if (!token) {
      // Fallback to mock if no token configured
      logger.warn("GITHUB_TOKEN not found in env, using mock data for GitHub runs");
      return res.status(200).json({
        success: true,
        runs: getMockRuns()
      });
    }

    // Call real GitHub API
    const response = await axios.get(
      `https://api.github.com/repos/${defaultRepo}/actions/runs`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json"
        },
        params: {
          per_page: 10
        }
      }
    );

    res.status(200).json({
      success: true,
      runs: response.data.workflow_runs
    });
  } catch (error) {
    logger.error("GitHub API Error:", error.response?.data || error.message);
    // Fallback on failure
    res.status(200).json({
      success: true,
      runs: getMockRuns(),
      error: error.message
    });
  }
};

export const triggerGitHubAction = async (req, res) => {
  try {
    const { repo, workflow_id, ref } = req.body;
    const token = process.env.GITHUB_TOKEN;

    if (!token) {
      logger.warn("GITHUB_TOKEN not found in env, mocking trigger");
      return res.status(200).json({
        success: true,
        message: `Workflow ${workflow_id} triggered successfully on ${repo} (${ref}) [MOCKED]`
      });
    }

    await axios.post(
      `https://api.github.com/repos/${repo}/actions/workflows/${workflow_id}/dispatches`,
      { ref },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json"
        }
      }
    );

    res.status(200).json({
      success: true,
      message: `Workflow ${workflow_id} triggered successfully on ${repo} (${ref})`
    });
  } catch (error) {
    logger.error("GitHub Trigger Error:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || error.message || "Failed to trigger GitHub Action"
    });
  }
};

function getMockRuns() {
  return [
    {
      id: 1001,
      name: "CI/CD Pipeline",
      head_branch: "main",
      status: "completed",
      conclusion: "success",
      event: "push",
      created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      updated_at: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
      actor: { login: "kunal24" },
      repository: { name: "cloud-orchestrator", full_name: "kunal24/cloud-orchestrator" }
    },
    {
      id: 1002,
      name: "Security Scan",
      head_branch: "develop",
      status: "completed",
      conclusion: "failure",
      event: "pull_request",
      created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      updated_at: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
      actor: { login: "dependabot" },
      repository: { name: "ecommerce-api", full_name: "ecommerce/ecommerce-api" }
    },
    {
      id: 1003,
      name: "Deploy to EKS",
      head_branch: "release/v2",
      status: "in_progress",
      conclusion: null,
      event: "workflow_dispatch",
      created_at: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      updated_at: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      actor: { login: "admin" },
      repository: { name: "frontend-web", full_name: "ecommerce/frontend-web" }
    }
  ];
}
