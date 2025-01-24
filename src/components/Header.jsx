import PropTypes from "prop-types";
import "../assets/styles/AdminDashboard.css";
import sample1 from "/src/assets/public/sample_1.jpg";
import { FaBell } from "react-icons/fa";

const Header = ({ view, setView }) => {
  return (
    <div className="flex justify-between items-center py-[1rem] px-4 lg:px-[10rem] border-[#ddd] border-b">
      {/* Left Section: Compare or Card View Button for Mobile */}
      <div className="lg:hidden">
        {view === "Compare View" ? (
          <button
            onClick={() => setView("Card View")}
            className="bg-purple-700 text-white px-4 py-2 rounded-md text-sm"
          >
            Card View
          </button>
        ) : (
          <button
            onClick={() => setView("Compare View")}
            className="bg-purple-700 text-white px-4 py-2 rounded-md text-sm"
          >
            Compare
          </button>
        )}
      </div>

      {/* Right Section: Notification and Profile Icons */}
      <div className="flex items-center gap-4 ml-auto">
        {/* Notification Bell */}
        <FaBell className="w-6 h-6 p-[0.3rem] rounded-md border border-[#ccc] bg-[#f9f9f9]" />

        {/* Profile Image */}
        <img className="profile-image w-10 h-10 rounded-full" src={sample1} alt="Profile" />

        {/* Dropdown Button (PC Only) */}
        {view !== "Compare View" && (
          <div className="hidden lg:flex items-center">
            <select
              value={view}
              onChange={(e) => setView(e.target.value)}
              className="view-dropdown"
            >
              <option value="Card View">Card View</option>
              <option value="Table View">Table View</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

Header.propTypes = {
  view: PropTypes.string.isRequired,
  setView: PropTypes.func.isRequired,
};

export default Header;

