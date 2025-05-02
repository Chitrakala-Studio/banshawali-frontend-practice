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
    <div className="card-image-section">
      <style>
        {`
          :root {
            --primary-text: #1F2937;
            --secondary-text: #6B7280;
            --gold-accent: #F49D37;
            --header-maroon: #800000;
            --neutral-gray: #D1D5DB;
          }

          .card-image-section {
            position: relative;
            width: 100%;
            height: 85vh;
            display: flex;
            flex-direction: column;
            overflow-y: ${isExpanded ? "auto" : "hidden"};
            border-radius: 15px 15px 0 0;
            background-color: #fffaf0;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }

          .image-container {
            position: relative;
            width: 100%;
            height: 85vh;
            border-radius: 15px 15px 0 0;
            overflow: hidden;
          }

          .person-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            user-select: none;
          }

          .gradient-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(
              to top,
              rgba(0, 0, 0, 0.9),
              rgba(0, 0, 0, 0.2),
              transparent
            );
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            align-items: flex-start;
            padding: 24px;
            z-index: 10;
          }

          .nav-button {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background-color: #fffaf0;
            padding: 8px;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            opacity: 0;
            transition: opacity 0.3s ease, transform 0.2s ease;
          }

          .nav-button:hover,
          .nav-button:focus {
            transform: translateY(-50%) scale(1.05);
            outline: none;
          }

          .group:hover .nav-button,
          .nav-button:focus {
            opacity: 1;
          }

          .nav-button-left {
            left: 16px;
          }

          .nav-button-right {
            right: 16px;
          }

          .nav-button img {
            width: 24px;
            height: 24px;
          }

          .spacer {
            width: 100%;
            height: ${isMobile ? "48px" : "32px"};
          }
        `}
      </style>

      <div className="image-container group">
        <img
          src={
            person.photo ||
            (person.gender === "Male"
              ? maleImage
              : person.gender === "Female"
              ? femaleImage
              : "https://www.ncenet.com/wp-content/uploads/2020/04/No-image-found.jpg")
          }
          alt={person.name_in_nepali || person.name || "Profile"}
          className="person-image"
        />
        <div className="gradient-overlay">
          <button
            className="nav-button nav-button-left"
            onClick={onScrollLeft}
            onTouchEnd={onScrollLeft}
            aria-label="Scroll Left"
          >
            <img
              src="https://img.icons8.com/?size=100&id=1806&format=png&color=000000"
              alt="Scroll Left"
            />
          </button>
          <button
            className="nav-button nav-button-right"
            onClick={onScrollRight}
            onTouchEnd={onScrollRight}
            aria-label="Scroll Right"
          >
            <img
              src="https://img.icons8.com/?size=100&id=61&format=png&color=000000"
              alt="Scroll Right"
            />
          </button>
          <div className="spacer" />
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