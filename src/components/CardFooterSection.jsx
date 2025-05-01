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
  console.log("CardFooterSection person:", person);
  const isPopupActive =
    isExpanded && infoPopup === (person?.name || person?.name_in_nepali);

  return (
    <div
      style={{
        position: "fixed",
        bottom: "2rem",
        left: "50%",
        transform: "translateX(-50%)",
        width: isMobile ? "98vw" : "40vw",
        zIndex: 10,
      }}
    >
      <div
        style={{
          backgroundColor: "#2E4568",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          paddingTop: "2rem",
          paddingBottom: "1rem",
          position: "relative",
          minHeight: "120px",
          maskImage:
            "radial-gradient(60% 40px at 50% 0, transparent 98%, black)",
          WebkitMaskImage:
            "radial-gradient(60% 40px at 50% 0, transparent 98%, black)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "1rem",
            padding: "0 1.5rem",
          }}
        >
          {!isPopupActive && (
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <h2
                style={{
                  color: "#B9BAC3",
                  padding: "0.5rem",
                  fontWeight: "600",
                  fontSize: "1.125rem",
                  backgroundColor: "rgba(46,69,104,0.2)",
                  borderRadius: "0.375rem",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                {person?.name_in_nepali || person?.name || "-"}{" "}
                <span style={{ color: "#E9D4B0" }}>.</span>{" "}
                <span style={{ color: "#E9D4B0" }}>
                  {person?.pusta_number
                    ? convertToNepaliNumerals(person.pusta_number)
                    : "-"}
                </span>
              </h2>
            </div>
          )}
          <div style={{ flexGrow: 1 }}></div>
          <button
            style={{
              padding: "0.75rem",
              color: "#B9BAC3",
              fontSize: "1.25rem",
              background: "linear-gradient(135deg, #2E4568 0%, #5A6F94 100%)",
              border: "1px solid #AAABAC",
              borderRadius: "9999px",
              boxShadow:
                "0 4px 6px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.1)",
              transition: "all 0.3s ease",
              cursor: "pointer",
            }}
            onClick={(e) => {
              e.stopPropagation();
              onToggleInfo(person);
            }}
            aria-label={isExpanded ? "Collapse info" : "Expand info"}
            onMouseOver={(e) => {
              e.currentTarget.style.background =
                "linear-gradient(135deg, #E9D4B0 0%, #C7B299 100%)";
              e.currentTarget.style.color = "#000000";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background =
                "linear-gradient(135deg, #2E4568 0%, #5A6F94 100%)";
              e.currentTarget.style.color = "#B9BAC3";
            }}
          >
            {isExpanded ? (
              <FaArrowDown style={{ transition: "transform 0.3s" }} />
            ) : (
              <FaArrowUp style={{ transition: "transform 0.3s" }} />
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
