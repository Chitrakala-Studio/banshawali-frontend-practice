import React, { useState } from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close sidebar when a link is clicked (for mobile view)
  const closeSidebar = () => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 p-2 bg-gray-800 text-white rounded-lg z-50"
      >
        ☰
      </button>

      {/* Sidebar */}
      <div
        className={`w-64 bg-gray-800 text-white flex flex-col fixed h-full transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 z-40`} // Ensure sidebar has a higher z-index
      >
        {/* Banshawali with Link to "/" */}
        <Link
          to="/"
          onClick={closeSidebar}
          className="px-4 py-6 text-2xl font-bold"
        >
          Banshawali
        </Link>

        <nav className="flex-1 px-4 py-2">
          <ul>
            <li className="py-2">
              <Link
                to="/1"
                onClick={closeSidebar}
                className="text-gray-300 hover:text-white"
              >
                Card
              </Link>
            </li>
            <li className="py-2">
              <Link
                to="/compare"
                onClick={closeSidebar}
                className="text-gray-300 hover:text-white"
              >
                Compare
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
