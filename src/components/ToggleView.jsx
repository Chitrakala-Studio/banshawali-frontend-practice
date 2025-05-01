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
    } else {
      navigate("/");
    }
  };

  return (
    <div className="absolute top-4 left-4 z-50">
      <div className="flex items-center">
        <span
          className={`text-base font-bold mr-4 
           "text-[#2E4568]"
          `}
        >
          Table
        </span>

        <div
          className="relative w-32 h-10 cursor-pointer"
          onClick={handleToggle}
        >
          <div
            className={`absolute inset-0 rounded-[20px] transition-colors ${
              isTableView ? "bg-[#2E4568]" : "bg-[#E9D4B0]"
            }`}
          />

          <div
            className={`absolute top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#A6C8A5] shadow-md
              flex items-center justify-center transition-transform duration-300
              ${isTableView ? "left-1" : "left-24"}`}
          >
            {isTableView ? (
              <FaTable className="text-[#2E4568]" />
            ) : (
              <FaRegIdCard className="text-[#2E4568]" />
            )}
          </div>
        </div>

        <span
          className={`text-base font-bold ml-4 
            "text-[#2E4568]"
          `}
        >
          Card
        </span>
      </div>
    </div>
  );
};

export default ToggleView;
