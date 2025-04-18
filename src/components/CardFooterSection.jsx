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
      <div className="bg-[#F49D37] rounded-t-lg shadow-lg pt-2 pb-0">
        <div className="flex justify-between items-center mb-2">
          <button
            className="
              flex-shrink-0
              bg-[#d8ac6d]
              text-black
              px-3
              py-1
              rounded-full
              font-medium
              text-sm
            "
          >
            {person.name_in_nepali} ·
            {convertToNepaliNumerals(person.pusta_number)}
          </button>

          <button
            className="p-2 text-blacktext-xl"
            onClick={(e) => {
              e.stopPropagation();
              onToggleInfo(person);
            }}
            onTouchEnd={(e) => {
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
