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
              background-color: transparent;
              justify-content: center;
              gap: 8px;
              padding: 8px;
            }

            .action-btn {
              background: #fff8dc;
              border: 1px solid #d1d5db;
              border-radius: 50%;
              padding: 8px;
              width: 36px;
              height: 36px;
              display: flex;
              align-items: center;
              justify-content: center;
            }

            .action-btn:hover,
            .action-btn:focus {
              background: #fff8dc;
              color: #000000;
            }

            .action-btn svg {
              margin-right: 0;
              color: #000000;
            }

            .action-btn:hover svg,
            .action-btn:focus svg {
              color: #000000;
            }

            .icon {
              width: 18px;
              height: 18px;
              color: #000000;
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
