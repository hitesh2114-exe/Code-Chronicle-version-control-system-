import React, { useEffect, useState } from "react";
import "./repoOwner.css";
import Navbar from "../Navbar";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

function RepoOwner() {
  const { id } = useParams();
  const [userProfile, setUserProfile] = useState({});

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const response = await axios.get(
          `https://codechronicle.duckdns.org/userProfile/${id}`
        );
        setUserProfile(response.data);
      } catch (err) {
        console.log("Error occured", err);
      }
    };

    fetchInfo();
  }, [id]);

  const preview = (md, length = 120) => {
    if (!md) return "";

    if (typeof md !== "string") {
      md = Array.isArray(md) ? md.join(" ") : String(md);
    }

    let text = md
      .replace(/[#>*`~\-]/g, "")
      .replace(/\[(.*?)\]\(.*?\)/g, "$1")
      .replace(/\n+/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    return text.length > length ? text.slice(0, length) + "..." : text;
  };

  return (
    <div className="repoowner-page">
      <Navbar />

      <div className="repoowner-wrapper">
        {/* LEFT SIDE */}
        <div className="repoowner-left">
          <img
            src={userProfile.avatar || "/default-avatar1.png"}
            alt="Owner Avatar"
            className="owner-avatar"
          />
          <h1 className="owner-name">{userProfile.username}</h1>
          {/* <p className="owner-follow">
            Following: {userProfile.followedUsers?.length || 0}
          </p> */}
          <p className="owner-follow">
            Total Repositories : {userProfile.repositories?.length || 0}
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="repoowner-right">
          <h2 className="repo-section-title">Repositories</h2>

          {userProfile.repositories?.map((repo) => (
            <Link to={`/repo/${repo._id}`}>
              <div key={repo._id} className="repo-card">
                <h3 className="repo-name">{repo.name}</h3>
                <p className="repo-description" style={{ fontSize: "1rem", lineHeight: "1.7rem", opacity: 0.85 }}>
                  {preview(repo.description, 150)}
                </p>

                <p className="repo-content">{preview(repo.content, 120)}</p>

                <p className="repo-issues">
                  Issues: <span>{repo.issues?.length || 0}</span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RepoOwner;
