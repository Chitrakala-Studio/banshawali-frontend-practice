import React from "react";
import { useNavigate } from "react-router-dom";

const ToggleView = ({ isTableView, toggleView }) => {
  const navigate = useNavigate();

  const handleToggle = () => {
    toggleView();
    // If it's in table view, navigate to "/1", otherwise navigate to "/"
    navigate(isTableView ? "/1" : "/");
  };

  return (
    <div className="absolute top-4 left-4 z-50">
      <button
        onClick={handleToggle}
        className="flex items-center bg-purple-700/70 p-2 rounded-full shadow-md cursor-pointer transition-all hover:bg-purple-700"
      >
        <div className="relative">
          <input
            type="checkbox"
            className="sr-only"
            checked={isTableView}
            onChange={handleToggle}
          />
          <div
            className={`w-12 h-6 rounded-full shadow-inner transition-colors ${
              isTableView ? "bg-blue-700" : "bg-gray-300"
            }`}
          ></div>
          <div
            className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
              isTableView ? "translate-x-6" : "translate-x-0"
            }`}
          ></div>
        </div>
        <span className="ml-3 text-white text-sm font-medium">
          {isTableView ? "Table View" : "Card View"}
        </span>
      </button>
    </div>
  );
};

export default ToggleView;
