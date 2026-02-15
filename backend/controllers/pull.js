const fs = require("fs").promises;
const path = require("path");
const supabase = require("../config/supabase");

async function pullRepo() {
  const repoPath = path.resolve(process.cwd(), ".vcsGit");
  const commitsPath = path.join(repoPath, "commits");

  try {
    const config = JSON.parse(
      await fs.readFile(path.join(repoPath, "config.json"))
    );

    const repoName = config.repoName;

    const { data: commitFolders, error: listError } =
      await supabase.storage
        .from("codechronicle")
        .list(`repos/${repoName}/commits`);

    if (listError) {
      console.error("Error listing commits:", listError.message);
      return;
    }

    for (const folder of commitFolders) {
      const commitID = folder.name;

      const { data: files, error: filesError } =
        await supabase.storage
          .from("codechronicle")
          .list(`repos/${repoName}/commits/${commitID}`);

      if (filesError) {
        console.error("Error listing files:", filesError.message);
        return;
      }

      const localCommitDir = path.join(commitsPath, commitID);
      await fs.mkdir(localCommitDir, { recursive: true });

      for (const file of files) {
        const fileName = file.name;

        const { data: fileData, error: downloadError } =
          await supabase.storage
            .from("codechronicle")
            .download(
              `repos/${repoName}/commits/${commitID}/${fileName}`
            );

        if (downloadError) {
          console.error("Download failed:", downloadError.message);
          return;
        }

        const buffer = Buffer.from(await fileData.arrayBuffer());

        await fs.writeFile(path.join(localCommitDir, fileName), buffer);

        console.log(
          `Pulled: repos/${repoName}/commits/${commitID}/${fileName}`
        );
      }
    }

    console.log("All commits pulled successfully from Supabase Storage.");
  } catch (err) {
    console.error("Error pulling commits:", err.message);
  }
}

module.exports = { pullRepo };
