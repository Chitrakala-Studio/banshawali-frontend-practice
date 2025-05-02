import { useState } from "react";
import PropTypes from "prop-types";
import FamilyTreeModal from "./FamilyTreeModal";

const CardViewPopup = ({ selectedData, onClose }) => {
  const [showFamilyTree, setShowFamilyTree] = useState(false);

  if (!selectedData) return null;

  return (
    <>
      <div className="card-view-popup">
        <style>
          {`
            :root {
              --primary-text: #1F2937;
              --secondary-text: #6B7280;
              --header-maroon: #800000;
              --gold-accent: #F49D37;
              --neutral-gray: #D1D5DB;
            }

            .card-view-popup {
              position: fixed;
              inset: 0;
              background-color: rgba(0, 0, 0, 0.6);
              display: flex;
              justify-content: center;
              align-items: center;
              z-index: 50;
              padding: 16px;
              backdrop-filter: blur(5px);
            }

            .popup-container {
              position: relative;
              max-width: 500px;
              width: 100%;
              height: 500px;
              border-radius: 15px;
              background: linear-gradient(to bottom, #fffaf0, #ffffff);
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
              border: 2px solid var(--gold-accent);
              overflow: hidden;
            }

            .background-image {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              object-fit: cover;
              z-index: 0;
            }

            .close-btn {
              position: absolute;
              top: 16px;
              right: 16px;
              background-color: var(--gold-accent);
              color: var(--header-maroon);
              border-radius: 50%;
              width: 40px;
              height: 40px;
              display: flex;
              justify-content: center;
              align-items: center;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
              transition: background-color 0.2s ease, transform 0.2s ease;
              z-index: 10;
            }

            .close-btn:hover,
            .close-btn:focus {
              background-color: #e68b2a;
              transform: scale(1.05);
              outline: none;
            }

            .overlay-content {
              position: absolute;
              inset: 0;
              background: linear-gradient(
                to top,
                rgba(0, 0, 0, 0.9),
                rgba(0, 0, 0, 0.5),
                transparent
              );
              color: #ffffff;
              display: flex;
              flex-direction: column;
              justify-content: flex-end;
              padding: 24px;
              z-index: 5;
            }

            .person-name {
              font-family: 'Playfair Display', serif;
              font-size: 24px;
              font-weight: 600;
              margin-bottom: 8px;
              text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
            }

            .pusta-badge {
              display: flex;
              justify-content: center;
              align-items: center;
              background-color: #e9ffef;
              color: #409261;
              font-family: 'Merriweather', serif;
              font-size: 16px;
              font-weight: 400;
              border-radius: 9999px;
              height: 40px;
              width: 128px;
              margin-top: 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }

            .family-tree-btn {
              margin-top: 16px;
              background-color: #2e4568;
              color: #ffffff;
              padding: 8px 16px;
              border-radius: 4px;
              font-family: 'Merriweather', serif;
              font-size: 14px;
              transition: all 0.3s ease;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }

            .family-tree-btn:hover,
            .family-tree-btn:focus {
              background-color: #4a6a9d;
              transform: scale(1.05);
              outline: none;
            }
          `}
        </style>

        

        <div className="popup-container">
          <img
            src={selectedData.photo_url || "https://www.ncenet.com/wp-content/uploads/2020/04/No-image-found.jpg"}
            alt={selectedData.name || "Profile"}
            className="background-image"
          />
          <button className="close-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
          <div className="overlay-content">
            <h2 className="person-name">{selectedData.name || "-"}</h2>
            <div className="pusta-badge">
              Pusta no. {selectedData.pusta_number || "-"}
            </div>
            <button
              className="family-tree-btn"
              onClick={() => setShowFamilyTree(true)}
              onTouchEnd={() => setShowFamilyTree(true)}
            >
              Generate Family Tree
            </button>
          </div>
        </div>
      </div>

      {showFamilyTree && (
        <FamilyTreeModal
          familyData={selectedData}
          onClose={() => setShowFamilyTree(false)}
        />
      )}
    </>
  );
};

CardViewPopup.propTypes = {
  selectedData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    photo_url: PropTypes.string,
    pusta_number: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CardViewPopup;