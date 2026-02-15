require("dotenv").config();
const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");
const { initRepo } = require("./controllers/init");
const { addRepo } = require("./controllers/add");
const { commitRepo } = require("./controllers/commit");
const { pushRepo } = require("./controllers/push");
const { pullRepo } = require("./controllers/pull");
const { revertRepo } = require("./controllers/revert");
const { Server } = require("socket.io");

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const http = require("http");
const mainRouter = require("./routes/main.router");

yargs(hideBin(process.argv))
  .command("begin", "Starting the server", {}, startServer)
  .command(
    "init <repoName>",
    "Initialize a new repository",
    (yargs) => {
      yargs.positional("repoName", {
        describe: "Repository name",
        type: "string",
      });
    },
    (argv) => {
      initRepo(argv.repoName);
    }
  )

  .command(
    "add <file>",
    "Add file to the repository",
    (yargs) => {
      yargs.positional("file", {
        describe: "File to add to staging area",
        type: "string",
      });
    },
    (argv) => {
      addRepo(argv.file);
    }
  )
  .command(
    "commit <message>",
    "Commit the staged file",
    (yargs) => {
      yargs.positional("message", {
        describe: "Commit message",
        type: "string",
      });
    },
    (argv) => {
      commitRepo(argv.message);
    }
  )
  .command("push", "push commits to s3", {}, pushRepo)
  .command("pull", "pull commits to s3", {}, pullRepo)
  .command(
    "revert <commitID>",
    "revert the updates",
    (yargs) => {
      yargs.positional("commitID", {
        describe: "commit ID to revert to",
        type: "string",
      });
    },
    (argv) => {
      revertRepo(argv.commitID);
    }
  )
  .demandCommand(1, "You need at least one command before moving on")
  .help().argv;

function startServer() {
  const app = express();
  const port = process.env.PORT || 3000;
  const mongodb_uri = process.env.MONGODB_URI;

  app.use(bodyParser.json());
  app.use(express.json());

  mongoose
    .connect(mongodb_uri)
    .then(() => console.log("Connection Established!"))
    .catch((err) =>
      console.error("Error occured during connection establishment", err)
    );

  app.use(cors({ origin: "*" }));

  app.use("/", mainRouter);

  const user = "test";
  const httpServer = http.createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinRoom", (userID) => {
      user = userID;
      console.log("======");
      console.log(user);
      console.log("======");
      socket.join(userID);
    });
  });

  const db = mongoose.connection;

  db.once("open", async () => {
    console.log("CRUD operations");
    //perform all the CRUD operations
  });

  httpServer.listen(port, () => {
    console.log(`Connected to port : ${port}`);
  });
}
