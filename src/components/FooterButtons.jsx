import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { FaSitemap, FaSearch } from "react-icons/fa";
import { ArrowLeftRight } from "lucide-react";

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
            display: flex;
            align-items: flex-end;
            gap: 0px;
            margin-top: 0px;
            margin-bottom: 12px;
            padding: 0 8px;
            justify-content: space-around;
            width: 100%;
          }

          .action-btn {
            width: 60px;
            height: 60px;
            min-width: 60px;
            min-height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #fff8dc 70%, #f9e7c4 100%);
            box-shadow: 0 8px 32px 0 rgba(244, 157, 55, 0.52),
              0 4px 18px 0 rgba(0, 0, 0, 0.32);
            border: 1.5px solid #e9d4b0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            color: #2e4568;
            transition: box-shadow 0.2s, transform 0.2s;
            position: relative;
            margin: 0 2px;
            padding: 0;
          }

          .action-btn:active,
          .action-btn:focus {
            box-shadow: 0 16px 48px 0 rgba(244, 157, 55, 0.60),
              0 8px 24px 0 rgba(0, 0, 0, 0.36);
            transform: scale(1.13);
            outline: none;
          }

          .icon {
            width: 28px;
            height: 28px;
            margin-right: 0;
            color: #2e4568;
            transition: color 0.3s ease;
          }
        `}
      </style>

      <button
        onClick={() => navigate(`/compare/${id}`)}
        className="action-btn"
        aria-label="Compare"
      >
        <ArrowLeftRight size={28} className="icon" />
      </button>
      <button
        onClick={onGenerateFamilyTree}
        className="action-btn"
        aria-label="Generate Family Tree"
      >
        <FaSitemap size={28} className="icon" />
      </button>
      <button
        onClick={onSearchButtonClick}
        className="action-btn"
        aria-label="Search"
      >
        <FaSearch size={28} className="icon" />
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
