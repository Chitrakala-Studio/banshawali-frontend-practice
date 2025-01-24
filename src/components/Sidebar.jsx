import PropTypes from "prop-types";
import "./../assets/styles/AdminDashboard.css";

const Sidebar = ({ setView, currentView }) => {
  return (
    <div className="sidebar">
      <h2>Banshawali</h2>
      <ul>
        <li
          className={currentView === "Table View" ? "active" : ""}
          onClick={() => setView("Table View")}
        >
          Table
        </li>
        <li
          className={currentView === "Compare View" ? "active" : ""}
          onClick={() => setView("Compare View")}
        >
          Compare
        </li>
      </ul>
    </div>
  );
};

Sidebar.propTypes = {
  setView: PropTypes.func.isRequired, // Function to set the view
  currentView: PropTypes.string.isRequired, // Current view as a string
};

export default Sidebar;
