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
  isNameAtTop,
  onMoveName,
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
            bottom: 0;
            left: 0;
            transform: none;
            width: 100vw;
            background: transparent;
            z-index: 10;
            overflow: visible;
            
          }
            @media (min-width: 800px) {
  .card-footer-section {
    margin-bottom: 1.5rem;
  }
}


          .footer-container {
            background: transparent;
            box-shadow: none;
            border: none;
            padding: 0;
            position: relative;
            z-index: 20;
          }

          .footer-content {
            padding: 0 1rem 0 1rem;
            justify-content: space-between;
            margin: 0;
            background: none;
            border-radius: 18px 18px 0 0;
            box-shadow: 0 2px 12px 0 rgba(0,0,0,0.10);
            min-height: 64px;
            position: relative;
            z-index: 21;
            display: flex;
            align-items: center;
          }

          .person-info {
            display: flex;
            align-items: center;
            gap: 4px;
          }

          .person-name {
            font-family: 'Merriweather', serif;
            font-size: 14px;
            font-weight: 600;
            color: #d1d5db;
            padding: 4px;
            background-color: transparent;
            border-radius: 0;
          }

          .highlight {
            color: rgba(244, 157, 55, 0.8);
          }

          .toggle-btn {
            background: #fff8dc;
            border: 1px solid #d1d5db;
            color: #000000;
            width: 30px;
            height: 30px;
            padding: 2px;
            font-size: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .toggle-btn:hover,
          .toggle-btn:focus {
            background: #fff8dc;
            color: #000000;
            transform: scale(1.05);
            outline: none;
          }

          .toggle-icon {
            padding: 0;
            color: #000000;
          }
            .card-footer-wrapper {
      width: 100%;
      display: flex;
      justify-content: center;
    }

    .footer-container {
      width: 100%;
      max-width: 600px; /* Same as your .card-container width */
    }
        `}
      </style>
      <div className="card-footer-wrapper">
        <div className="footer-container">
          <div className="footer-content">
            {!isPopupActive && !isNameAtTop && (
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

            {!(isMobile && isNameAtTop) && (
              <button
                className="toggle-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  if (isMobile) {
                    onMoveName();
                  } else {
                    onToggleInfo(person);
                  }
                }}
                onTouchStart={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
                aria-label={
                  isMobile
                    ? isNameAtTop
                      ? "Move back"
                      : "Move to top"
                    : isExpanded
                    ? "Collapse info"
                    : "Expand info"
                }
              >
                {isMobile ? (
                  isNameAtTop ? (
                    <FaArrowDown className="toggle-icon" />
                  ) : (
                    <FaArrowUp className="toggle-icon" />
                  )
                ) : isExpanded ? (
                  <FaArrowDown className="toggle-icon" />
                ) : (
                  <FaArrowUp className="toggle-icon" />
                )}
              </button>
            )}
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
  isNameAtTop: PropTypes.bool,
  onMoveName: PropTypes.func,
};

export default CardFooterSection;
