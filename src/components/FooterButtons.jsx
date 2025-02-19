import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { FaExchangeAlt, FaSitemap } from "react-icons/fa";

const FooterButtons = ({ onGenerateFamilyTree,id ,infoPopup}) => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-2 right-4 w-full flex justify-center ">
      <div className={infoPopup ? "w-full max-w-lg flex justify-around items-center p-3 mx-0 h-10 bg-black rounded-lg " : "w-full max-w-lg flex justify-around items-center p-3"}>
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
