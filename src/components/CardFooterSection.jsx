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
        className="bg-[#0A6C74] shadow-xl pt-8 pb-4 relative"
        style={{
          maskImage:
            "radial-gradient(60% 40px at 50% 0, transparent 98%, black)",
          WebkitMaskImage:
            "radial-gradient(60% 40px at 50% 0, transparent 98%, black)",
          minHeight: "120px",
        }}
      >
        <div className="flex items-center mb-4 px-6">
          {!isPopupActive && (
            <div className="flex items-center gap-2">
              <h2
                className="
                  text-white
                  px-2
                  py-1
                  font-semibold
                  text-lg
                  bg-[#6F42C1]/20
                  rounded-md
                  drop-shadow-md
                "
              >
                {person.name_in_nepali}{" "}
                <span className="text-[#FFD700]">.</span>{" "}
                <span className="text-[#FFD700]">
                  {convertToNepaliNumerals(person.pusta_number)}
                </span>
              </h2>
            </div>
          )}
          <div className="flex-grow"></div>
          <button
            className="
              p-3
              text-white
              text-xl
              bg-[#6F42C1]
              rounded-full
              shadow-md
              hover:bg-[#FFD700]
              hover:shadow-lg
              transition-all duration-300
              focus:outline-none focus:ring-2 focus:ring-white/50
            "
            onClick={(e) => {
              e.stopPropagation();
              onToggleInfo(person);
            }}
            aria-label={isExpanded ? "Collapse info" : "Expand info"}
          >
            {isExpanded ? (
              <FaArrowDown className="transition-transform duration-300 rotate-0" />
            ) : (
              <FaArrowUp className="transition-transform duration-300 rotate-0" />
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
