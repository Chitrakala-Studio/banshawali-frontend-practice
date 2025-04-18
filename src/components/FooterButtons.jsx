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
      <div className="w-full flex justify-around items-center bg-[#F49D37] rounded-lg p-2 space-x-2">
        <button
          onClick={() => navigate(`/compare/${id}`)}
          className="flex-1 flex items-center justify-center text-gray-700 text-sm font-medium rounded-full h-8 px-4 bg-white transition-all duration-300 hover:bg-[#F49D37] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50 active:scale-80"
        >
          <FaExchangeAlt className="mr-2" /> Compare
        </button>
        <button
          onClick={onGenerateFamilyTree}
          className="flex-1 flex items-center justify-center text-gray-700 text-sm font-medium rounded-full h-8 px-4 bg-white transition-all duration-300 hover:bg-[#F49D37] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50 active:scale-80"
        >
          <FaSitemap className="mr-2" />
          Family Tree
        </button>
        <button
          onClick={onSearchButtonClick}
          className="flex-1 flex items-center justify-center text-gray-700 text-sm font-medium rounded-full h-8 px-4 bg-white transition-all duration-300 hover:bg-[#F49D37] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50 active:scale-80"
        >
          <FaSearch className="mr-2" /> Search
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
