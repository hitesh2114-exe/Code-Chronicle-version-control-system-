import React from "react";
import "./Signout.css"; // optional external CSS file

function Signout({ onConfirm, onCancel }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h1>Signout</h1>
        <p>Are you sure you want to sign out?</p>
        <div className="modal-actions">
          <button onClick={onConfirm}>Yes</button>
          <button onClick={onCancel}>No</button>
        </div>
      </div>
    </div>
  );
}

export default Signout;