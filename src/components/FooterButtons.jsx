import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";


const FooterButtons = ({
  onGenerateFamilyTree,
  id,
  infoPopup,
  isMobile,
  onSearchButtonClick,
}) => {
  const navigate = useNavigate();

  return (
    <div className="footer-buttons">
      <style>
        {`
          :root {
            --primary-text: #1F2937;
            --secondary-text: #6B7280;
            --primary-dark: #2E4568;
            --primary-hover: #4A6A9D;
            --gold-accent: #F49D37;
            --header-maroon: #800000;
            --neutral-gray: #D1D5DB;
            --secondary-bg: #E9D4B0;
            --secondary-bg-hover: #D9C4A0;
          }

          .footer-buttons {
            width: 100%;
            display: flex;
            justify-content: space-around;
            align-items: center;
            padding: 16px;
            gap: 16px;
          }

          .action-btn {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 8px 6px;
            background: linear-gradient(135deg, #2E4568 0%, #5A6F94 100%);
            border: 1px solid var(--neutral-gray);
            border-radius: 9999px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2),
                      inset 0 1px 1px rgba(255, 255, 255, 0.1);
            font-family: 'Merriweather', serif;
            font-size: 14px;
            font-weight: 500;
            color: #b9bac3;
            transition: all 0.3s ease;
            cursor: pointer;
          }

          .action-btn:hover,
          .action-btn:focus {
            background: linear-gradient(135deg, var(--secondary-bg) 0%, var(--secondary-bg-hover) 100%);
            color: #000000;
            outline: none;
          }

          .action-btn:hover svg,
          .action-btn:focus svg {
            color: #000000;
          }

          .icon {
            margin-right: 8px;
            width: 20px;
            height: 20px;
            color: #b9bac3;
            transition: color 0.3s ease;
          }
        `}
      </style>

      <button
        onClick={() => navigate(`/compare/${id}`)}
        className="action-btn"
        aria-label="Compare"
      >
        
        Compare
      </button>
      <button
        onClick={onGenerateFamilyTree}
        className="action-btn"
        aria-label="Generate Family Tree"
      >
        
        Family Tree
      </button>
      <button
        onClick={onSearchButtonClick}
        className="action-btn"
        aria-label="Search"
      >
        
        Search
      </button>
    </div>
  );
};

FooterButtons.propTypes = {
  id: PropTypes.string.isRequired,
  onGenerateFamilyTree: PropTypes.func.isRequired,
  onSearchButtonClick: PropTypes.func.isRequired,
  infoPopup: PropTypes.any,
  isMobile: PropTypes.bool,
};

export default FooterButtons;