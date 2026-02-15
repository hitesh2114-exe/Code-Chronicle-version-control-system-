import React, { useState } from "react";
import "./createRepo.css";
import Navbar from "../Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateRepo() {
  const userId = localStorage.getItem("userId");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://codechronicle.duckdns.org/repo/create", {
        owner: userId,
        name,
        description,
        content,
      });

      await axios.put(`https://codechronicle.duckdns.org/addNewRepo/${userId}`, {
        repoId: response.data.repositoryID,
      });

      alert("Repository created successfully!");
      navigate("/");
    } catch (err) {
      console.log("Error creating repository:", err);
    }
  };

  return (
    <div className="createrepo-page">
      <Navbar />

      <div className="createrepo-wrapper">
        <form className="createrepo-card" onSubmit={handleCreate}>
          <h1>Create Repository</h1>

          <label>Repository Name</label>
          <input
            type="text"
            placeholder="Enter repository name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label>Description</label>
          <textarea
            rows="7"
            type="text"
            placeholder="Enter short description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <label>Content</label>
          <textarea
            rows="7"
            placeholder="Describe the content..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <button type="submit" className="btn btn-outline-light">
            Create Repository
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateRepo;
