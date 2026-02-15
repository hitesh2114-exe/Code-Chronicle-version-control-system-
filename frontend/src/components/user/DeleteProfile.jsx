import React, { useEffect } from "react";
import "./deleteProfile.css";
import { useState } from "react";
import axios from "axios";

function DeleteProfile() {
  const [click, setClick] = useState(false);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    console.log(userId);
  }, []);

  const handleDelete = async () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      axios.delete(`https://codechronicle.duckdns.org/deleteProfile/${userId}`);
      window.location.href = "/login";
    } catch (err) {
      console.error("error occured during deleteing profile");
    }
  };

  return (
    <div>
      <div className="profile-delete">
        <button
          className="delete-profile-button"
          onClick={() => {
            setClick(true);
          }}
        >
          Delete Profile
        </button>
      </div>
      {click && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>Are you sure you want to delete your profile?</p>
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

export default DeleteProfile;
