import React, { useState } from "react";

const NavigationButtons = ({ scrollLeft, scrollRight }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <style>
        {`
          :root {
            --primary-dark: #2E4568;
            --primary-hover: #4A6A9D;
            --neutral-white: #FFFFFF;
          }

          .nav-btn {
            background-color: var(--primary-dark);
            color: var(--neutral-white);
            padding: 8px;
            border-radius: 50%;
            transition: all 0.3s ease;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          .nav-btn:hover,
          .nav-btn:focus {
            background-color: var(--primary-hover);
            transform: scale(1.05);
            outline: none;
          }

          .nav-btn svg {
            width: 24px;
            height: 24px;
          }
        `}
      </style>

      {/* Scroll Left Button */}
      <button
        className="nav-btn absolute left-0 top-1/2 transform -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        onClick={scrollLeft}
        onTouchEnd={scrollLeft}
        aria-label="Scroll Left"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* Scroll Right Button */}
      <button
        className="nav-btn absolute right-0 top-1/2 transform -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        onClick={scrollRight}
        onTouchEnd={scrollRight}
        aria-label="Scroll Right"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
};

export default NavigationButtons;