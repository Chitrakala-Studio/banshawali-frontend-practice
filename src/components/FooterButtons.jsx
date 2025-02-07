import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { FaExchangeAlt, FaSitemap } from "react-icons/fa";

const FooterButtons = ({ onGenerateFamilyTree,id }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 w-full flex justify-center">
      <div className="w-full max-w-lg flex justify-around items-center p-3">
        <button
          onClick={() => navigate(`/compare/${id}`)}
          className="flex-1 w-1/3 flex justify-center items-center text-white text-sm font-medium rounded-full h-8 px-0 transition-all duration-300 hover:bg-white/20 hover:border-white/30 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50 active:scale-80"
        >
          <FaExchangeAlt className="mr-2" /> Compare
        </button>
        <button
          onClick={onGenerateFamilyTree}
          className="flex-1 w-1/3 flex justify-center items-center text-white text-sm font-medium rounded-full h-8 px-0 transition-all duration-300 hover:bg-white/20 hover:border-white/30 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50 active:scale-80"
        >
          <FaSitemap className="mr-2" /> Generate Family Tree
        </button>
      </div>
    </div>
  );
};

FooterButtons.propTypes = {
  id: PropTypes.number.isRequired, // Expect `id` to be a number
  onGenerateFamilyTree: PropTypes.func.isRequired,
};

export default FooterButtons;
