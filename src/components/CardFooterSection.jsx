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
  // Determine if the popup is active for the current person
  const isPopupActive =
    isExpanded && infoPopup === (person.name || person.name_in_nepali);

  return (
    <div
      className={`
        fixed
        bottom-0
        left-1/2
        transform -translate-x-1/2
        ${isMobile ? "w-[98vw]" : "w-[40vw]"}
        z-10
      `}
    >
      <div
        className="bg-[#14632F] shadow-lg pt-12 pb-4 relative"
        style={{
          maskImage:
            "radial-gradient(60% 40px at 50% 0, transparent 98%, black)",
          WebkitMaskImage:
            "radial-gradient(60% 40px at 50% 0, transparent 98%, black)",
          minHeight: "150px",
        }}
      >
        <div className="flex items-center mb-3 px-4">
          {/* Conditionally render name and pusta number on the left */}
          {!isPopupActive && (
            <div className="flex items-center gap-1">
              <h2
                className="
                  text-[#F49D37]
                  px-1
                  py-2
                  font-bold
                  text-m
                "
              >
                {person.name_in_nepali} .
                {convertToNepaliNumerals(person.pusta_number)}
              </h2>
            </div>
          )}
          {/* Spacer to push toggle button to the right */}
          <div className="flex-grow"></div>
          {/* Toggle button always on the right */}
          <button
            className="
              p-2
              text-[#800000]
              text-xl
              bg-[#F49D37]
              rounded-full
              shadow-md
              hover:bg-white
              hover:shadow-lg
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-white/50
            "
            onClick={(e) => {
              e.stopPropagation();
              onToggleInfo(person);
            }}
            aria-label={isExpanded ? "Collapse info" : "Expand info"}
          >
            {isExpanded ? <FaArrowDown /> : <FaArrowUp />}
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
  id: PropTypes.number.isRequired,
  onGenerateFamilyTree: PropTypes.func.isRequired,
  infoPopup: PropTypes.any,
  isMobile: PropTypes.bool.isRequired,
  onSearchButtonClick: PropTypes.func.isRequired,
  isExpanded: PropTypes.bool.isRequired,
  onToggleInfo: PropTypes.func.isRequired,
  convertToNepaliNumerals: PropTypes.func.isRequired,
  person: PropTypes.shape({
    name_in_nepali: PropTypes.string,
    pusta_number: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
};

export default CardFooterSection;
