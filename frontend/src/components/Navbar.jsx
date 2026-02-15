import React, { use } from "react";
import "./navbar.css";
import { Link } from "react-router-dom";
import Signout from "./auth/Signout";
import { useState } from "react";

const Navbar = () => {
  const [showModal, setShowModal] = useState(false);

  const handleSignout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    window.location.href = "/login";
  };

  return (
    <div>
      <nav className="navbar">
        <div className="nav-left">
          <Link to="/">
            <h1 className="nav-logo">CodeChronicle</h1>
          </Link>
        </div>

        <div className="nav-center">
          <Link to={`/searchrepo`}>
            <div className="search-icon">
              <i
                class="fa-solid fa-magnifying-glass"
                style={{ marginRight: "0.4rem" }}
              ></i>
              Search Repository
            </div>
          </Link>
          <Link to={`/search`}>
            <div className="search-icon">
              {/* <i
                class="fa-solid fa-magnifying-glass"
                style={{ marginRight: "0.4rem" }}
              ></i> */}
              Search Profile
            </div>
          </Link>
          <Link to={`/createrepo`}>Create repository</Link>
          <a
            href="#"
            onClick={() => {
              setShowModal(true);
            }}
          >
            Sign out
          </a>
          <Link to={"/profile"}>Profile</Link>
        </div>

        <Link to={"/profile"}>
          <div className="nav-right">
            <img
              src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
              alt="Profile"
              className="nav-profile"
            />
          </div>
        </Link>
      </nav>
      <div>
        {showModal && (
          <Signout
            onConfirm={handleSignout}
            onCancel={() => setShowModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Navbar;
