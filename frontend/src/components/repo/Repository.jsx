import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../Navbar";
import "./repository.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function Repository() {
  const { id } = useParams();
  const [repository, setRepository] = useState({});
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [click, setClick] = useState(false);

  useEffect(() => {
    // console.log(id);
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://codechronicle.duckdns.org/repo/id/${id}`);
        console.log(response.data);
        setRepository(response.data);
      } catch (err) {
        console.log("Error during fetching data.", err);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    console.log(userId);
    console.log(repository?.owner?._id);
  }, [repository]);

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `https://codechronicle.duckdns.org/repo/delete/${id}`
      );
      console.log(response);

      await axios.put(
        `https://codechronicle.duckdns.org/deleteRepoIdFromProfile/${userId}`,
        {
          repoId: id,
        }
      );

      alert("Repository deleted!");
      navigate("/");
    } catch (err) {
      console.error("Error occured during deleting repo");
    }
  };

  return (
    <div className="repository-page">
      <Navbar />
      {/* Repository Info Section */}
      <div className="repository-section">
        <h2>Repository Information</h2>
        <h1>{repository.name}</h1>
        {repository.description ? (
          <div className="markdown-description">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {repository.description}
            </ReactMarkdown>
          </div>
        ) : (
          <p>No description provided.</p>
        )}

        {repository.owner && (
          <h2>
            <i style={{ color: "white", marginTop: "1rem" }}>by </i>
            <Link to={`/userProfile/${repository.owner._id}`}>
              <span style={{ color: "blue" }}>{repository.owner.username}</span>
            </Link>
          </h2>
        )}
      </div>

      {/* Content Section */}
      <div className="repository-section">
        <h2>Content</h2>

        {repository.content ? (
          <pre
            style={{
              whiteSpace: "pre-wrap",
              background: "#041330",
              color: "#c9d1d9",
              padding: "16px",
              borderRadius: "10px",
              fontFamily: "monospace",
              overflowX: "auto",
              fontSize: "15px",
              lineHeight: "1.4rem",
            }}
          >
            {repository.content}
          </pre>
        ) : (
          <p>No content available.</p>
        )}
      </div>

      {/* Issues Section */}
      <div className="repository-section">
        <div className="issues-title-row">
          <h2>Issues</h2>

          {/* Raise Issue Button (only for non-owner users) */}
          {repository.owner?._id !== userId && (
            <Link to={`/issues/${id}`}>
              <button className="raise-issue-btn">Raise Issue</button>
            </Link>
          )}
        </div>

        {repository.issues && repository.issues.length > 0 ? (
          <div className="issues-container">
            {repository.issues.map((issue) => (
              <Link to={`/displayissues/${issue._id}`}>
                <div className="issue-card" key={issue._id}>
                  <div className="issue-head">
                    <h3 className="issue-title">{issue.title}</h3>
                    <span className={`issue-status ${issue.status}`}>
                      {issue.status.toUpperCase()}
                    </span>
                  </div>

                  <p className="issue-description">{issue.description}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p>No issues found.</p>
        )}
      </div>

      {/* Delete Repo Button */}
      {repository.owner?._id === userId && (
        <div className="delete-section">
          <button className="delete-repo-button" onClick={() => setClick(true)}>
            Delete Repository
          </button>
        </div>
      )}

      {click && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>Are you sure you want to delete this repository?</p>
            <div className="modal-actions">
              <button onClick={handleDelete}>Yes</button>
              <button
                onClick={() => {
                  setClick(false);
                }}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Repository;
