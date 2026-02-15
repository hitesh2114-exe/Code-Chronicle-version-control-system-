const fs = require("fs").promises;
const path = require("path");
const supabase = require("../config/supabase");

async function pushRepo() {
  const repoPath = path.resolve(process.cwd(), ".vcsGit");
  const commitsPath = path.join(repoPath, "commits");

  try {
    const config = JSON.parse(
      await fs.readFile(path.join(repoPath, "config.json"))
    );

    const repoName = config.repoName;

    const commitDirs = await fs.readdir(commitsPath);

    for (const commitDir of commitDirs) {
      const commitPath = path.join(commitsPath, commitDir);
      const stat = await fs.stat(commitPath);

      if (stat.isDirectory()) {
        const files = await fs.readdir(commitPath);

        for (const file of files) {
          const filePath = path.join(commitPath, file);
          const fileContent = await fs.readFile(filePath);

          const { error } = await supabase.storage
            .from("codechronicle")
            .upload(
              `repos/${repoName}/commits/${commitDir}/${file}`,
              fileContent,
              { upsert: true }
            );

          if (error) {
            console.error("Upload failed:", error.message);
            return;
          }

          console.log(
            `Uploaded: repos/${repoName}/commits/${commitDir}/${file}`
          );
        }
      }
    }

    console.log("All commits pushed successfully to Supabase Storage.");
  } catch (err) {
    console.error("Error pushing commits:", err.message);
  }
}

module.exports = { pushRepo };
