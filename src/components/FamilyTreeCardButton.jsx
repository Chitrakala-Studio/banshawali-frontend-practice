import React from "react";
import PropTypes from "prop-types";

const FamilyTreeCardButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="absolute top-4 right-4 bg-purple-700/70 text-white px-4 py-2 rounded-lg text-sm cursor-pointer z-20 hover:bg-white hover:text-purple-700 transition-colors duration-300"
    >
      Generate Family Tree
    </button>
  );
};

FamilyTreeCardButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default FamilyTreeCardButton;
