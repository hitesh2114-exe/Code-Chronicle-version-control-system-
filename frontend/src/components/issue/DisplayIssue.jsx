import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../Navbar";
import "./displayIssue.css";
import { useNavigate } from "react-router-dom";

function DisplayIssue() {
  const [issue, setIssue] = useState(null);
  const { id } = useParams();
  const userId = localStorage.getItem("userId");
  const [click, setClick] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const response = await axios.get(`https://codechronicle.duckdns.org/issue/${id}`);
        setIssue(response.data.issue);
      } catch (err) {
        console.error("Error fetching issue", err);
      }
    };

    fetchIssue();
  }, [id]);

  const handletoggle = async () => {
    try {
      const response = await axios.post(
        `https://codechronicle.duckdns.org/issue/togglestatus/${id}`
      );
      const refreshed = await axios.get(`https://codechronicle.duckdns.org/issue/${id}`);
      setIssue(refreshed.data.issue);
    } catch (err) {
      console.log("error occured during calling handle toggle", err);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`https://codechronicle.duckdns.org/issue/delete/${id}`);
      await axios.put(
        `https://codechronicle.duckdns.org/repo/deleteIssueFromRepo/${issue.repository._id}`,
        { issueId: id }
      );
      navigate(`/repo/${issue.repository._id}`);
    } catch (err) {
      console.log("error occured during calling handle delete", err);
    }
  };

  return (
    <div className="displayissue-page">
      <Navbar />

      {!issue ? (
        <p className="loading">Loading issue...</p>
      ) : (
        <div className="displayissue-wrapper">
          <div className="displayissue-card">
            <div className="issue-header">
              <h1>{issue.title}</h1>

              <div className="issue-status-row">
                <span className="status-label">Status:</span>
                <span className={`issue-status ${issue.status}`}>
                  {issue.status?.toUpperCase()}
                </span>
              </div>
            </div>

            <h3>Description</h3>
            <p className="issue-description">{issue.description}</p>

            <div className="back-btn-container-left">
              <Link to={`/repo/${issue.repository._id}`}>
                <button className="back-btn">← Back to Repository</button>
              </Link>
              {issue.repository?.owner === userId ? (
                <button
                  className="back-btn"
                  style={{ marginLeft: "1rem" }}
                  onClick={handletoggle}
                >
                  Toggle Status
                </button>
              ) : (
                ""
              )}

              {issue.repository?.owner === userId && (
                <button
                  className="back-btn"
                  style={{ marginLeft: "1rem" }}
                  onClick={() => setClick(true)}
                >
                  Delete Issue
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {click && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>Are you sure you want to delete this Issue?</p>
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

export default DisplayIssue;
