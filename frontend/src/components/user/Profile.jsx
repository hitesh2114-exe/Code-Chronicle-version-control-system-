import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import "./profile.css";
import axios from "axios";
import { Link } from "react-router-dom";
import DeleteProfile from "./DeleteProfile";

function Profile() {
  const [userProfile, setUserProfile] = useState({});

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://codechronicle.duckdns.org/userProfile/${userId}`
        );
        setUserProfile(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  const preview = (md, length = 100) => {
    if (!md) return "";

    // Ensure md is a string
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
    <div className="outer-box-profile">
      <div className="profile-page">
        <Navbar />

        <div className="profile-wrapper">
          {/* LEFT SECTION */}
          <div className="profile-left">
            <div className="profile-avatar-box">
              <img
                src={userProfile.avatar || "/default-avatar.png"}
                alt="avatar"
                className="profile-avatar"
              />
            </div>

            <h1 className="profile-title"> {userProfile.username}</h1>

            <div className="profile-info-card">
              {/* <p className="profile-follow">
                <strong>Following :</strong>{" "}
                {userProfile.followedUsers?.length || 0}
              </p> */}
              <p className="profile-username">
                <strong>Total Repositories : {}</strong>{" "}
                {userProfile.repositories?.length || 0}
              </p>
            </div>
          </div>

          {/* RIGHT SECTION – REPOSITORIES */}
          <div className="repo-section">
            <h2 className="repo-title">Your Repositories</h2>

            {userProfile.repositories?.length === 0 && (
              <div className="no-repo">
                <p style={{ width: "10rem" }}>No repositories yet.</p>
              </div>
            )}

            {userProfile.repositories?.map((repo) => (
              <Link to={`/repo/${repo._id}`} key={repo._id}>
                <div className="repo-card">
                  <h3 className="repo-name">{repo.name}</h3>
                  <p className="repo-description" style={{ fontSize: "1rem", lineHeight: "1.7rem", opacity: 0.85 }}>
                    {preview(repo.description, 150)}
                  </p>

                  <p className="repo-content" >{preview(repo.content, 120)}</p>

                  <p className="repo-issues">
                    Issues: <span>{repo.issues?.length || 0}</span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="delete-profile-section">
          <DeleteProfile />
        </div>
      </div>
    </div>
  );
}

export default Profile;
