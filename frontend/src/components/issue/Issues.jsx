import React, { useState } from "react";
import Navbar from "../Navbar";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./issues.css";
import { useNavigate } from "react-router-dom";

function Issues() {
  const repoId = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `https://codechronicle.duckdns.org/issue/create/${repoId.id}`,
        { title, description }
      );

      await axios.put(`https://codechronicle.duckdns.org/repo/addIssueId/${repoId.id}`, {
        issueId: response.data._id,
      });

      setTitle("");
      setDescription("");
      alert("Repository created successfully!");
      navigate(`/repo/${repoId.id}`);
    } catch (err) {
      console.error("Error creating issue");
    }
  };

  return (
    <div className="issue-page">
      <Navbar />

      <div className="issue-wrapper">
        <div className="issue-card">
          <h1>Create Issue</h1>

          <label>Issue Title</label>
          <input
            type="text"
            placeholder="Enter issue title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label>Description</label>
          <textarea
            placeholder="Describe the issue..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button onClick={handleSubmit}>Submit Issue</button>
        </div>
      </div>
    </div>
  );
}

export default Issues;
