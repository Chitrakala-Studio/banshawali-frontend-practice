import React from "react";
import { useNavigate } from "react-router-dom";
import { FaTable, FaRegIdCard } from "react-icons/fa";
import PropTypes from "prop-types";

const ToggleView = ({ isTableView, toggleView, availableId }) => {
  const navigate = useNavigate();

  const goToTable = () => {
    if (!isTableView) toggleView();
    if (availableId) {
      navigate(`/${availableId}`);
    } else {
      navigate("/");
    }
  };

  const goToCard = () => {
    if (isTableView) toggleView();
    if (availableId) {
      navigate(`/card/${availableId}`);
    } else {
      navigate("/");
    }
  };

  const handleToggleClick = () => {
    toggleView();
    if (isTableView && availableId) {
      navigate(`/card/${availableId}`);
    } else if (!isTableView && availableId) {
      navigate(`/${availableId}`);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="toggle-view-wrapper">
      <style>
        {`
          :root {
            --primary-text: #1F2937;
            --primary-dark: #2E4568;
            --toggle-off: #D1D5DB;
            --neutral-white: #FFFFFF;
          }

          .toggle-view-wrapper {
            display: flex;
            align-items: center;
            gap: 16px;
          }

          .toggle-label {
            font-family: 'Playfair Display', serif;
            font-size: 16px;
            font-weight: bold;
            color: var(--primary-text);
            cursor: pointer;
            user-select: none;
          }

          .toggle-container {
            position: relative;
            width: 64px;
            height: 32px;
            cursor: pointer;
            border-radius: 20px;
            background-color: var(--toggle-off);
            transition: background-color 0.3s ease;
          }

          .toggle-container.toggled {
            background-color: var(--primary-dark);
          }

          .toggle-handle {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background-color: var(--neutral-white);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: left 0.3s ease;
          }

          .toggle-handle svg {
            color: var(--primary-dark);
            width: 18px;
            height: 18px;
          }
        `}
      </style>

      <span className="toggle-label" onClick={goToTable}>
        Table
      </span>

      <div
        className={`toggle-container ${isTableView ? "toggled" : ""}`}
        onClick={handleToggleClick}
        onKeyPress={(e) => e.key === "Enter" && handleToggleClick()}
        tabIndex={0}
        role="switch"
        aria-checked={isTableView}
      >
        <div
          className="toggle-handle"
          style={{ left: isTableView ? "2px" : "34px" }}
        >
          {isTableView ? <FaTable /> : <FaRegIdCard />}
        </div>
      </div>

      <span className="toggle-label" onClick={goToCard}>
        Card
      </span>
    </div>
  );
};

export default ToggleView;
