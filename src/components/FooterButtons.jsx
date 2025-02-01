import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const FooterButtons = ({ onGenerateFamilyTree }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full flex justify-around my-1 p-4 text-white rounded-lg bg-gray-800">
      <button
        onClick={() => navigate("/compare")}
        className="flex justify-center items-center bg-purple-700/70 text-white text-base font-normal rounded-full h-10 w-28 ml-5 z-20"
      >
        Compare
      </button>
      <button
        onClick={onGenerateFamilyTree}
        className="flex justify-center items-center py-5 px-10 bg-purple-700/70 text-white text-base font-normal rounded-full h-10 w-45 ml-5 z-20"
      >
        Generate Family Tree
      </button>
    </div>
  );
};

FooterButtons.propTypes = {
  onGenerateFamilyTree: PropTypes.func.isRequired,
};

export default FooterButtons;
