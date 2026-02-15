import React, { useEffect, useState } from "react";
import "./auth.css";
import logo from "../../assets/logo-image.png";
import axios from "axios";
import { useAuth } from "../../authContext";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { currentUser, setCurrentUser } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post("https://codechronicle.duckdns.org/login", {
        email: email + "@gmail.com",
        password: password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);

      setCurrentUser(res.data.userId);
      setLoading(false);
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert("Login Failed");
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container">
        <div className="outside">
          <div className="row">
            <p
              style={{
                color: "white",
                textAlign: "left",
                fontSize: "2.2rem",
                // backgroundColor : "yellowgreen",
                lineHeight: "0",
                marginTop: "4rem",
              }}
            >
              Welcome to CodeChronicle...!
            </p>
            <p
              style={{
                color: "white",
                textAlign: "left",
                fontSize: "1rem",
                marginTop: "1rem",
                // backgroundColor : "red"
              }}
            >
              captures the history of your code
            </p>
          </div>
          <div className="row" style={{ marginTop: "2rem" }}>
            <div className="col col-4 up-container">
              <img src={logo} className="logo-box" alt="img" />
              <h1 className="heading">Login</h1>
            </div>
            <div className="col down-container">
              <div className="input-fields" style={{ width: "90%" }}>
                <form onSubmit={handleLogin}>
                  <div className="input-group mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="email"
                      aria-label="email"
                      aria-describedby="basic-addon2"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    ></input>
                    <span
                      className="input-group-text"
                      id="basic-addon2"
                      style={{ backgroundColor: "transparent", color: "white" }}
                    >
                      @gmail.com
                    </span>
                  </div>

                  <div class="input-group mb-3">
                    <input
                      type="password"
                      className="form-control"
                      placeholder="password"
                      aria-label="password"
                      aria-describedby="basic-addon1"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    ></input>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-outline-light"
                    style={{ padding: "0.7rem 7rem", marginTop: "4rem" }}
                    // onClick={handleLogin}
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Login"}
                  </button>
                </form>

                <p style={{ color: "white", marginTop: "1rem" }}>
                  Don't have account?{" "}
                  <Link to="/signup" style={{ color: "white" }}>
                    Signup here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
