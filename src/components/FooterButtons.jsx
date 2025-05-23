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
            justify-content: space-around;
            align-items: center;
            padding: ${isMobile ? "8px" : "16px"};
            gap: ${isMobile ? "8px" : "16px"};
            background-color: ${isMobile ? "transparent" : "transparent"};
          }

          .action-btn {
            flex: ${isMobile ? "0 0 auto" : "1"};
            display: flex;
            align-items: center;
            justify-content: center;
            padding: ${isMobile ? "8px" : "8px 6px"};
            background: ${
              isMobile
                ? "#fff8dc"
                : "linear-gradient(135deg, #2E4568 0%, #5A6F94 100%)"
            };
            border: ${
              isMobile ? "1px solid #d1d5db" : "1px solid var(--neutral-gray)"
            };
            border-radius: ${isMobile ? "50%" : "9999px"};
            box-shadow: ${
              isMobile
                ? "none"
                : "0 4px 6px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.1)"
            };
            font-family: 'Merriweather', serif;
            font-size: ${isMobile ? "0" : "14px"};
            font-weight: 500;
            color: ${isMobile ? "#000000" : "#b9bac3"};
            transition: all 0.3s ease;
            cursor: pointer;
            width: ${isMobile ? "36px" : "auto"};
            height: ${isMobile ? "36px" : "auto"};
          }

          .action-btn:hover,
          .action-btn:focus {
            background: ${
              isMobile
                ? "#fff8dc"
                : "linear-gradient(135deg, var(--secondary-bg) 0%, var(--secondary-bg-hover) 100%)"
            };
            color: ${isMobile ? "#000000" : "#000000"};
            outline: none;
          }

          .action-btn:hover svg,
          .action-btn:focus svg {
            color: ${isMobile ? "#000000" : "#000000"};
          }

          .icon {
            margin-right: ${isMobile ? "0" : "8px"};
            width: ${isMobile ? "18px" : "20px"};
            height: ${isMobile ? "18px" : "20px"};
            color: ${isMobile ? "#000000" : "#b9bac3"};
            transition: color 0.3s ease;
          }

          @media (max-width: 799px) {
            .footer-buttons {
              display: flex;
              align-items: flex-end;
              gap: 0px;
              margin-top: 0px;
              margin-bottom: 12px;
              padding: 0 8px;
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
            }
          }
          @media (min-width: 800px) {
            .footer-buttons {
              display: flex;
              justify-content: center;
              align-items: center;
              gap: 32px;
              margin-bottom: 8px;
            }
            .footer-btn {
              min-width: 130px;
              height: 52px;
              border-radius: 26px;
              background: linear-gradient(135deg, #fff8dc 70%, #f9e7c4 100%);
              box-shadow: 0 2px 8px 0 rgba(244, 157, 55, 0.12),
                0 1px 4px 0 rgba(0, 0, 0, 0.08);
              border: 1.5px solid #e9d4b0;
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: center;
              font-size: 24px;
              color: #2e4568;
              padding: 0 22px;
              gap: 12px;
              transition: box-shadow 0.2s, transform 0.2s;
              position: relative;
            }
            .footer-btn span {
              display: inline-block;
              font-size: 17px;
              font-weight: 500;
              color: #2e4568;
              margin-left: 10px;
              letter-spacing: 0.01em;
            }
            .footer-btn:active,
            .footer-btn:focus {
              box-shadow: 0 6px 20px 0 rgba(244, 157, 55, 0.22),
                0 3px 12px 0 rgba(0, 0, 0, 0.14);
              transform: scale(1.06);
              outline: none;
            }
          }
        `}
      </style>

      <button
        onClick={() => navigate(`/compare/${id}`)}
        className="action-btn"
        aria-label="Compare"
      >
        <ArrowLeftRight size={18} className="icon" />
        {!isMobile && <span>Compare</span>}
      </button>
      <button
        onClick={onGenerateFamilyTree}
        className="action-btn"
        aria-label="Generate Family Tree"
      >
        <FaSitemap size={18} className="icon" />
        {!isMobile && <span>Family Tree</span>}
      </button>
      <button
        onClick={onSearchButtonClick}
        className="action-btn"
        aria-label="Search"
      >
        <FaSearch size={18} className="icon" />
        {!isMobile && <span>Search</span>}
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
