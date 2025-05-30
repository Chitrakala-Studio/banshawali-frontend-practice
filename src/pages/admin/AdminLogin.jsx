import { useState } from "react";
import Swal from "sweetalert2"; // Import SweetAlert2
import login_img from "/src/assets/public/newloginimage.png";
import "./../../assets/styles/AdminLogin.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const handleLogin = (e) => {
    e.preventDefault();

    const URL = `${API_URL}/auth/auth/login/`;
    const data = {
      username: username,
      password: password,
    };

    axios
      .post(URL, data)
      .then((response) => {
        if (response.status !== 200) {
          Swal.fire({
            icon: "error",
            title: "Invalid Login",
            text: "Invalid username or password. Please try again.",
          });
          return;
        }
        // Add access token to response.user
        const user_Details = {
          username: response.data.user.username,
          token: response.data.access,
          role: response.data.user.role,
        };
        localStorage.setItem("user", JSON.stringify(user_Details));
        navigate("/");
      })
      .catch((error) => {
        console.error("Login error:", error);
        Swal.fire({
          icon: "error",
          title: "Invalid Login",
          text: "Invalid username or password. Please try again.",
        });
      });
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
          <button
            className="continue-without-login submit-button"
            onClick={handleContinueWithoutLogin}
          >
            Login as Guest
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
