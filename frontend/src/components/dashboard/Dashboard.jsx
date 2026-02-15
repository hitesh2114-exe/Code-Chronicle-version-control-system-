import React, { useEffect, useState } from "react";
import axios from "axios";
import "./dashboard.css";
import Navbar from "../Navbar";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function Dashboard() {
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchRepositories = async () => {
      try {
        const response = await axios.get(
          `https://codechronicle.duckdns.org/repo/${userId}`
        );
        const userRepos = response.data.repositories || response.data || [];
        setRepositories(userRepos);
        setSearchResult(userRepos);
      } catch (err) {
        console.error("Failed to fetch repositories:", err);
      }
    };

    const fetchAllRepositories = async () => {
      try {
        const response = await axios.get(`https://codechronicle.duckdns.org/repo/all`);
        setSuggestedRepositories(response.data || []);
      } catch (err) {
        console.error("Failed to fetch suggested repositories:", err);
      }
    };

    fetchRepositories();
    fetchAllRepositories();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResult(repositories);
    } else {
      const filtered = repositories.filter((repo) =>
        repo.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResult(filtered);
    }
  }, [searchQuery, repositories]);

  const markdownPreview = (md, length = 140) => {
    if (!md) return "";

    let text = md
      .replace(/[#>*`~\-]/g, "") // remove markdown symbols
      .replace(/\[(.*?)\]\(.*?\)/g, "$1") // convert [text](url) → text
      .replace(/\n+/g, " ") // newlines → spaces
      .replace(/\s+/g, " ") // collapse extra spaces
      .trim();

    return text.length > length ? text.slice(0, length) + "..." : text;
  };

  return (
    <div className="dashboard-home">
      <Navbar />

      <div className="stars"></div>
      <div className="sunrise-glow"></div>
      <div className="aurora"></div>

      <div className="main-box">
        {/* LEFT COLUMN — Suggested Repositories */}
        <aside className="column left">
          <h3>Suggested Repositories</h3>
          {suggestedRepositories.map((repo) => (
            <Link to={`/repo/${repo._id}`}>
              <div key={repo._id} className="suggested-box">
                <h4 className="suggested-box-heading">{repo.name}</h4>
                <h5 className="repo-description" style={{ fontSize: "1rem", lineHeight: "1.7rem", opacity: 0.85 }}>
                  {markdownPreview(repo.description, 140)}
                </h5>
              </div>
            </Link>
          ))}
        </aside>

        {/* CENTER COLUMN — Your Repositories */}
        <main className="column center">
          <h2>Your Repositories</h2>
          <input
            type="text"
            className="search-input"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {searchResult.length > 0 ? (
            searchResult.map((repo) => (
              <Link key={repo._id} to={`/repo/${repo._id}`}>
                <div key={repo._id} className="repo-card">
                  <h4 style={{ color: "white" }}>{repo.name}</h4>

                  <h5 className="repo-description" style={{ fontSize: "1rem", lineHeight: "1.7rem", opacity: 0.85 }}>
                    {markdownPreview(repo.description, 140)}
                  </h5>
                </div>
              </Link>
            ))
          ) : (
            <p
              style={{ color: "#aaa", textAlign: "center", marginTop: "1rem" }}
            >
              No repositories found.
            </p>
          )}
        </main>

        {/* RIGHT COLUMN — Events */}
        <aside className="column right">
          <h2 style={{ fontSize: "1.2rem" }}>Upcoming Events</h2>
          <div className="event-card">
            <h4>CodeStorm Summit</h4>
            <p>15th November, 2025</p>
          </div>
          <div className="event-card">
            <h4>DevForge Expo</h4>
            <p>2nd December, 2025</p>
          </div>
          <div className="event-card">
            <h4>BugSmash Weekend</h4>
            <p>14th June, 2026</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Dashboard;
