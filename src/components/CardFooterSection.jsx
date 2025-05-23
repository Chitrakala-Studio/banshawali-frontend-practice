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
     
      
    position: ${isMobile ? "fixed" : "absolute"};
    bottom:   ${isMobile ? "0" : "2rem"};
    left:     ${isMobile ? "0" : "50%"};
    transform:${isMobile ? "none" : "translateX(-50%)"};
    width:    ${isMobile ? "100vw" : "40vw"};
    z-index: 10;
    overflow: visible;
  }

 .footer-container {
    background-color: var(--primary-dark);
    border-radius: 15px;
    padding: 20px 16px 16px;
    /* ↑ bump this mask center 10px higher: */
    mask-image: radial-gradient(60% 60px at 50% -20px, transparent 95%, black);
    -webkit-mask-image: radial-gradient(60% 60px at 50% -20px, transparent 95%, black);
  }


@media (min-width: 800px) {
  .footer-container {
    mask-image: radial-gradient(60% 40px at 50% 0, transparent 98%, black);
    -webkit-mask-image: radial-gradient(60% 40px at 50% 0, transparent 98%, black);
  }
}



          .footer-container {
            
            padding: 0 !important;
          }

          .footer-content {
            display: flex;
            align-items: center;
            margin-bottom: ${isMobile ? "0" : "16px"};
            margin-top: ${isMobile ? "0" : "8px"};
            justify-content: ${isMobile ? "space-between" : "flex-start"};
          }

          .person-info {
            display: flex;
            align-items: center;
            gap: ${isMobile ? "4px" : "8px"};
          }

            @media (max-width: 799px) {
    .footer-container {
      /* drop the mask on mobile if you want fully rectangular footer */
      mask-image: none !important;
      -webkit-mask-image: none !important;
    }
  }

          .person-name {
            font-family: 'Merriweather', serif;
            font-size: ${isMobile ? "14px" : "18px"};
            font-weight: 600;
            color: ${isMobile ? "#d1d5db" : "#b9bac3"};
            padding: ${isMobile ? "4px" : "8px"};
            background-color: ${
              isMobile ? "transparent" : "rgba(46, 69, 104, 0.2)"
            };
            border-radius: ${isMobile ? "0" : "6px"};
          }

          .highlight {
            color: ${isMobile ? "rgba(244, 157, 55, 0.8)" : "#e9d4b0"};
          }

          .toggle-btn {
            padding: ${isMobile ? "2px" : "3px"};
            color: ${isMobile ? "#000000" : "#b9bac3"};
            font-size: ${isMobile ? "18px" : "20px"};
            background: ${
              isMobile
                ? "#fff8dc"
                : "linear-gradient(135deg, #2e4568 0%, #5a6f94 100%)"
            };
            border: ${isMobile ? "1px solid #d1d5db" : "1px solid #d1d5db"};
            border-radius: 50%;
            box-shadow: ${
              isMobile
                ? "none"
                : "0 4px 6px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.1)"
            };
            transition: all 0.3s ease;
            cursor: pointer;
            width: ${isMobile ? "30px" : "auto"};
            height: ${isMobile ? "30px" : "auto"};
            display: ${isMobile ? "flex" : "block"};
            align-items: ${isMobile ? "center" : "initial"};
            justify-content: ${isMobile ? "center" : "initial"};
          }

          .toggle-btn:hover,
          .toggle-btn:focus {
            background: ${
              isMobile
                ? "#fff8dc"
                : "linear-gradient(135deg, #e9d4b0 0%, #c7b299 100%)"
            };
            color: ${isMobile ? "#000000" : "#000000"};
            transform: scale(1.05);
            outline: none;
          }

          .toggle-icon {
            transition: transform 0.3s ease;
            padding: ${isMobile ? "0" : "3px"};
            color: ${isMobile ? "#000000" : "inherit"};
          }

          @media (max-width: 799px) {
            .card-container {
              padding-bottom: 80px !important;
            }

            .footer-container {
              background: none !important;
              box-shadow: none !important;
              border: none !important;
              padding: 0 !important;
            }

            .footer-content {
              justify-content: space-between;
              margin: 0;
            }

            .person-info {
              gap: 4px;
            }

            .person-name {
              font-size: 14px;
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
            }

            .toggle-btn:hover,
            .toggle-btn:focus {
              background: #fff8dc;
              color: #000000;
            }

            .toggle-icon {
              padding: 0;
              color: #000000;
            }

            /* 1) Desktop: add a white “wave” at the top of the footer */
@media (min-width: 800px) {
  .card-footer-section {
    position: absolute;       /* as you already have */
    bottom: 2rem;             /* as you already have */
    left: 50%;                /* as you already have */
    transform: translateX(-50%);
    width: 40vw;
    background: var(--primary-dark);
    z-index: 10;
    overflow: visible;        /* allow the pseudo to show */
  }

  .card-footer-section::before {
    content: "";
    position: absolute;
    top: -30px;               /* pull it up into the white panel */
    left: 0;
    width: 100%;
    height: 30px;
    background: white;
    /* make the bottom of that pseudo curve */
    border-bottom-left-radius: 50% 35px;
    border-bottom-right-radius: 50% 35px;
    z-index: 11;              /* sit above the footer but below your info text */
  }
}

/* 2) Mobile: remove the blue background entirely */
@media (max-width: 799px) {
  .card-footer-section {
    background: transparent !important;
    box-shadow: none    !important;
    border-radius: 0    !important;
  }
}

/* Base footer (desktop) */
.card-footer-section {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  width: 40vw;
  background: var(--primary-dark);
  overflow: visible; /* allow the wave to show */
  z-index: 10;
}

/* draw the curved white “wave” above the footer */
@media (min-width: 800px) {
  .card-footer-section::before {
    content: "";
    position: absolute;
    top: -350px;                
    left: 0;
    width: 100%;
    height: 350px;             
    background: white;
    /* a wider curve: */
    border-bottom-left-radius: 100% 60px;
    border-bottom-right-radius: 100% 60px;
    z-index: 11;
  }
}


/* mobile: full-width, transparent footer */
@media (max-width: 799px) {
  .card-footer-section {
    position: fixed !important;
    bottom: 0 !important;
    left: 0 !important;
    transform: none !important;
    width: 100vw !important;
    background: transparent !important;
    box-shadow: none !important;
  }
}

          }
        `}
      </style>

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
                <FaArrowUp className="toggle-icon" />
              ) : (
                <FaArrowDown className="toggle-icon" />
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
