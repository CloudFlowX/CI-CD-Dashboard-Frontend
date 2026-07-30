import simpleGit from "simple-git";
import fs from "fs";
import path from "path";
import os from "os";
import { runCommand } from "../utils/command.util.js";

const git = simpleGit();

// ==============================
// Clone Repository
// ==============================
export const cloneRepository = async (
  githubUrl,
  repoName,
  branch = "main"
) => {
  try {
    // Workspace outside current project
    const workspace = path.join(os.homedir(), "cloud-workspace");

    // Create workspace if not exists
    if (!fs.existsSync(workspace)) {
      fs.mkdirSync(workspace, { recursive: true });
    }

    // Repository path
    const projectPath = path.join(workspace, repoName);

    // Delete old repository if exists
    if (fs.existsSync(projectPath)) {
      fs.rmSync(projectPath, {
        recursive: true,
        force: true,
      });
    }

    console.log(
      `📥 Cloning repository into ${projectPath} (branch: ${branch})`
    );

    // Clone with specific branch
    await git.clone(githubUrl, projectPath, [
      "--branch",
      branch,
      "--single-branch",
    ]);

    // ============================
    // Post-Clone Verification
    // ============================
    if (!fs.existsSync(projectPath)) {
      throw new Error(
        `Clone failed: directory was not created at ${projectPath}`
      );
    }

    const files = fs.readdirSync(projectPath);
    // Filter out hidden files like .git to check actual content
    const visibleFiles = files.filter((f) => !f.startsWith("."));

    if (visibleFiles.length === 0) {
      throw new Error(
        `Clone failed: repository is empty or contains no visible files. Check if the GitHub URL is correct and accessible: ${githubUrl}`
      );
    }

    console.log(
      `✅ Repository cloned successfully (${files.length} items)`
    );

    return projectPath;
  } catch (error) {
    console.error("CLONE REPOSITORY ERROR:", error);
    throw error;
  }
};

// ==============================
// Build Project
// ==============================
export const buildProject = async (
  projectPath,
  buildCommand
) => {
  try {
    // Check package.json
    const packageJsonPath = path.join(
      projectPath,
      "package.json"
    );

    if (!fs.existsSync(packageJsonPath)) {
      return {
        installLogs: "package.json not found.",
        buildLogs: "Build skipped.",
      };
    }

    console.log("📦 Installing dependencies...");

    const installLogs = await runCommand(
      "npm install",
      projectPath
    );

    let buildLogs = "No build command provided.";

    if (buildCommand && buildCommand.trim() !== "") {
      console.log(`🏗️ Running: ${buildCommand}`);

      buildLogs = await runCommand(
        buildCommand,
        projectPath
      );
    } else {
      console.log("⚠️ Build command not found. Skipping build.");
    }

    return {
      installLogs,
      buildLogs,
    };
  } catch (error) {
    console.error("BUILD PROJECT ERROR:", error);
    throw error;
  }
};