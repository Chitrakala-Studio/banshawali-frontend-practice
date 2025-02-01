// NavigationButtons.js
import React from "react";

const NavigationButtons = ({ scrollLeft, scrollRight }) => {
  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Scroll Left Button */}
      <button
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-50 p-2 text-white rounded-full z-20 
        opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        onClick={scrollLeft}
        onTouchEnd={scrollLeft}
      >
        <img
          className="w-6 h-6"
          src="https://img.icons8.com/?size=100&id=1806&format=png&color=000000"
          alt="Scroll Left"
        />
      </button>

      {/* Scroll Right Button */}
      <button
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-50 p-2 text-white rounded-full z-20 
        opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        onClick={scrollRight}
        onTouchEnd={scrollRight}
      >
        <img
          className="w-6 h-6"
          src="https://img.icons8.com/?size=100&id=61&format=png&color=000000"
          alt="Scroll Right"
        />
      </button>
    </div>
  );
};

export default NavigationButtons;
