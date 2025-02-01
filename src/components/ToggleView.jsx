import React from "react";
import { useNavigate } from "react-router-dom";

const ToggleView = ({ isTableView, toggleView }) => {
  const navigate = useNavigate();

  const handleToggle = () => {
    toggleView();
    navigate(isTableView ? "/" : "/table");
  };

  return (
    <div className="absolute top-4 right-4 z-50">
      <label className="flex items-center cursor-pointer">
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
        <span className="ml-2 text-white">
          {isTableView ? "Table View" : "Card View"}
        </span>
      </label>
    </div>
  );
};

export default ToggleView;
