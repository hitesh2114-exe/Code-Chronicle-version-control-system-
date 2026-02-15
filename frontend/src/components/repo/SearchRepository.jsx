import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import axios from "axios";
import { Link } from "react-router-dom";
// import "./searchProfile.css";

function SearchRepository() {
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    const fetchAllRepositories = async () => {
      try {
        const response = await axios.get("https://codechronicle.duckdns.org/repo/all");
        setRepositories(response.data || []);
      } catch (err) {
        console.error("Failed to fetch suggested repositories:", err);
      }
    };

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
  const preview = (md, length = 120) => {
    if (!md) return "";

    // Ensure md is a string
    if (typeof md !== "string") {
      md = Array.isArray(md) ? md.join(" ") : String(md);
    }

    let text = md
      .replace(/[#>*`~\-]/g, "") // remove markdown symbols
      .replace(/\[(.*?)\]\(.*?\)/g, "$1") // convert [text](url) → text
      .replace(/\n+/g, " ") // newline to space
      .replace(/\s+/g, " ") // collapse spaces
      .trim();

    return text.length > length ? text.slice(0, length) + "..." : text;
  };

  return (
    <div className="page-container">
      <Navbar />

      {/* SEARCH BAR */}
      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search repository by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* CARDS LIST */}
      <div className="cards-container">
        {searchResult.length > 0 ? (
          searchResult.map((repo) => (
            <Link
              to={`/repo/${repo._id}`}
              key={repo._id}
              style={{ width: "100%", textDecoration: "none" }}
            >
              <div className="profile-card">
                <div className="card-content">
                  {/* LEFT SIDE: NAME + DESCRIPTION */}
                  <div className="card-left">
                    <h3 className="card-name">{repo.name}</h3>
                    <p className="card-email">
                      {preview(repo.description, 140)}
                    </p>
                  </div>

                  {/* RIGHT SIDE: SOME META INFO (ADJUST AS PER YOUR SCHEMA) */}
                  <div className="card-right">
                    <div className="info-row">
                      <span>Owner</span>
                      <span className="info-value">
                        {repo.owner.username || "Unknown"}
                      </span>
                    </div>
                    <div className="info-row">
                      <span>Issues</span>
                      <span className="info-value">
                        {Array.isArray(repo.issues) ? repo.issues.length : 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="no-user">No repositories found.</p>
        )}
      </div>
    </div>
  );
}

export default SearchRepository;
