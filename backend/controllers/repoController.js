const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const User = require("../models/userModel");
// const { use } = require("react");

//creating repository
const createRepository = async (req, res) => {
  const { owner, name, issues, content, visiblity, description } = req.body;

  try {
    if (!name) {
      return res.status(400).json({ error: "Repository name is required!" });
    }
    if (!mongoose.Types.ObjectId.isValid(owner)) {
      return res.status(400).json({ error: "Repository owner is required!" });
    }
    const newRepository = new Repository({
      owner,
      name,
      issues,
      content,
      visiblity,
      description,
    });
    const result = await newRepository.save();

    res
      .status(201)
      .json({ message: "repository created", repositoryID: result._id });
  } catch (err) {
    console.log("Error during creation", err);
    res.status(500).json({ message: "server error" });
  }
};

//getting all repositories
const getAllRepository = async (req, res) => {
  try {
    const repositories = await Repository.find({})
      .populate("owner")
      .populate("issues");
    res.json(repositories);
  } catch (err) {
    console.log("Error during fetching repository", err);
    res.status(500).json({ message: "server error" });
  }
};

//getting repository by name
const fetchRepositoryByName = async (req, res) => {
  const repoName = req.params.name;
  try {
    const repo = await Repository.findOne({ name: repoName })
      .populate("owner")
      .populate("issues");
    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }
    res.json(repo);
  } catch (err) {
    console.log("Error during fetching repository", err);
    res.status(500).json({ message: "server error" });
  }
};

//getting repository by id
const fetchRepositoryByID = async (req, res) => {
  const repoId = req.params.id;
  try {
    const repo = await Repository.findOne({ _id: repoId })
      .populate("owner")
      .populate("issues");
    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }
    res.json(repo);
  } catch (err) {
    console.log("Error during fetching repository", err);
    res.status(500).json({ message: "server error" });
  }
};

//fetching repository for current user
async function fetchRepositoriesForCurrentUser(req, res) {
  console.log(req.params);
  const { userID } = req.params;

  try {
    const repositories = await Repository.find({ owner: userID })
      .populate("owner")
      .populate("issues");

    if (!repositories || repositories.length == 0) {
      return res.status(404).json({ error: "User Repositories not found!" });
    }
    console.log(repositories);
    res.json({ message: "Repositories found!", repositories });
  } catch (err) {
    console.error("Error during fetching user repositories : ", err.message);
    res.status(500).send("Server error");
  }
}

//updating the repository
const updateRepositoryByID = async (req, res) => {
  const currID = req.params.id;
  const { description, content } = req.body;

  try {
    const repo = await Repository.findById(currID);
    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }

    repo.content.push(content);
    repo.description = description;

    const updatedRepository = await repo.save();

    res.json({
      message: "Repository updated!",
      repository: updatedRepository,
    });
  } catch (err) {
    console.log("Error during updating repository", err);
    res.status(500).json({ message: "server error" });
  }
};

//deleting the repository
const deleteRepositoryByID = async (req, res) => {
  const id = req.params.id;

  try {
    const delRopo = await Repository.findByIdAndDelete(id);
    if (!delRopo) {
      return res.status(404).json({ message: "Repository not found" });
    }
    res.json({ message: "Repository Deleted Sucessfully!" });
  } catch (err) {
    console.log("Error during deleting repository", err);
    res.status(500).json({ message: "server error" });
  }
};

//toggling the visibility
const toggleVisiblityById = async (req, res) => {
  const { currID } = req.params.id;

  try {
    const repo = await Repository.findById(currID);
    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }

    repo.visibility = !repo.visibility;

    const updatedRepository = await repo.save();

    res.json({
      message: "Repository updated!",
      repository: updatedRepository,
    });
  } catch (err) {
    console.log("Error during toggling visibility", err);
    res.status(500).json({ message: "server error" });
  }
};

//adding issues id to the repository
const addIssueId = async (req, res) => {
  const { id } = req.params;
  const { issueId } = req.body;

  console.log(id);

  try {
    const repo = await Repository.findById(id);
    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }

    repo.issues = repo.issues || [];
    repo.issues.push(issueId);
    const updatedRepository = await repo.save();
    await updatedRepository.populate("issues");

    res.json({
      message: "Repository updated!",
      repository: updatedRepository,
    });
  } catch (err) {
    console.log("error while adding issue id to the repository");
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteIssueFromRepo = async (req, res) => {
  const { id } = req.params;
  const { issueId } = req.body;

  try {
    const repo = await Repository.findByIdAndUpdate(
      id,
      { $pull: { issues: issueId } },
      { new: true }
    );

    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }

    return res.status(200).json({
      message: "Issue removed from repository",
      repo,
    });
  } catch (err) {
    console.log("error while delete issue id frome the repository");
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createRepository,
  getAllRepository,
  fetchRepositoryByID,
  fetchRepositoryByName,
  fetchRepositoriesForCurrentUser,
  updateRepositoryByID,
  deleteRepositoryByID,
  toggleVisiblityById,
  addIssueId,
  deleteIssueFromRepo,
};
