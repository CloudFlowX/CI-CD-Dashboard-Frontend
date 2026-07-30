import { exec } from "child_process";

export const runCommand = (command, cwd) => {
  return new Promise((resolve, reject) => {

    exec(
      command,
      { cwd },

      (error, stdout, stderr) => {

        if (error) {
          return reject(stderr || error.message);
        }

        resolve(stdout);
      }

    );

  });
};