import React from "react";
import Navbar from "./Navbar";

function PageNotFound() {
  return (
    <>
      <Navbar />
      <div style={{ marginLeft: "40%" }}>
        <div style={{paddingTop : "30%"}}>
          <h1 style={{ color: "white", textAlign: "left" }}>Error 404</h1>
          <h3 style={{ color: "white" }}>
            The page you are looking for do not exist.
          </h3>
        </div>
      </div>
    </>
  );
}

export default PageNotFound;
