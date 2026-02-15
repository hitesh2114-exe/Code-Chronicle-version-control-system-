const Issue = require("../models/issueModel");
const mongoose = require("mongoose");

//creating issue
const createIssue = async (req, res) => {
  const { title, description } = req.body;
  const { id } = req.params;
  try {
    const newIssue = new Issue({
      title,
      description,
      repository: id,
    });
    await newIssue.save();
    res.status(201).json(newIssue);
  } catch (err) {
    console.log("Error during issue creation", err);
    res.status(500).json({ message: "server error" });
  }
};

//updating issue
const updateIssueById = async (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;

  try {
    const issue = await Issue.findOne({ _id: id });
    if (!issue) {
      return res.status(404).json({ error: "issue not found" });
    }
    issue.title = title;
    issue.description = description;
    issue.status = status;
    await issue.save();

    res.json({ message: "Issue Updated successfully...!", issue });
  } catch (err) {
    console.log("Error during issue creation", err);
    res.status(500).json({ message: "server error" });
  }
};

//deleting issue
const deleteIssueById = async (req, res) => {
  const { id } = req.params;

  try {
    const issue = await Issue.findByIdAndDelete(id);
    if (!issue) {
      return res.status(404).json({ error: "issue not found" });
    }
    res.json({ message: "issue deleted sucessfully...!" });
  } catch (err) {
    console.log("Error during issue creation", err);
    res.status(500).json({ message: "server error" });
  }
};

const getAllIssue = async (req, res) => {
  const { id } = req.params;

  try {
    const issue = await Issue.find({ _id: id }).populate("repository");
    if (!issue) {
      return res.status(404).json({ error: "issues not found" });
    }
    res.status(200).json(issue);
  } catch (err) {
    console.log("Error during issue creation", err);
    res.status(500).json({ message: "server error" });
  }
};

const getIssueById = async (req, res) => {
  const { id } = req.params;

  try {
    const issue = await Issue.findOne({ _id: id }).populate("repository");
    if (!issue) {
      return res.status(404).json({ error: "issue not found" });
    }
    res.json({ issue });
  } catch (err) {
    console.log("Error during issue creation", err);
    res.status(500).json({ message: "server error" });
  }
};

const togglestatus = async (req, res) => {
  const { id } = req.params;
  const issue = await Issue.findOne({ _id: id });
  if (!issue) {
      return res.status(404).json({ error: "issue not found" });
    }

  if(issue.status === "open") {
    issue.status = "solved";
  } else {
    issue.status = "open";
  }
  await issue.save();
  res.json({ message: "status toggled successfully...!", issue });
  try {
  } catch (err) {
    console.log("Error during status toggling", err);
    res.status(500).json({ message: "server error" });
  }
};

module.exports = {
  createIssue,
  updateIssueById,
  deleteIssueById,
  getAllIssue,
  getIssueById,
  togglestatus,
};
