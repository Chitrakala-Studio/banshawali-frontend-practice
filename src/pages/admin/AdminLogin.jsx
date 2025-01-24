import { useState } from "react";
import login_img from '/src/assets/public/admin-log.png';
import "./../../assets/styles/AdminLogin.css";

const AdminLogin = () => {
  const [isPhone, setIsPhone] = useState(true);

  return (
    <div className="admin-login-container">
      <div className="admin-login-image">
        <img
          src={login_img}
          alt="Landscape"
          className="background-image"
        />
      </div>
      <div className="admin-login-form">
        <h1>Find Your Pusta</h1>
        <form>
          <label htmlFor="phoneOrEmail">{isPhone ? "Phone Number" : "Email Address"}</label>
          <input
            type={isPhone ? "tel" : "email"}
            id="phoneOrEmail"
            placeholder={isPhone ? "Enter your Phone Number" : "Enter your Email Address"}
          />
          <div className="toggle-options" >
            <label>
              <input
                type="radio"
                name="toggleInput"
                checked={isPhone}
                onChange={() => setIsPhone(true)}
              />
              Use phone number
            </label>
            <label>
              <input
                type="radio"
                name="toggleInput"
                checked={!isPhone}
                onChange={() => setIsPhone(false)}
              />
              Use Email address
            </label>
          </div>
          <button type="submit" className="submit-button">Next</button>
        </form>
        <p>
          Don&apos;t have an account? <a href="/signup">SignUp</a>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
