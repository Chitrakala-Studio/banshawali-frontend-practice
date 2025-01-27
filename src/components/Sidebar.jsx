import PropTypes from "prop-types";
import { useState } from "react";

const Sidebar = ({ setView, currentView }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      {/* Hamburger Menu for Mobile */}
      <button
        className="fixed top-5 left-5 z-50 flex flex-col justify-around w-8 h-6 bg-transparent border-none cursor-pointer p-0 focus:outline-none lg:hidden"
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
      >
        <span
          className={`block w-full h-0.5 bg-white transition-transform duration-300 ${
            isSidebarOpen ? "transform rotate-45 translate-y-2.5" : ""
          }`}
        ></span>
        <span
          className={`block w-full h-0.5 bg-white transition-opacity duration-300 ${
            isSidebarOpen ? "opacity-0" : "opacity-100"
          }`}
        ></span>
        <span
          className={`block w-full h-0.5 bg-white transition-transform duration-300 ${
            isSidebarOpen ? "transform -rotate-45 -translate-y-2.5" : ""
          }`}
        ></span>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-gray-800 text-white p-5 transition-transform duration-300 ease-in-out z-40 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <h2 className="text-xl font-bold mb-5">Banshawali</h2>
        <ul>
          <li
            className={`p-2 my-2 rounded cursor-pointer transition-colors duration-200 ${
              currentView === "Table View" ? "bg-teal-500" : "hover:bg-gray-700"
            }`}
            onClick={() => {
              setView("Table View");
              setIsSidebarOpen(false); // Close sidebar on mobile after selection
            }}
          >
            Table
          </li>
          <li
            className={`p-2 my-2 rounded cursor-pointer transition-colors duration-200 ${
              currentView === "Compare View"
                ? "bg-teal-500"
                : "hover:bg-gray-700"
            }`}
            onClick={() => {
              setView("Compare View");
              setIsSidebarOpen(false); // Close sidebar on mobile after selection
            }}
          >
            Compare
          </li>
        </ul>
      </div>

      {/* Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

Sidebar.propTypes = {
  setView: PropTypes.func.isRequired, // Function to set the view
  currentView: PropTypes.string.isRequired, // Current view as a string
};

export default Sidebar;
