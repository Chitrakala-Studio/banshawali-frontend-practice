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
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: ${isMobile ? "12px 0 16px 0" : "16px"};
            gap: ${isMobile ? "24px" : "16px"};
            background: none !important;
            box-shadow: none !important;
            border-top: none !important;
          }
          .action-btn {
            flex: 0 0 auto;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 10px;
            background: transparent !important;
            border: 1px solid #d1d5db;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0,0,0,0.07);
            font-size: 0;
            color: #000000;
            transition: all 0.2s;
            width: 44px;
            height: 44px;
          }
          .action-btn svg {
            color: #2E4568;
            width: 22px;
            height: 22px;
          }
          .action-btn:hover,
          .action-btn:focus {
            background: rgba(244, 157, 55, 0.12) !important;
            color: #000000;
            outline: none;
          }
          .action-btn:hover svg,
          .action-btn:focus svg {
            color: #F49D37;
          }
          @media (max-width: 799px) {
            .footer-buttons {
              gap: 24px;
              padding: 12px 0 16px 0;
              background: none !important;
              border-top: none !important;
              box-shadow: none !important;
            }
            .action-btn {
              width: 44px;
              height: 44px;
              background: transparent !important;
            }
          }
        `}
      </style>

      <button
        onClick={() => navigate(`/compare/${id}`)}
        className="action-btn"
        aria-label="Compare"
      >
        <ArrowLeftRight size={18} />
      </button>
      <button
        onClick={onGenerateFamilyTree}
        className="action-btn"
        aria-label="Generate Family Tree"
      >
        <FaSitemap size={18} />
      </button>
      <button
        onClick={onSearchButtonClick}
        className="action-btn"
        aria-label="Search"
      >
        <FaSearch size={18} />
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
