import React from "react";
import PropTypes from "prop-types";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import FooterButtons from "./FooterButtons";

const CardFooterSection = ({
  id,
  onGenerateFamilyTree,
  infoPopup,
  isMobile,
  onSearchButtonClick,
  isExpanded,
  onToggleInfo,
  convertToNepaliNumerals,
  person,
}) => {
  const isPopupActive =
    isExpanded && infoPopup === (person?.name || person?.name_in_nepali);

  return (
    <div className="card-footer-section">
      <style>
        {`
          :root {
            --primary-text: #1F2937;
            --secondary-text: #6B7280;
            --primary-dark: #2E4568;
            --primary-hover: #4A6A9D;
            --gold-accent: #F49D37;
            --neutral-gray: #D1D5DB;
          }

          .card-footer-section {
            position: fixed;
            bottom: 2rem;
            left: 50%;
            transform: translateX(-50%);
            width: ${isMobile ? "98vw" : "40vw"};
            z-index: 10;
          }

          .footer-container {
            background-color: var(--primary-dark);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            padding: 24px 24px 16px;
            position: relative;
            border-radius: 15px;
            mask-image: radial-gradient(60% 40px at 50% 0, transparent 98%, black);
            -webkit-mask-image: radial-gradient(60% 40px at 50% 0, transparent 98%, black);
          }

          .footer-content {
            display: flex;
            align-items: center;
            margin-bottom: 16px;
          }

          .person-info {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .person-name {
            font-family: 'Merriweather', serif;
            font-size: 18px;
            font-weight: 600;
            color: #b9bac3;
            padding: 8px;
            background-color: rgba(46, 69, 104, 0.2);
            border-radius: 6px;
            // box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          .highlight {
            color: #e9d4b0;
          }

          .toggle-btn {
            padding: 12px;
            color: #b9bac3;
            font-size: 20px;
            background: linear-gradient(135deg, #2e4568 0%, #5a6f94 100%);
            border: 1px solid #d1d5db;
            border-radius: 50%;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2),
                      inset 0 1px 1px rgba(255, 255, 255, 0.1);
            transition: all 0.3s ease;
            cursor: pointer;
          }

          .toggle-btn:hover,
          .toggle-btn:focus {
            background: linear-gradient(135deg, #e9d4b0 0%, #c7b299 100%);
            color: #000000;
            transform: scale(1.05);
            outline: none;
          }

          .toggle-icon {
            transition: transform 0.3s ease;
          }
        `}
      </style>

      <div className="footer-container">
        <div className="footer-content">
          {!isPopupActive && (
            <div className="person-info">
              <h2 className="person-name">
                {person?.name_in_nepali || person?.name || "-"}
                <span className="highlight">.</span>
                <span className="highlight">
                  {person?.pusta_number
                    ? convertToNepaliNumerals(person.pusta_number)
                    : "-"}
                </span>
              </h2>
            </div>
          )}
          <div style={{ flexGrow: 1 }} />
          <button
            className="toggle-btn"
            onClick={(e) => {
              e.stopPropagation();
              onToggleInfo(person);
            }}
            aria-label={isExpanded ? "Collapse info" : "Expand info"}
          >
            {isExpanded ? (
              <FaArrowDown className="toggle-icon" />
            ) : (
              <FaArrowUp className="toggle-icon" />
            )}
          </button>
        </div>

        <FooterButtons
          id={id}
          onGenerateFamilyTree={onGenerateFamilyTree}
          infoPopup={infoPopup}
          isMobile={isMobile}
          onSearchButtonClick={onSearchButtonClick}
        />
      </div>
    </div>
  );
};

CardFooterSection.propTypes = {
  id: PropTypes.string.isRequired,
  onGenerateFamilyTree: PropTypes.func.isRequired,
  infoPopup: PropTypes.any,
  isMobile: PropTypes.bool.isRequired,
  onSearchButtonClick: PropTypes.func.isRequired,
  isExpanded: PropTypes.bool.isRequired,
  onToggleInfo: PropTypes.func.isRequired,
  convertToNepaliNumerals: PropTypes.func.isRequired,
  person: PropTypes.shape({
    name_in_nepali: PropTypes.string,
    name: PropTypes.string,
    pusta_number: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
};

export default CardFooterSection;