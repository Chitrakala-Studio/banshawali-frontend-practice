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
    <div
      className={
        isMobile
          ? "w-full max-w-lg flex justify-around items-center px-3 py-2" // Simplified for mobile
          : "fixed bottom-2 right-2 w-full flex justify-center" // Desktop positioning
      }
    >
      <div
        className={
          isMobile
            ? "w-full flex justify-around items-center bg-black rounded-lg p-2"
            : infoPopup
            ? "w-full max-w-lg flex justify-around items-center px-3 bg-black rounded-lg"
            : "w-full max-w-lg flex justify-around items-center p-3"
        }
      >
        <button
          onClick={() => navigate(`/compare/${id}`)}
          className="flex-1 w-1/3 flex justify-center items-center text-white text-sm font-medium rounded-full h-8 px-0 bg-white/20 transition-all duration-300 hover:bg-white/40 hover:border-white/30 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50 active:scale-80"
        >
          <FaExchangeAlt className="mr-2" /> Compare
        </button>
        <button
          onClick={onGenerateFamilyTree}
          className="flex-1 w-5/6 flex justify-center items-center text-white text-sm font-medium rounded-full h-10 px-8 bg-white/20 transition-all duration-300 hover:bg-white/40 hover:border-white/30 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50 active:scale-80"
        >
          <FaSitemap className="mr-2" /> Generate Family Tree
        </button>
        <button
          onClick={onSearchButtonClick}
          className="flex-1 w-1/3 flex justify-center items-center text-white text-sm font-medium rounded-full h-8 px-0 bg-white/20 transition-all duration-300 hover:bg-white/40 hover:border-white/30 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50 active:scale-80"
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
