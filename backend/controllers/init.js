const fs = require("fs").promises;
const path = require("path");

async function initRepo(repoName) {
  const repoPath = path.resolve(process.cwd(), ".vcsGit");
  const commitsPath = path.join(repoPath, "commits");
  const stagingPath = path.join(repoPath, "staging");

  try {
    await fs.mkdir(repoPath, { recursive: true });
    await fs.mkdir(commitsPath, { recursive: true });
    await fs.mkdir(stagingPath, { recursive: true });

    await fs.writeFile(
      path.join(repoPath, "config.json"),
      JSON.stringify(
        {
          storage: "supabase",
          bucket: "codechronicle",
          repoName: repoName,
        },
        null,
        2
      )
    );

    console.log(`Repository '${repoName}' initialized successfully.`);
  } catch (err) {
    console.error("Error occurred during initialization:", err.message);
  }
}

module.exports = { initRepo };
