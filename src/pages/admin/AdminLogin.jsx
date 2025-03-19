import { useState } from "react";
import login_img from "/src/assets/public/admin-log.png";
import "./../../assets/styles/AdminLogin.css";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === "admin" && password === "admin") {
      // Save the user information in local storage as admin
      const user = { username, token: "dummyToken123", role: "admin" };
      localStorage.setItem("user", JSON.stringify(user));
      // Redirect to the protected route or dashboard
      navigate("/");
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  const handleContinueWithoutLogin = () => {
    // Save the user information in local storage as normal user
    const user = { username: "guest", token: "dummyToken123", role: "user" };
    localStorage.setItem("user", JSON.stringify(user));
    // Redirect to the table view
    navigate("/");
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-image">
        <img src={login_img} alt="Landscape" className="background-image" />
      </div>
      <div className="admin-login-form">
        <h1>Admin Login</h1>
        <form onSubmit={handleLogin}>
          {error && <p className="error-message">{error}</p>}
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          <button type="submit" className="submit-button">
            Login
          </button>
        </form>
        <p>
          <button
            className="continue-without-login"
            onClick={handleContinueWithoutLogin}
          >
            Continue without login
          </button>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
