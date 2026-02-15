const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
var ObjectId = require("mongodb").ObjectId;

const mongoose = require("mongoose");
const User = require("../models/userModel");
const { response } = require("express");

dotenv.config();
const uri = process.env.MONGODB_URI;

let client;
async function connectClient() {
  if (!client) {
    client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
  }
}

//signup
const signup = async (req, res) => {
  const { username, password, email } = req.body;

  try {
    await connectClient();
    const db = client.db("versioncontrolsystem");
    const userCollection = db.collection("users");

    //creating user
    const user = await userCollection.findOne({ username });
    if (user) {
      return res.status(400).json({ message: "user already exists" });
    }

    //creating the strong password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create new user
    const newUser = {
      username,
      password: hashedPassword,
      email,
      repositories: [],
      followedUsers: [],
      starRepos: [],
    };

    //insert in database
    const result = await userCollection.insertOne(newUser);

    //generate token
    const token = jwt.sign(
      { id: result.insertedId },
      process.env.JWT_SECRETE_KEY,
      { expiresIn: "1h" }
    );

    res.json({ token, userId: result.insertedId });
  } catch (err) {
    console.log("Error happened : ", err);
    res.status(500).json({ message: "internal error occured" });
  }
};

//getting all users
const getAllUser = async (req, res) => {
  try {
    await connectClient();
    const db = client.db("versioncontrolsystem");
    const userCollection = db.collection("users");

    const users = await userCollection.find({}).toArray();
    res.json(users);
  } catch (err) {
    console.log("Error happened : ", err);
    res.status(500).json({ message: "Error in fetching data" });
  }
};

//login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    //connect to DB and access DB and collections
    await connectClient();
    const db = client.db("versioncontrolsystem");
    const userCollection = db.collection("users");

    //create user and check it's existence
    const user = await userCollection.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    //comapare password
    const isCheck = await bcrypt.compare(password, user.password);
    if (!isCheck) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    //generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRETE_KEY, {
      expiresIn: "1h",
    });

    res.json({ token, userId: user._id });
  } catch (err) {
    console.error("Error occurred : ", err);
    return res.status(500).json({ message: "Error during login" });
  }
};

//getting the profile of user
const getUserProfile = async (req, res) => {
  const currentID = req.params.id;

  try {
    const user = await User.findById(currentID)
      .populate("repositories") // populates full Repository documents
      .populate("starRepos") // optional: populate starred repos
      .populate("followedUsers"); // optional: populate followed users

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    res.send(user);
  } catch (err) {
    console.error("Error occurred : ", err);
    return res.status(500).json({ message: "Error during fetching data" });
  }
};

//updating the user
const updateUserProfile = async (req, res) => {
  const currentId = req.params.id;
  const { email, password } = req.body;

  try {
    const updatedField = { email };
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updatedField.password = hashedPassword;
    }

    await connectClient();
    const db = client.db("versioncontrolsystem");
    const userCollection = db.collection("users");

    const result = await userCollection.findOneAndUpdate(
      { _id: new ObjectId(currentId) },
      { $set: updatedField },
      { returnDocument: "after" }
    );

    if (!result.value) {
      return res.status(404).json({ message: "User not found" });
    }

    res.send(result.value);
  } catch (err) {
    console.error("Error occurred : ", err);
    return res.status(500).json({ message: "Error during updating data" });
  }
};

//deleting user
const deleteUserProfile = async (req, res) => {
  const currentId = req.params.id;
  try {
    await connectClient();
    const db = client.db("versioncontrolsystem");
    const userCollection = db.collection("users");

    const deletedUser = userCollection.deleteOne({
      _id: new ObjectId(currentId),
    });

    if (deletedUser.count == 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User proflie deleted!" });
  } catch (err) {
    console.error("Error occurred : ", err);
    return res.status(500).json({ message: "Error during deleting data" });
  }
};

//adding newly created repository ID in user db
const addNewRepo = async (req, res) => {
  const userID = req.params.id;
  const { repoId } = req.body;

  console.log("Repository ID received is : ", repoId);

  try {
    await connectClient();
    const db = client.db("versioncontrolsystem");
    const userCollection = db.collection("users");

    const response = await userCollection.findOneAndUpdate(
      {
        _id: new ObjectId(userID),
      },
      { $push: { repositories: repoId } },
      { returnDocument: "after" }
    );
    res.json({ message: "user record", response });
  } catch (err) {
    console.log("Error occured :", err);
  }
};

//deleting the repo id from the user profile
const deleteRepoIdFromProfile = async (req, res) => {
  const userID = req.params.id;
  const { repoId } = req.body;

  try {
    await connectClient();
    const db = client.db("versioncontrolsystem");
    const userCollection = db.collection("users");

    const response = await userCollection.findOneAndUpdate(
      {
        _id: new ObjectId(userID),
      },
      { $pull: { repositories: repoId } },
      { returnDocument: "after" }
    );
    res.json({ message: "user record", response });
  } catch(err) {
    console.error("Some error occured",err);
  }
}

module.exports = {
  getAllUser,
  login,
  signup,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  addNewRepo,
  deleteRepoIdFromProfile
};
