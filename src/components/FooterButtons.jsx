import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { FaExchangeAlt, FaSitemap, FaSearch } from "react-icons/fa";

const FooterButtons = ({
  onGenerateFamilyTree,
  id,
  infoPopup,
  isMobile,
  onSearchButtonClick,
}) => {
  const navigate = useNavigate();

  // Base button styles
  const buttonStyle = {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.875rem",
    fontWeight: "500",
    borderRadius: "9999px",
    height: "2.5rem",
    padding: "0 1.5rem",
    background: "linear-gradient(135deg, #2E4568 0%, #5A6F94 100%)",
    border: "1px solid #AAABAC",
    boxShadow:
      "0 4px 6px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.1)",
    cursor: "pointer",
    transition: "all 0.3s ease",
  };

  // Base icon styles
  const iconStyle = {
    marginRight: "0.5rem",
    width: "1.25rem",
    height: "1.25rem",
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        padding: "1rem",
        gap: "1rem",
      }}
    >
      <button
        onClick={() => navigate(`/compare/${id}`)}
        style={{
          ...buttonStyle,
          color: "#B9BAC3",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background =
            "linear-gradient(135deg, #E9D4B0 0%, #C7B299 100%)";
          e.currentTarget.style.color = "#000000";
          e.currentTarget.querySelector("svg").style.color = "#000000";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background =
            "linear-gradient(135deg, #2E4568 0%, #5A6F94 100%)";
          e.currentTarget.style.color = "#B9BAC3";
          e.currentTarget.querySelector("svg").style.color = "#B9BAC3";
        }}
      >
        <FaExchangeAlt style={{ ...iconStyle, color: "#B9BAC3" }} />
        Compare
      </button>
      <button
        onClick={onGenerateFamilyTree}
        style={{
          ...buttonStyle,
          color: "#B9BAC3",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background =
            "linear-gradient(135deg, #E9D4B0 0%, #C7B299 100%)";
          e.currentTarget.style.color = "#000000";
          e.currentTarget.querySelector("svg").style.color = "#000000";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background =
            "linear-gradient(135deg, #2E4568 0%, #5A6F94 100%)";
          e.currentTarget.style.color = "#B9BAC3";
          e.currentTarget.querySelector("svg").style.color = "#B9BAC3";
        }}
      >
        <FaSitemap style={{ ...iconStyle, color: "#B9BAC3" }} />
        Family Tree
      </button>
      <button
        onClick={onSearchButtonClick}
        style={{
          ...buttonStyle,
          color: "#B9BAC3",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background =
            "linear-gradient(135deg, #E9D4B0 0%, #C7B299 100%)";
          e.currentTarget.style.color = "#000000";
          e.currentTarget.querySelector("svg").style.color = "#000000";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background =
            "linear-gradient(135deg, #2E4568 0%, #5A6F94 100%)";
          e.currentTarget.style.color = "#B9BAC3";
          e.currentTarget.querySelector("svg").style.color = "#B9BAC3";
        }}
      >
        <FaSearch style={{ ...iconStyle, color: "#B9BAC3" }} />
        Search
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
