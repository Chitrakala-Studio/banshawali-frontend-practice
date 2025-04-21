import React from "react";
import PropTypes from "prop-types";
import InfoSection from "./InfoSection";

const CardImageSection = ({
  person,
  isExpanded,
  onScrollLeft,
  onScrollRight,
  isHovered,
  onSwipe,
  isMobile,
  maleImage,
  femaleImage,
  convertToNepaliNumerals,
  onToggleInfo,
}) => {
  return (
    <div
      className={`relative w-full h-[85vh] flex flex-col overflow-y-auto ${
        isExpanded ? "overflow-y-scroll" : "overflow-y-hidden"
      }`}
    >
      <div className="relative w-full h-[85vh] rounded-t-lg shadow-lg bg-white">
        <img
          src={
            person.photo ||
            (person.gender === "Male"
              ? maleImage
              : person.gender === "Female"
              ? femaleImage
              : "https://www.ncenet.com/wp-content/uploads/2020/04/No-image-found.jpg")
          }
          alt={person.name_in_nepali}
          className="w-full h-full object-cover select-none"
        />
        <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-end items-start p-4 bg-gradient-to-t from-black/90 via-black/20 to-transparent text-white text-left z-10">
          <button
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-50 p-2 rounded-full z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={onScrollLeft}
            onTouchEnd={onScrollLeft}
          >
            <img
              className="w-6 h-6"
              src="https://img.icons8.com/?size=100&id=1806&format=png&color=000000"
              alt="Scroll Left"
            />
          </button>
          <button
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-50 p-2 rounded-full z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={onScrollRight}
            onTouchEnd={onScrollRight}
          >
            <img
              className="w-6 h-6"
              src="https://img.icons8.com/?size=100&id=61&format=png&color=000000"
              alt="Scroll Right"
            />
          </button>

          <div
            className={
              isMobile
                ? "flex justify-start items-center w-full mb-12 relative -top-3"
                : "flex justify-start items-center w-full mb-8 relative -top-3"
            }
          ></div>
        </div>
      </div>
      {isExpanded && <InfoSection person={person} />}
    </div>
  );
};

CardImageSection.propTypes = {
  person: PropTypes.object.isRequired,
  isExpanded: PropTypes.bool.isRequired,
  onScrollLeft: PropTypes.func.isRequired,
  onScrollRight: PropTypes.func.isRequired,
  isHovered: PropTypes.bool.isRequired,
  onSwipe: PropTypes.func.isRequired,
  isMobile: PropTypes.bool.isRequired,
  maleImage: PropTypes.string.isRequired,
  femaleImage: PropTypes.string.isRequired,
  convertToNepaliNumerals: PropTypes.func.isRequired,
  onToggleInfo: PropTypes.func.isRequired,
};

export default CardImageSection;
