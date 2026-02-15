import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import axios from "axios";
import "./SearchProfile.css";
import { Link } from "react-router-dom";

function SearchProfile() {
  const [usersProfile, setUsersProfile] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    const allProfile = async () => {
      try {
        const response = await axios.get("https://codechronicle.duckdns.org/allUsers");
        setUsersProfile(response.data);
        setSearchResult(response.data);
      } catch (err) {
        console.log("Error occured during extracting user profiles");
      }
    };
    allProfile();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResult(usersProfile);
    } else {
      const filtered = usersProfile.filter((user) =>
        user.username?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResult(filtered);
    }
  }, [usersProfile, searchQuery]);

  return (
    <div className="page-container">
      <Navbar />

      <div className="search-bar">
        <input
          className="search-input"
          type="text"
          placeholder="Search profile..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="cards-container">
        {searchResult.length > 0 ? (
          searchResult.map((user) => (
            <div className="profile-card" key={user._id}>
              <Link to={`/userProfile/${user._id}`}>
                <div className="card-content">
                  {/* LEFT SECTION */}
                  <div className="card-left">
                    <p className="card-name">{user.username}</p>
                    <p className="card-email">{user.email}</p>
                  </div>

                  {/* RIGHT SECTION */}
                  <div className="card-right">
                    <div className="info-row">
                      <span>
                        <i
                          class="fa-regular fa-file"
                          style={{ color: "whitesmoke" }}
                        ></i>{" "}
                        Repositories
                      </span>
                      <span className="info-value">
                        {user.repositories?.length}
                      </span>
                    </div>
                    {/* <div className="info-row">
                      <span>
                        <i
                          class="fa-regular fa-user"
                          style={{ color: "whitesmoke" }}
                        ></i>{" "}
                        Followed Users
                      </span>
                      <span className="info-value">
                        {user.followedUsers?.length}
                      </span>
                    </div> */}
                  </div>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <p className="no-user">No user available</p>
        )}
      </div>
    </div>
  );
}

export default SearchProfile;
