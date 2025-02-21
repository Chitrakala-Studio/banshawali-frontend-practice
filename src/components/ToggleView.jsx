import React from "react";
import { useNavigate } from "react-router-dom";
import { FaTable, FaRegIdCard } from "react-icons/fa";

const ToggleView = ({ isTableView, toggleView, availableId }) => {
  const navigate = useNavigate();

  const handleToggle = () => {
    toggleView();
    if (isTableView && availableId) {
      navigate(`/card/${availableId}`);
    } else if (!isTableView && availableId) {
      navigate(`/${availableId}`);
    }  else {
      navigate("/");
    }
  };

  return (
    <div className="absolute top-4 left-4 z-50">
      <div className="flex items-center">
        <span
          className={`text-base font-bold mr-4 ${
            isTableView ? "text-black" : "text-gray-400"
          }`}
        >
          Table
        </span>

        <div
          className="relative w-32 h-10 cursor-pointer"
          onClick={handleToggle}
        >
          <div
            className={`absolute inset-0 rounded-[20px] transition-colors ${
              isTableView ? "bg-green-200" : "bg-yellow-200"
            }`}
          />

          <div
            className={`absolute top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-md
              flex items-center justify-center transition-transform duration-300
              ${isTableView ? "left-1" : "left-24"}`}
          >
            {isTableView ? (
              <FaTable className="text-gray-800" />
            ) : (
              <FaRegIdCard className="text-gray-800" />
            )}
          </div>
        </div>

        <span
          className={`text-base font-bold ml-4 ${
            isTableView ? "text-gray-400" : "text-black"
          }`}
        >
          Card
        </span>
      </div>
    </div>
  );
};

export default ToggleView;
