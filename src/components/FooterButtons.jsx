import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { FaExchangeAlt, FaSitemap, FaSearch } from "react-icons/fa";

const FooterButtons = ({
  onGenerateFamilyTree,
  id,
  infoPopup,
  isMobile,
  onSearchButtonClick,
}) => {
  const navigate = useNavigate();

  return (
    <div className="w-full flex justify-around items-center">
      <div className="w-full flex justify-around items-center bg-transparent rounded-lg p-4 space-x-4">
        <button
          onClick={() => navigate(`/compare/${id}`)}
          className="flex-1 flex items-center justify-center text-white text-sm font-medium rounded-full h-10 px-6 bg-gradient-to-r from-[#0A6C74] to-[#0A5C64] hover:bg-gradient-to-r hover:from-[#FFD700] hover:to-[#FFD700] transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50 active:scale-95"
        >
          <FaExchangeAlt className="mr-2 w-5 h-5" /> Compare
        </button>
        <button
          onClick={onGenerateFamilyTree}
          className="flex-1 flex items-center justify-center text-white text-sm font-medium rounded-full h-10 px-6 bg-gradient-to-r from-[#0A6C74] to-[#0A5C64] hover:bg-gradient-to-r hover:from-[#FFD700] hover:to-[#FFD700] transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50 active:scale-95"
        >
          <FaSitemap className="mr-2 w-5 h-5" />
          Family Tree
        </button>
        <button
          onClick={onSearchButtonClick}
          className="flex-1 flex items-center justify-center text-white text-sm font-medium rounded-full h-10 px-6 bg-gradient-to-r from-[#0A6C74] to-[#0A5C64] hover:bg-gradient-to-r hover:from-[#FFD700] hover:to-[#FFD700] transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50 active:scale-95"
        >
          <FaSearch className="mr-2 w-5 h-5" /> Search
        </button>
      </div>
    </div>
  );
};

FooterButtons.propTypes = {
  id: PropTypes.number.isRequired,
  onGenerateFamilyTree: PropTypes.func.isRequired,
  onSearchButtonClick: PropTypes.func.isRequired,
  infoPopup: PropTypes.any,
  isMobile: PropTypes.bool,
};

export default FooterButtons;
